/**
 * Multi-Provider LLM System
 * Supports multiple free and paid AI providers
 * Based on bolt.diy and Vercel AI SDK architecture
 */

export interface LLMProvider {
  id: string
  name: string
  models: LLMModel[]
  apiKeyRequired: boolean
  baseUrl?: string
  free?: boolean
}

export interface LLMModel {
  id: string
  name: string
  provider: string
  contextWindow: number
  maxTokens: number
  supportsStreaming: boolean
  supportsFunctions: boolean
  free?: boolean
  description?: string
}

export interface LLMMessage {
  role: 'system' | 'user' | 'assistant' | 'function'
  content: string
  name?: string
  function_call?: any
}

export interface LLMRequest {
  model: string
  messages: LLMMessage[]
  temperature?: number
  maxTokens?: number
  stream?: boolean
  functions?: any[]
  apiKey?: string
}

export interface LLMResponse {
  content: string
  model: string
  usage?: {
    promptTokens: number
    completionTokens: number
    totalTokens: number
  }
  finishReason?: string
}

/**
 * Available LLM Providers
 */
export const LLM_PROVIDERS: LLMProvider[] = [
  {
    id: 'openrouter',
    name: 'OpenRouter',
    apiKeyRequired: true,
    baseUrl: 'https://openrouter.ai/api/v1',
    models: [
      {
        id: 'meta-llama/llama-3.2-3b-instruct:free',
        name: 'Llama 3.2 3B (Free)',
        provider: 'openrouter',
        contextWindow: 2600,
        maxTokens: 4096,
        supportsStreaming: true,
        supportsFunctions: true,
        free: true,
        description: 'Fast, free model for general tasks'
      },
      {
        id: 'google/gemma-2-9b-it:free',
        name: 'Gemma 2 9B (Free)',
        provider: 'openrouter',
        contextWindow: 2600,
        maxTokens: 4096,
        supportsStreaming: true,
        supportsFunctions: true,
        free: true,
        description: 'Google\'s efficient open model'
      },
      {
        id: 'qwen/qwen-2-7b-instruct:free',
        name: 'Qwen 2 7B (Free)',
        provider: 'openrouter',
        contextWindow: 32768,
        maxTokens: 2600,
        supportsStreaming: true,
        supportsFunctions: true,
        free: true,
        description: 'Long context, multilingual'
      }
    ]
  },
  {
    id: 'groq',
    name: 'Groq',
    apiKeyRequired: true,
    baseUrl: 'https://api.groq.com/openai/v1',
    models: [
      {
        id: 'llama-3.3-70b-versatile',
        name: 'Llama 3.3 70B',
        provider: 'groq',
        contextWindow: 2600,
        maxTokens: 2600,
        supportsStreaming: true,
        supportsFunctions: true,
        free: true,
        description: 'Ultra-fast inference, best for coding'
      },
      {
        id: 'llama-3.1-8b-instant',
        name: 'Llama 3.1 8B Instant',
        provider: 'groq',
        contextWindow: 2600,
        maxTokens: 2600,
        supportsStreaming: true,
        supportsFunctions: true,
        free: true,
        description: 'Lightning fast responses'
      },
      {
        id: 'mixtral-8x7b-32768',
        name: 'Mixtral 8x7B',
        provider: 'groq',
        contextWindow: 32768,
        maxTokens: 32768,
        supportsStreaming: true,
        supportsFunctions: true,
        free: true,
        description: 'Long context, high quality'
      }
    ]
  },
  {
    id: 'together',
    name: 'Together AI',
    apiKeyRequired: true,
    baseUrl: 'https://api.together.xyz/v1',
    models: [
      {
        id: 'meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo',
        name: 'Llama 3.1 8B Turbo',
        provider: 'together',
        contextWindow: 2600,
        maxTokens: 4096,
        supportsStreaming: true,
        supportsFunctions: true,
        free: true,
        description: 'Fast and efficient'
      },
      {
        id: 'Qwen/Qwen2.5-7B-Instruct-Turbo',
        name: 'Qwen 2.5 7B Turbo',
        provider: 'together',
        contextWindow: 32768,
        maxTokens: 2600,
        supportsStreaming: true,
        supportsFunctions: true,
        free: true,
        description: 'Great for code generation'
      }
    ]
  },
  {
    id: 'deepseek',
    name: 'DeepSeek',
    apiKeyRequired: true,
    baseUrl: 'https://api.deepseek.com/v1',
    models: [
      {
        id: 'deepseek-chat',
        name: 'DeepSeek Chat',
        provider: 'deepseek',
        contextWindow: 32768,
        maxTokens: 4096,
        supportsStreaming: true,
        supportsFunctions: true,
        free: true,
        description: 'Specialized for coding tasks'
      },
      {
        id: 'deepseek-coder',
        name: 'DeepSeek Coder',
        provider: 'deepseek',
        contextWindow: 16384,
        maxTokens: 4096,
        supportsStreaming: true,
        supportsFunctions: true,
        free: true,
        description: 'Optimized for code generation'
      }
    ]
  },
  {
    id: 'huggingface',
    name: 'HuggingFace',
    apiKeyRequired: false,
    baseUrl: 'https://api-inference.huggingface.co/models',
    free: true,
    models: [
      {
        id: 'mistralai/Mistral-7B-Instruct-v0.2',
        name: 'Mistral 7B Instruct',
        provider: 'huggingface',
        contextWindow: 2600,
        maxTokens: 2048,
        supportsStreaming: false,
        supportsFunctions: false,
        free: true,
        description: 'Free inference API (no key needed)'
      },
      {
        id: 'meta-llama/Meta-Llama-3-8B-Instruct',
        name: 'Llama 3 8B',
        provider: 'huggingface',
        contextWindow: 2600,
        maxTokens: 2048,
        supportsStreaming: false,
        supportsFunctions: false,
        free: true,
        description: 'Free inference API (no key needed)'
      }
    ]
  }
]

/**
 * Get all available models
 */
export function getAllModels(): LLMModel[] {
  return LLM_PROVIDERS.flatMap(provider => provider.models)
}

/**
 * Get models by provider
 */
export function getModelsByProvider(providerId: string): LLMModel[] {
  const provider = LLM_PROVIDERS.find(p => p.id === providerId)
  return provider?.models || []
}

/**
 * Get free models only
 */
export function getFreeModels(): LLMModel[] {
  return getAllModels().filter(model => model.free)
}

/**
 * Get model by ID
 */
export function getModelById(modelId: string): LLMModel | undefined {
  return getAllModels().find(model => model.id === modelId)
}

/**
 * Get provider for a model
 */
export function getProviderForModel(modelId: string): LLMProvider | undefined {
  return LLM_PROVIDERS.find(provider => 
    provider.models.some(model => model.id === modelId)
  )
}

/**
 * Check if API key is required for a model
 */
export function requiresApiKey(modelId: string): boolean {
  const provider = getProviderForModel(modelId)
  return provider?.apiKeyRequired || false
}
