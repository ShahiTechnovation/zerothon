'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, Bot, User, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { getModelsForProvider, type AIProvider, type ModelInfo } from '@/lib/ai/service'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface MinimalChatProps {
  onCodeGenerated: (code: string) => void
  onGeneratingChange: (isGenerating: boolean) => void
}

export function MinimalChat({ onCodeGenerated, onGeneratingChange }: MinimalChatProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [agent, setAgent] = useState('core')
  const [provider, setProvider] = useState<AIProvider>('openai')
  const [model, setModel] = useState<string>('')
  const [apiKey, setApiKey] = useState('')
  const [availableModels, setAvailableModels] = useState<ModelInfo[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Load API key from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('pyvax-api-config')
    if (saved) {
      try {
        const config = JSON.parse(saved)
        setProvider(config.provider || 'openai')
        setModel(config.model || '')
        setApiKey(config.apiKey || '')
      } catch (e) {
        console.error('Failed to load API config', e)
      }
    }
  }, [])

  // Update available models when provider changes
  useEffect(() => {
    const models = getModelsForProvider(provider)
    setAvailableModels(models)
    if (!model || !models.find(m => m.name === model)) {
      setModel(models[0]?.name || '')
    }
  }, [provider])

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || !apiKey) return

    const userMessage: Message = { role: 'user', content: input }
    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsGenerating(true)
    onGeneratingChange(true)

    try {
      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: input,
          agentType: agent,
          provider,
          apiKey,
          model: model || undefined,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate code')
      }

      // Handle streaming response
      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      let generatedCode = ''

      if (reader) {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          const chunk = decoder.decode(value)
          generatedCode += chunk
          onCodeGenerated(generatedCode)
        }
      }

      // Add assistant message
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: '✅ Code generated successfully!' },
      ])
    } catch (error: any) {
      console.error('Generation error:', error)
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: `❌ Error: ${error.message}` },
      ])
    } finally {
      setIsGenerating(false)
      onGeneratingChange(false)
    }
  }

  const saveApiConfig = () => {
    localStorage.setItem('pyvax-api-config', JSON.stringify({ provider, model, apiKey }))
  }

  const handleProviderChange = (value: string) => {
    setProvider(value as AIProvider)
  }

  const handleModelChange = (value: string) => {
    setModel(value)
    saveApiConfig()
  }

  return (
    <div className="flex flex-col h-full">
      {/* Agent & Provider Selection */}
      <div className="p-3 border-b bg-white space-y-2">
        <Select value={agent} onValueChange={setAgent}>
          <SelectTrigger className="h-8 text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="core">Core Agent</SelectItem>
            <SelectItem value="security">Security Agent</SelectItem>
            <SelectItem value="token">Token Agent</SelectItem>
            <SelectItem value="dapp">Full-Stack DApp</SelectItem>
          </SelectContent>
        </Select>

        <Select value={provider} onValueChange={handleProviderChange}>
          <SelectTrigger className="h-8 text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="openai">OpenAI</SelectItem>
            <SelectItem value="anthropic">Anthropic</SelectItem>
            <SelectItem value="google">Google</SelectItem>
            <SelectItem value="openrouter">OpenRouter</SelectItem>
          </SelectContent>
        </Select>

        <Select value={model} onValueChange={handleModelChange}>
          <SelectTrigger className="h-8 text-sm">
            <SelectValue placeholder="Select model" />
          </SelectTrigger>
          <SelectContent>
            {availableModels.map((m) => (
              <SelectItem key={m.name} value={m.name}>
                {m.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex gap-1">
          <input
            type="password"
            placeholder="API Key"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            onBlur={saveApiConfig}
            className="flex-1 h-8 px-2 text-xs border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {messages.length === 0 && (
          <div className="text-center text-sm text-gray-500 mt-8">
            <Bot className="w-8 h-8 mx-auto mb-2 text-gray-400" />
            <p>Start by describing your smart contract</p>
          </div>
        )}

        {messages.map((message, i) => (
          <div
            key={i}
            className={`flex gap-2 ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {message.role === 'assistant' && (
              <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-gray-600" />
              </div>
            )}
            <div
              className={`max-w-[80%] px-3 py-2 rounded-lg text-sm ${
                message.role === 'user'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              {message.content}
            </div>
            {message.role === 'user' && (
              <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                <User className="w-4 h-4 text-white" />
              </div>
            )}
          </div>
        ))}

        {isGenerating && (
          <div className="flex gap-2 items-center text-sm text-gray-500">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Generating...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-3 border-t bg-white">
        <div className="flex gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Describe your smart contract..."
            className="flex-1 text-sm resize-none"
            rows={3}
            disabled={isGenerating || !apiKey}
          />
          <Button
            type="submit"
            size="icon"
            disabled={!input.trim() || isGenerating || !apiKey}
            className="flex-shrink-0"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        {!apiKey && (
          <p className="text-xs text-red-500 mt-1">Please enter your API key above</p>
        )}
      </form>
    </div>
  )
}
