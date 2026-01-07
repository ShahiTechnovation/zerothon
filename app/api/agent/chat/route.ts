/**
 * Agent Chat API
 * Handles conversational interactions with AI agents
 */

import { NextRequest, NextResponse } from 'next/server'
import { llmClient } from '@/lib/llm/client'
import { LLMMessage } from '@/lib/llm/providers'

export async function POST(request: NextRequest) {
  try {
    const { messages, model, apiKey, stream = false } = await request.json()

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Messages array is required' },
        { status: 400 }
      )
    }

    // Set API key if provided
    if (apiKey && model) {
      const provider = model.split('/')[0] || model.split('-')[0]
      llmClient.setApiKey(provider, apiKey)
    }

    // Default to free model if none specified
    const selectedModel = model || 'mistralai/Mistral-7B-Instruct-v0.2'

    if (stream) {
      // Streaming response
      const encoder = new TextEncoder()
      const streamResponse = new ReadableStream({
        async start(controller) {
          try {
            for await (const chunk of llmClient.generateStream({
              model: selectedModel,
              messages: messages as LLMMessage[],
              temperature: 0.7,
              maxTokens: 4096,
              stream: true,
            })) {
              if (!chunk.done && chunk.content) {
                const data = JSON.stringify({ content: chunk.content })
                controller.enqueue(encoder.encode(`data: ${data}\n\n`))
              }
            }
            
            controller.enqueue(encoder.encode('data: [DONE]\n\n'))
            controller.close()
          } catch (error) {
            const errorData = JSON.stringify({
              error: error instanceof Error ? error.message : 'Unknown error',
            })
            controller.enqueue(encoder.encode(`data: ${errorData}\n\n`))
            controller.close()
          }
        },
      })

      return new Response(streamResponse, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        },
      })
    } else {
      // Non-streaming response
      const response = await llmClient.generate({
        model: selectedModel,
        messages: messages as LLMMessage[],
        temperature: 0.7,
        maxTokens: 4096,
      })

      return NextResponse.json({
        message: response.content,
        model: response.model,
        usage: response.usage,
      })
    }
  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Chat failed',
      },
      { status: 500 }
    )
  }
}
