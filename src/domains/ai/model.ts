export type AIProvider = 'siliconflow' | 'deepseek' | 'qwen'

export interface AIConfig {
    provider: AIProvider
    apiKey: string
    model: string
    baseUrl: string
}

export interface ChatMessage {
    id: string
    role: 'user' | 'assistant' | 'system'
    content: string
    timestamp: number
    loading?: boolean
}

export interface AIConversation {
    id: string
    title: string
    messages: ChatMessage[]
    createdAt: number
}

export interface ModelInfo {
    id: string
    label: string
    tag?: 'free' | 'vision' | 'reasoning'
}

export const PROVIDER_CONFIG: Record<AIProvider, {
    label: string
    defaultModel: string
    baseUrl: string
    models: ModelInfo[]
    ocrModel?: string
}> = {
    siliconflow: {
        label: '硅基流动',
        defaultModel: 'Qwen/Qwen3-8B',
        baseUrl: 'https://api.siliconflow.cn',
        ocrModel: 'deepseek-ai/DeepSeek-OCR',
        models: [
            { id: 'Qwen/Qwen3-8B', label: 'Qwen3-8B', tag: 'free' },
            { id: 'Qwen/Qwen3-30B-A3B', label: 'Qwen3-30B-A3B', tag: 'free' },
            { id: 'deepseek-ai/DeepSeek-V3', label: 'DeepSeek-V3', tag: 'free' },
            { id: 'deepseek-ai/DeepSeek-R1', label: 'DeepSeek-R1', tag: 'reasoning' },
            { id: 'deepseek-ai/DeepSeek-V3.2', label: 'DeepSeek-V3.2' },
            { id: 'Pro/deepseek-ai/DeepSeek-V3.2', label: 'DeepSeek-V3.2 Pro' },
            { id: 'THUDM/glm-4-9b-chat', label: 'GLM-4-9B', tag: 'free' },
            { id: 'Pro/zai-org/GLM-4.7', label: 'GLM-4.7 Pro' },
            { id: 'Qwen/Qwen2.5-7B-Instruct', label: 'Qwen2.5-7B', tag: 'free' },
            { id: 'tencent/Hunyuan-A13B-Instruct', label: '混元 A13B' },
        ],
    },
    deepseek: {
        label: 'DeepSeek',
        defaultModel: 'deepseek-chat',
        baseUrl: 'https://api.deepseek.com',
        models: [
            { id: 'deepseek-chat', label: 'DeepSeek Chat' },
            { id: 'deepseek-reasoner', label: 'DeepSeek Reasoner', tag: 'reasoning' },
        ],
    },
    qwen: {
        label: '通义千问',
        defaultModel: 'qwen-plus',
        baseUrl: 'https://dashscope.aliyuncs.com/compatible-mode',
        models: [
            { id: 'qwen-turbo', label: 'Qwen Turbo' },
            { id: 'qwen-plus', label: 'Qwen Plus' },
            { id: 'qwen-max', label: 'Qwen Max' },
        ],
    },
}

const STORAGE_KEY = 'atlas-ai-config'

export function loadAIConfig(): AIConfig {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
        try {
            return JSON.parse(raw)
        } catch { /* use defaults */ }
    }
    return {
        provider: 'siliconflow',
        apiKey: '',
        model: 'Qwen/Qwen3-8B',
        baseUrl: 'https://api.siliconflow.cn',
    }
}

export function saveAIConfig(config: AIConfig) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config))
}
