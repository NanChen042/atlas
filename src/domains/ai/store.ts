import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import {
    type AIConfig,
    type ChatMessage,
    loadAIConfig,
    saveAIConfig,
} from './model'
import { chatStream, quickPrompt, ocrImage } from './service'

export const useAIStore = defineStore('ai', () => {
    const config = ref<AIConfig>(loadAIConfig())
    const messages = ref<ChatMessage[]>([])
    const isStreaming = ref(false)
    const panelOpen = ref(false)
    const settingsOpen = ref(false)

    let abortController: AbortController | null = null

    const isConfigured = computed(() => config.value.apiKey.trim().length > 0)

    function uid(): string {
        return Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
    }

    function stripThinkTags(text: string): string {
        return text.replace(/<think>[\s\S]*?<\/think>/g, '').trimStart()
    }

    function updateConfig(patch: Partial<AIConfig>) {
        config.value = { ...config.value, ...patch }
        saveAIConfig(config.value)
    }

    function togglePanel() {
        panelOpen.value = !panelOpen.value
    }

    function clearMessages() {
        messages.value = []
    }

    function stopStreaming() {
        abortController?.abort()
        abortController = null
        isStreaming.value = false
        const last = messages.value[messages.value.length - 1]
        if (last?.loading) last.loading = false
    }

    async function sendMessage(content: string) {
        if (!isConfigured.value || isStreaming.value) return

        const userMsg: ChatMessage = {
            id: uid(),
            role: 'user',
            content,
            timestamp: Date.now(),
        }
        messages.value.push(userMsg)

        const assistantMsg: ChatMessage = {
            id: uid(),
            role: 'assistant',
            content: '',
            timestamp: Date.now(),
            loading: true,
        }
        messages.value.push(assistantMsg)

        isStreaming.value = true
        abortController = new AbortController()

        const systemMsg: Pick<ChatMessage, 'role' | 'content'> = {
            role: 'system',
            content: `你是 Atlas 个人知识与生产力助手。你帮助用户整理知识、管理任务、培养习惯。
回答要简洁、有条理，使用中文。当用户请求帮助时，给出实用的建议。
支持 Markdown 格式输出。`,
        }

        const history = messages.value
            .filter(m => !m.loading)
            .map(m => ({ role: m.role, content: m.content }))

        await chatStream(
            config.value,
            [systemMsg, ...history],
            {
                onChunk(text) {
                    assistantMsg.content += text
                    assistantMsg.content = stripThinkTags(assistantMsg.content)
                },
                onDone() {
                    assistantMsg.content = stripThinkTags(assistantMsg.content)
                    assistantMsg.loading = false
                    isStreaming.value = false
                },
                onError(error) {
                    assistantMsg.content = `⚠️ ${error}`
                    assistantMsg.loading = false
                    isStreaming.value = false
                },
            },
            abortController.signal,
        )
    }

    async function runQuickAction(
        systemPrompt: string,
        userContent: string,
        onChunk: (text: string) => void,
    ): Promise<string> {
        if (!isConfigured.value) {
            settingsOpen.value = true
            return ''
        }

        abortController = new AbortController()
        isStreaming.value = true
        let result = ''

        await quickPrompt(
            config.value,
            systemPrompt,
            userContent,
            {
                onChunk(text) {
                    result += text
                    onChunk(text)
                },
                onDone() {
                    isStreaming.value = false
                },
                onError(error) {
                    result = `⚠️ ${error}`
                    isStreaming.value = false
                },
            },
            abortController.signal,
        )

        return result
    }

    async function runOCR(
        imageData: string,
        onChunk: (text: string) => void,
    ): Promise<string> {
        if (!isConfigured.value) {
            settingsOpen.value = true
            return ''
        }

        abortController = new AbortController()
        isStreaming.value = true
        let result = ''

        await ocrImage(
            config.value,
            imageData,
            {
                onChunk(text) {
                    result += text
                    onChunk(text)
                },
                onDone() {
                    isStreaming.value = false
                },
                onError(error) {
                    result = `⚠️ ${error}`
                    isStreaming.value = false
                },
            },
            abortController.signal,
        )

        return result
    }

    return {
        config,
        messages,
        isStreaming,
        panelOpen,
        settingsOpen,
        isConfigured,
        updateConfig,
        togglePanel,
        clearMessages,
        stopStreaming,
        sendMessage,
        runQuickAction,
        runOCR,
    }
})
