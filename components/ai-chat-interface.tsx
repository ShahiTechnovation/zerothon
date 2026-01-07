"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Send, Bot, User, Copy, Check, Sparkles, Rocket, Crown } from "lucide-react"
import { PremiumPricingPopup } from "@/components/premium-pricing-popup"

interface Message {
  id: string
  type: "user" | "ai"
  content: string
  timestamp: Date
  code?: string
}

export function AiChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "ai",
      content:
        "Hello! I'm PyVax AI, powered by GPT-3.5-Turbo through Poe. I'm your intelligent assistant for Python-to-EVM smart contract development. How can I help you today?",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [showPremiumPopup, setShowPremiumPopup] = useState(false)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    const currentInput = input
    setInput("")
    setIsTyping(true)

    try {
      console.log("[v0] Making API call to /api/chat")

      // Call Poe API with GPT-3.5-Turbo model
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: currentInput,
          context:
            "You are PyVax AI, an expert assistant for Python-to-EVM smart contract development. Help users create, optimize, and debug smart contracts using Python syntax that compiles to EVM bytecode. Always provide practical, working code examples.",
        }),
      })

      console.log("[v0] API response status:", response.status)

      if (!response.ok) {
        let errorMessage = "I'm having trouble processing your request right now."

        try {
          const errorData = await response.json()
          console.log("[v0] API error data:", errorData)
          errorMessage = errorData.message || errorMessage
        } catch (parseError) {
          console.log("[v0] Failed to parse error response:", parseError)
        }

        const aiResponse: Message = {
          id: (Date.now() + 1).toString(),
          type: "ai",
          content: errorMessage,
          timestamp: new Date(),
        }

        setMessages((prev) => [...prev, aiResponse])
        return
      }

      const data = await response.json()
      console.log("[v0] API response data:", data)

      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: data.message,
        timestamp: new Date(),
        code: data.code || undefined,
      }

      setMessages((prev) => [...prev, aiResponse])
    } catch (error) {
      console.error("[v0] Error calling Poe API:", error)

      // Fallback response
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content:
          "I apologize, but I'm having trouble connecting to the AI service right now. Please try again in a moment.",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, aiResponse])
    } finally {
      setIsTyping(false)
    }
  }

  const handleCopy = async (code: string, messageId: string) => {
    await navigator.clipboard.writeText(code)
    setCopiedId(messageId)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const handleDeploy = (code: string) => {
    setShowPremiumPopup(true)
  }

  const suggestedPrompts = [
    "Create an ERC-20 token contract in Python",
    "Build a simple NFT marketplace with PyVax",
    "Generate a staking contract with rewards",
    "Create a multi-signature wallet contract",
  ]

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl border border-slate-700 overflow-hidden">
        {/* Chat Header */}
        <div className="bg-slate-900 px-6 py-4 border-b border-slate-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-red-500 rounded-full flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-mono font-semibold text-white">PyVax AI Assistant</h3>
                <p className="text-sm text-slate-400">Powered by GPT-3.5-Turbo • Ready to help</p>
              </div>
            </div>
            <Button
              onClick={() => setShowPremiumPopup(true)}
              className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white px-4 py-2 text-sm font-medium transition-all duration-200 hover:scale-105"
            >
              <Crown className="w-4 h-4 mr-2" />
              Deploy to AVAX
              <Rocket className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>

        {/* Messages */}
        <div className="h-96 overflow-y-auto p-6 space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex gap-3 ${message.type === "user" ? "justify-end" : "justify-start"}`}>
              {message.type === "ai" && (
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-white" />
                </div>
              )}

              <div
                className={`max-w-[80%] rounded-lg p-4 ${
                  message.type === "user"
                    ? "bg-blue-600 text-white"
                    : "bg-slate-800 text-slate-200 border border-slate-700"
                }`}
              >
                <p className="text-sm leading-relaxed">{message.content}</p>

                {message.code && (
                  <div className="mt-3 bg-slate-950 rounded-lg border border-slate-600 overflow-hidden">
                    <div className="flex items-center justify-between px-3 py-2 bg-slate-900 border-b border-slate-600">
                      <span className="text-xs text-slate-400 font-mono">Python Smart Contract</span>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleCopy(message.code!, message.id)}
                          className="h-6 px-2 text-slate-400 hover:text-white"
                        >
                          {copiedId === message.id ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                        </Button>
                      </div>
                    </div>
                    <pre className="p-3 text-xs text-slate-300 font-mono overflow-x-auto">{message.code}</pre>
                    <div className="px-3 py-2 bg-gradient-to-r from-red-500/10 to-orange-500/10 border-t border-slate-600">
                      <div className="flex items-center gap-2 text-xs text-red-400">
                        <Rocket className="w-3 h-3" />
                        <span>Ready for deployment to Avalanche Network</span>
                        <Crown className="w-3 h-3 ml-auto" />
                      </div>
                    </div>
                  </div>
                )}

                <p className="text-xs text-slate-500 mt-2">{message.timestamp.toLocaleTimeString()}</p>
              </div>

              {message.type === "user" && (
                <div className="w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-slate-300" />
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-3 justify-start">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-red-500 rounded-full flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-100"></div>
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-200"></div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Prompts */}
        {messages.length === 1 && (
          <div className="px-6 py-4 border-t border-slate-700">
            <p className="text-sm text-slate-400 mb-3">Try asking:</p>
            <div className="flex flex-wrap gap-2">
              {suggestedPrompts.map((prompt, index) => (
                <button
                  key={index}
                  onClick={() => setInput(prompt)}
                  className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-2 rounded-full border border-slate-600 transition-colors"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="p-6 border-t border-slate-700">
          <div className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSend()}
              placeholder="Ask PyVax AI to generate smart contracts..."
              className="flex-1 bg-slate-800 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors"
            />
            <Button
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
              className="bg-gradient-to-r from-blue-500 to-red-500 hover:from-blue-600 hover:to-red-600 text-white px-6"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Premium Pricing Popup */}
      <PremiumPricingPopup isOpen={showPremiumPopup} onClose={() => setShowPremiumPopup(false)} />
    </div>
  )
}
