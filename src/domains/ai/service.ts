import type { AIConfig, ChatMessage } from './model'

interface StreamCallbacks {
    onChunk: (text: string) => void
    onDone: () => void
    onError: (error: string) => void
}

type MessagePayload = Pick<ChatMessage, 'role' | 'content'> | {
    role: string
    content: Array<{ type: string; text?: string; image_url?: { url: string } }>
}

async function readSSEStream(
    res: Response,
    callbacks: StreamCallbacks,
) {
    const reader = res.body?.getReader()
    if (!reader) {
        callbacks.onError('无法读取响应流')
        return
    }

    const decoder = new TextDecoder()
    let buffer = ''

    while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() || ''

        for (const line of lines) {
            const trimmed = line.trim()
            if (!trimmed || !trimmed.startsWith('data: ')) continue
            const data = trimmed.slice(6)
            if (data === '[DONE]') {
                callbacks.onDone()
                return
            }
            try {
                const json = JSON.parse(data)
                const delta = json.choices?.[0]?.delta?.content
                if (delta) callbacks.onChunk(delta)
            } catch { /* skip malformed */ }
        }
    }

    callbacks.onDone()
}

export async function chatStream(
    config: AIConfig,
    messages: MessagePayload[],
    callbacks: StreamCallbacks,
    signal?: AbortSignal,
    options?: { model?: string; temperature?: number; max_tokens?: number },
) {
    const url = `${config.baseUrl}/v1/chat/completions`

    try {
        const res = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${config.apiKey}`,
            },
            body: JSON.stringify({
                model: options?.model || config.model,
                messages,
                stream: true,
                temperature: options?.temperature ?? 0.7,
                max_tokens: options?.max_tokens ?? 4096,
                enable_thinking: false,
            }),
            signal,
        })

        if (!res.ok) {
            const body = await res.text()
            callbacks.onError(`API 错误 (${res.status}): ${body}`)
            return
        }

        await readSSEStream(res, callbacks)
    } catch (err: unknown) {
        if (err instanceof DOMException && err.name === 'AbortError') return
        callbacks.onError(err instanceof Error ? err.message : '未知错误')
    }
}

export async function quickPrompt(
    config: AIConfig,
    systemPrompt: string,
    userContent: string,
    callbacks: StreamCallbacks,
    signal?: AbortSignal,
) {
    return chatStream(
        config,
        [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userContent },
        ],
        callbacks,
        signal,
    )
}

/**
 * 使用 DeepSeek-OCR 模型识别图片中的文字。
 * imageData 可以是 URL 或 base64 data URI。
 */
export async function ocrImage(
    config: AIConfig,
    imageData: string,
    callbacks: StreamCallbacks,
    signal?: AbortSignal,
) {
    const ocrModel = 'deepseek-ai/DeepSeek-OCR'

    const messages: MessagePayload[] = [
        {
            role: 'user',
            content: [
                { type: 'image_url', image_url: { url: imageData } },
                { type: 'text', text: '请识别并提取这张图片中的所有文字内容，保持原始格式和结构。如果有表格，请用 Markdown 表格格式输出。' },
            ],
        },
    ]

    return chatStream(config, messages, callbacks, signal, {
        model: ocrModel,
        temperature: 0.1,
        max_tokens: 4096,
    })
}
