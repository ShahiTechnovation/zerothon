/**
 * Agent Generation API
 * Handles streaming code generation with multi-agent orchestration
 */

import { NextRequest } from 'next/server'
import { orchestrator } from '@/lib/agents/advanced-orchestrator'
import { llmClient } from '@/lib/llm/client'

export const runtime = 'edge'

export async function POST(request: NextRequest) {
  try {
    const { requirements, projectType, chain, model, apiKey } = await request.json()

    if (!requirements) {
      return new Response(
        JSON.stringify({ error: 'Requirements are required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Set API key if provided
    if (apiKey && model) {
      const provider = model.split('/')[0] || model.split('-')[0]
      llmClient.setApiKey(provider, apiKey)
    }

    // Set context
    orchestrator.setContext({
      projectType: projectType || 'custom',
      chain: chain || 'avalanche',
      requirements,
    })

    // Create streaming response
    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const update of orchestrator.executeWorkflow(requirements)) {
            const data = JSON.stringify(update) + '\n'
            controller.enqueue(encoder.encode(`data: ${data}\n\n`))
          }
          
          controller.enqueue(encoder.encode('data: [DONE]\n\n'))
          controller.close()
        } catch (error) {
          const errorData = JSON.stringify({
            type: 'error',
            agent: 'system',
            content: error instanceof Error ? error.message : 'Unknown error',
          })
          controller.enqueue(encoder.encode(`data: ${errorData}\n\n`))
          controller.close()
        }
      },
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    })
  } catch (error) {
    console.error('Agent generation error:', error)
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'Generation failed',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}
