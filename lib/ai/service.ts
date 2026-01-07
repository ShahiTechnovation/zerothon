
export type AIProvider = 'openai' | 'anthropic' | 'google' | 'openrouter'

export interface ModelInfo {
    name: string
    label: string
    maxTokenAllowed: number
}

export const PROVIDER_MODELS: Record<AIProvider, ModelInfo[]> = {
    openai: [
        { name: 'gpt-4-turbo-preview', label: 'GPT-4 Turbo', maxTokenAllowed: 4096 },
        { name: 'gpt-4', label: 'GPT-4', maxTokenAllowed: 8192 },
        { name: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo', maxTokenAllowed: 4096 },
    ],
    anthropic: [
        { name: 'claude-3-5-sonnet-20241022', label: 'Claude 3.5 Sonnet', maxTokenAllowed: 8000 },
        { name: 'claude-3-5-haiku-latest', label: 'Claude 3.5 Haiku', maxTokenAllowed: 8000 },
        { name: 'claude-3-opus-latest', label: 'Claude 3 Opus', maxTokenAllowed: 8000 },
    ],
    google: [
        { name: 'gemini-1.5-flash', label: 'Gemini 1.5 Flash', maxTokenAllowed: 8192 },
        { name: 'gemini-1.5-pro', label: 'Gemini 1.5 Pro', maxTokenAllowed: 8192 },
    ],
    openrouter: [
        { name: 'anthropic/claude-3.5-sonnet', label: 'Claude 3.5 Sonnet (OR)', maxTokenAllowed: 8000 },
        { name: 'openai/gpt-4-turbo', label: 'GPT-4 Turbo (OR)', maxTokenAllowed: 4096 },
    ],
}

export function getModelsForProvider(provider: AIProvider): ModelInfo[] {
    return PROVIDER_MODELS[provider] || []
}

export function getAllProviders() {
    return Object.entries(PROVIDER_MODELS).map(([name, models]) => ({
        name: name as AIProvider,
        models,
    }))
}
