'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, Sparkles, Code, FileCode, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { AgentSelector } from './agent-selector'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface ChatInterfaceProps {
  onGenerate: (prompt: string, agentId: string) => void
  isGenerating: boolean
}

export function ChatInterface({ onGenerate, isGenerating }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "👋 Hi! I'm PyVax AI. I can help you build smart contracts and dApps using Python-like syntax. What would you like to create today?",
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState('')
  const [selectedAgent, setSelectedAgent] = useState('core')
  const [showAgentSelector, setShowAgentSelector] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = () => {
    if (!input.trim() || isGenerating) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    onGenerate(input, selectedAgent)
    setInput('')
    setShowAgentSelector(false)

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `I'll help you create that! Generating your smart contract and dApp based on: "${input}"`,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, aiMessage])
    }, 500)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const suggestedPrompts = [
    "Create an ERC20 token with staking",
    "Build an NFT marketplace",
    "Create a DAO voting system",
    "Build a DeFi lending protocol"
  ]

  return (
    <div className="flex flex-col min-h-[600px] max-h-[800px] bg-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-700/50">
      {/* Header */}
      <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-700/50">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-white">PyVax AI</h2>
          <p className="text-xs text-slate-400">Python to Smart Contract Generator</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                message.role === 'user'
                  ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white'
                  : 'bg-slate-800 text-slate-100 border border-slate-700/50'
              }`}
            >
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
              <span className="text-xs opacity-60 mt-1 block">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        ))}
        
        {isGenerating && (
          <div className="flex justify-start">
            <div className="bg-slate-800 text-slate-100 border border-slate-700/50 rounded-2xl px-4 py-3 max-w-[80%]">
              <div className="flex items-center gap-2 mb-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm font-semibold">Building your complete full-stack dApp...</span>
              </div>
              <div className="text-xs text-slate-400 space-y-1">
                <p>⚡ Generating production-ready smart contracts</p>
                <p>🎨 Creating React frontend with Web3 integration</p>
                <p>🔧 Setting up deployment scripts and configuration</p>
                <p className="text-yellow-400 mt-2">⏱️ This may take 30-60 seconds for complete projects</p>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Agent Selector */}
      {showAgentSelector && messages.length === 1 && (
        <div className="px-6 pb-4">
          <AgentSelector selectedAgent={selectedAgent} onSelectAgent={setSelectedAgent} />
        </div>
      )}

      {/* Suggested Prompts */}
      {messages.length === 1 && (
        <div className="px-6 pb-4">
          <p className="text-xs text-slate-400 mb-3">Try these examples:</p>
          <div className="grid grid-cols-2 gap-2">
            {suggestedPrompts.map((prompt, index) => (
              <button
                key={index}
                onClick={() => setInput(prompt)}
                className="text-left px-3 py-2 rounded-lg bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 text-xs text-slate-300 transition-colors"
              >
                <Code className="w-3 h-3 inline mr-2" />
                {prompt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="px-6 pb-6">
        <div className="relative">
          <Textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Describe your smart contract or dApp..."
            className="w-full bg-slate-800 border-slate-700 text-white placeholder-slate-500 pr-12 resize-none rounded-xl"
            rows={3}
            disabled={isGenerating}
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim() || isGenerating}
            className="absolute right-2 bottom-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg h-8 w-8 p-0"
          >
            {isGenerating ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
