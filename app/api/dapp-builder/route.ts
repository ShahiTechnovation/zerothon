import { streamText, convertToModelMessages, type UIMessage } from "ai"

export const maxDuration = 60

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json()

  const { WEB3_SYSTEM_PROMPT } = await import("@/lib/web3-system-prompt")

  const result = streamText({
    model: "openai/gpt-4-turbo",
    system: WEB3_SYSTEM_PROMPT,
    messages: convertToModelMessages(messages),
    maxOutputTokens: 4000,
    temperature: 0.7,
  })

  return result.toUIMessageStreamResponse()
}
