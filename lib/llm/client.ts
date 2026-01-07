/**
 * Universal LLM Client
 * Handles requests to multiple AI providers with streaming support
 */

import { LLMRequest, LLMResponse, getProviderForModel, getModelById } from './providers'

export interface StreamChunk {
  content: string
  done: boolean
  model?: string
}

export class LLMClient {
  private apiKeys: Map<string, string> = new Map()

  /**
   * Set API key for a provider
   */
  setApiKey(providerId: string, apiKey: string) {
    this.apiKeys.set(providerId, apiKey)
  }

  /**
   * Get API key for a provider
   */
  private getApiKey(providerId: string): string | undefined {
    return this.apiKeys.get(providerId) || process.env[`${providerId.toUpperCase()}_API_KEY`]
  }

  /**
   * Generate completion (non-streaming)
   */
  async generate(request: LLMRequest): Promise<LLMResponse> {
    const provider = getProviderForModel(request.model)
    const model = getModelById(request.model)

    if (!provider) {
      throw new Error(`Provider not found for model: ${request.model}`)
    }

    const apiKey = request.apiKey || this.getApiKey(provider.id)

    if (provider.apiKeyRequired && !apiKey) {
      throw new Error(`API key required for provider: ${provider.name}`)
    }

    // Route to appropriate provider
    switch (provider.id) {
      case 'huggingface':
        return this.generateHuggingFace(request, provider.baseUrl!)
      case 'openrouter':
      case 'groq':
      case 'together':
      case 'deepseek':
        return this.generateOpenAICompatible(request, provider.baseUrl!, apiKey!)
      default:
        throw new Error(`Unsupported provider: ${provider.id}`)
    }
  }

  /**
   * Generate with streaming
   */
  async *generateStream(request: LLMRequest): AsyncGenerator<StreamChunk> {
    const provider = getProviderForModel(request.model)

    if (!provider) {
      throw new Error(`Provider not found for model: ${request.model}`)
    }

    const apiKey = request.apiKey || this.getApiKey(provider.id)

    if (provider.apiKeyRequired && !apiKey) {
      throw new Error(`API key required for provider: ${provider.name}`)
    }

    // Route to appropriate provider
    switch (provider.id) {
      case 'openrouter':
      case 'groq':
      case 'together':
      case 'deepseek':
        yield* this.streamOpenAICompatible(request, provider.baseUrl!, apiKey!)
        break
      default:
        // Fallback to non-streaming
        const response = await this.generate(request)
        yield { content: response.content, done: true, model: request.model }
    }
  }

  /**
   * OpenAI-compatible API (Groq, Together, DeepSeek, OpenRouter)
   */
  private async generateOpenAICompatible(
    request: LLMRequest,
    baseUrl: string,
    apiKey: string
  ): Promise<LLMResponse> {
    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: request.model,
        messages: request.messages,
        temperature: request.temperature || 0.7,
        max_tokens: request.maxTokens || 4096,
        stream: false,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`LLM API error: ${response.status} - ${error}`)
    }

    const data = await response.json()
    const choice = data.choices[0]

    return {
      content: choice.message.content,
      model: data.model,
      usage: data.usage ? {
        promptTokens: data.usage.prompt_tokens,
        completionTokens: data.usage.completion_tokens,
        totalTokens: data.usage.total_tokens,
      } : undefined,
      finishReason: choice.finish_reason,
    }
  }

  /**
   * OpenAI-compatible streaming
   */
  private async *streamOpenAICompatible(
    request: LLMRequest,
    baseUrl: string,
    apiKey: string
  ): AsyncGenerator<StreamChunk> {
    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: request.model,
        messages: request.messages,
        temperature: request.temperature || 0.7,
        max_tokens: request.maxTokens || 4096,
        stream: true,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`LLM API error: ${response.status} - ${error}`)
    }

    const reader = response.body?.getReader()
    if (!reader) {
      throw new Error('No response body')
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
        if (line.startsWith('data: ')) {
          const data = line.slice(6)
          if (data === '[DONE]') {
            yield { content: '', done: true, model: request.model }
            return
          }

          try {
            const parsed = JSON.parse(data)
            const delta = parsed.choices[0]?.delta
            if (delta?.content) {
              yield { content: delta.content, done: false, model: parsed.model }
            }
          } catch (e) {
            // Skip invalid JSON
          }
        }
      }
    }

    yield { content: '', done: true, model: request.model }
  }

  /**
   * HuggingFace Inference API (Free, no key needed)
   */
  private async generateHuggingFace(
    request: LLMRequest,
    baseUrl: string
  ): Promise<LLMResponse> {
    const modelUrl = `${baseUrl}/${request.model}`
    
    // Format prompt for HuggingFace
    const prompt = request.messages
      .map(msg => {
        if (msg.role === 'system') return `System: ${msg.content}`
        if (msg.role === 'user') return `User: ${msg.content}`
        if (msg.role === 'assistant') return `Assistant: ${msg.content}`
        return msg.content
      })
      .join('\n\n') + '\n\nAssistant:'

    const response = await fetch(modelUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          max_new_tokens: request.maxTokens || 2048,
          temperature: request.temperature || 0.7,
          return_full_text: false,
        },
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`HuggingFace API error: ${response.status} - ${error}`)
    }

    const data = await response.json()
    const generatedText = Array.isArray(data) ? data[0].generated_text : data.generated_text

    return {
      content: generatedText.trim(),
      model: request.model,
    }
  }
}

// Export singleton instance
export const llmClient = new LLMClient()
