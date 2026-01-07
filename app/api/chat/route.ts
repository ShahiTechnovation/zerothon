import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { message, context } = await request.json()

    if (!process.env.POE_API_KEY) {
      return NextResponse.json(
        {
          message: "zerothon AI is not configured. Please add your Poe API key to use this feature.",
          error: "MISSING_API_KEY",
        },
        { status: 500 },
      )
    }

    const response = await fetch("https://api.poe.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.POE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "GPT-3.5-Turbo", // Using free GPT model through Poe
        messages: [
          {
            role: "system",
            content: context,
          },
          {
            role: "user",
            content: message,
          },
        ],
        max_tokens: 2000,
        temperature: 0.7,
      }),
    })

    if (!response.ok) {
      let errorMessage = "I'm having trouble processing your request right now."
      let errorType = "API_ERROR"

      if (response.status === 402) {
        errorMessage =
          "zerothon AI requires a Poe subscription or credits. Please check your Poe account status at poe.com."
        errorType = "PAYMENT_REQUIRED"
      } else if (response.status === 401) {
        errorMessage = "Invalid Poe API key. Please check your API key configuration."
        errorType = "INVALID_API_KEY"
      } else if (response.status === 429) {
        errorMessage = "Rate limit exceeded. Please wait a moment before trying again."
        errorType = "RATE_LIMIT"
      } else if (response.status >= 500) {
        errorMessage = "Poe API is currently unavailable. Please try again later."
        errorType = "SERVER_ERROR"
      }

      return NextResponse.json(
        {
          message: errorMessage,
          error: errorType,
        },
        { status: response.status },
      )
    }

    const data = await response.json()
    const aiMessage = data.choices[0].message.content

    // Extract code if present (simple regex for Python code blocks)
    const codeMatch = aiMessage.match(/```python\n([\s\S]*?)\n```/)
    const code = codeMatch ? codeMatch[1] : null

    // Remove code block from message if extracted
    const cleanMessage = code ? aiMessage.replace(/```python\n[\s\S]*?\n```/, "").trim() : aiMessage

    return NextResponse.json({
      message: cleanMessage,
      code: code,
    })
  } catch (error) {
    console.error("Error calling Poe API:", error)

    return NextResponse.json(
      {
        message: "I'm having trouble processing your request right now. Please try again later.",
        error: "API_ERROR",
      },
      { status: 500 },
    )
  }
}
