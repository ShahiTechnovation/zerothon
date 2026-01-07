import { streamText, type Message } from "ai"
import { agentOrchestrator } from "@/lib/agent-orchestrator"

export const maxDuration = 60

interface BuildRequest {
  prompt: string
  template: string
  messages?: Message[]
  useOrchestration?: boolean
}

export async function POST(req: Request) {
  const { prompt, template, messages = [], useOrchestration = false }: BuildRequest = await req.json()

  const { WEB3_SYSTEM_PROMPT } = await import("@/lib/web3-system-prompt")

  if (useOrchestration) {
    try {
      const agentResults = await agentOrchestrator.orchestrate(template, prompt)

      // Combine all agent outputs into a comprehensive response
      const combinedOutput = agentResults
        .map(
          (result) => `
## ${result.agentName}
${result.output}
---
`,
        )
        .join("\n")

      return new Response(
        JSON.stringify({
          id: "orchestrated-response",
          role: "assistant",
          content: combinedOutput,
        }),
        {
          headers: { "Content-Type": "application/json" },
        },
      )
    } catch (error) {
      console.error("[v0] Orchestration error:", error)
      // Fall back to standard streaming
    }
  }

  const agenticPrompt = `You are an agentic AI system orchestrating multiple specialized agents to build a Web3 dApp.

Template: ${template}
User Request: ${prompt}

You will coordinate the following agents:
1. Architect Agent: Designs the smart contract architecture and data structures
2. Developer Agent: Generates production-ready Solidity code
3. Security Auditor: Reviews code for vulnerabilities and best practices
4. Gas Optimizer: Optimizes contract for gas efficiency

Generate a complete, production-ready smart contract that fulfills the user's request. Include:
- Comprehensive Solidity code with proper documentation
- Security considerations and access control
- Gas optimization techniques
- Event logging for important state changes
- Error handling and validation

${WEB3_SYSTEM_PROMPT}`

  const conversationMessages = [
    ...messages,
    {
      role: "user" as const,
      content: agenticPrompt,
    },
  ]

  const result = streamText({
    model: "openai/gpt-4-turbo",
    system: WEB3_SYSTEM_PROMPT,
    messages: conversationMessages,
    maxOutputTokens: 4000,
    temperature: 0.7,
  })

  return result.toUIMessageStreamResponse()
}
