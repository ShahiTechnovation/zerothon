'use client'

import { useState, useEffect } from 'react'
import { Settings, Key, Sparkles, Check, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export type AIModel = 'openai' | 'gemini' | 'claude' | 'openrouter'

export interface APIConfig {
  model: AIModel
  apiKey: string
}

interface APISettingsProps {
  onConfigChange: (config: APIConfig) => void
}

const AI_MODELS = [
  {
    id: 'openai' as AIModel,
    name: 'OpenAI GPT-4',
    description: 'Most capable model for code generation',
    icon: '🤖',
    color: 'from-green-500 to-emerald-500',
    placeholder: 'sk-...',
  },
  {
    id: 'gemini' as AIModel,
    name: 'Google Gemini 1.5 Flash',
    description: 'Fast and efficient for smart contracts',
    icon: '✨',
    color: 'from-blue-500 to-cyan-500',
    placeholder: 'AIza...',
  },
  {
    id: 'claude' as AIModel,
    name: 'Anthropic Claude',
    description: 'Excellent for security-focused code',
    icon: '🧠',
    color: 'from-purple-500 to-pink-500',
    placeholder: 'sk-ant-...',
  },
  {
    id: 'openrouter' as AIModel,
    name: 'OpenRouter',
    description: 'Access multiple AI models through one API',
    icon: '🌐',
    color: 'from-orange-500 to-red-500',
    placeholder: 'sk-or-...',
  },
]

export function APISettings({ onConfigChange }: APISettingsProps) {
  const [open, setOpen] = useState(false)
  const [selectedModel, setSelectedModel] = useState<AIModel>('openai')
  const [apiKey, setApiKey] = useState('')
  const [isConfigured, setIsConfigured] = useState(false)
  const [showKey, setShowKey] = useState(false)

  // Load saved config from localStorage
  useEffect(() => {
    const savedConfig = localStorage.getItem('pyvax-ai-config')
    if (savedConfig) {
      try {
        const config = JSON.parse(savedConfig) as APIConfig
        setSelectedModel(config.model)
        setApiKey(config.apiKey)
        setIsConfigured(true)
        onConfigChange(config)
      } catch (error) {
        console.error('Failed to load config:', error)
      }
    }
  }, [onConfigChange])

  const handleSave = () => {
    if (!apiKey.trim()) {
      alert('Please enter an API key')
      return
    }

    const config: APIConfig = {
      model: selectedModel,
      apiKey: apiKey.trim(),
    }

    // Save to localStorage
    localStorage.setItem('pyvax-ai-config', JSON.stringify(config))
    setIsConfigured(true)
    onConfigChange(config)
    setOpen(false)
  }

  const handleClear = () => {
    localStorage.removeItem('pyvax-ai-config')
    setApiKey('')
    setIsConfigured(false)
    setOpen(false)
  }

  const selectedModelInfo = AI_MODELS.find(m => m.id === selectedModel)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className={`relative ${
            isConfigured
              ? 'bg-green-500/10 border-green-500/30 hover:bg-green-500/20'
              : 'bg-slate-800 border-slate-700 hover:bg-slate-700'
          }`}
        >
          <Settings className="w-4 h-4 mr-2" />
          AI Settings
          {isConfigured && (
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-900" />
          )}
        </Button>
      </DialogTrigger>

      <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-purple-400" />
            AI Model Configuration
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Model Selection */}
          <div>
            <Label className="text-sm font-semibold text-slate-300 mb-3 block">
              Select AI Model
            </Label>
            <div className="grid grid-cols-1 gap-3">
              {AI_MODELS.map((model) => (
                <button
                  key={model.id}
                  onClick={() => setSelectedModel(model.id)}
                  className={`relative p-4 rounded-xl border transition-all text-left ${
                    selectedModel === model.id
                      ? 'bg-white/10 border-white/30 shadow-lg'
                      : 'bg-white/5 border-white/10 hover:bg-white/8'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${model.color} flex items-center justify-center text-2xl`}>
                      {model.icon}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-white font-semibold mb-1">{model.name}</h4>
                      <p className="text-slate-400 text-sm">{model.description}</p>
                    </div>
                    {selectedModel === model.id && (
                      <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* API Key Input */}
          <div>
            <Label htmlFor="apiKey" className="text-sm font-semibold text-slate-300 mb-2 block">
              API Key for {selectedModelInfo?.name}
            </Label>
            <div className="relative">
              <Input
                id="apiKey"
                type={showKey ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder={selectedModelInfo?.placeholder}
                className="bg-slate-800 border-slate-700 text-white placeholder-slate-500 pr-20"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs"
              >
                {showKey ? 'Hide' : 'Show'}
              </button>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              Your API key is stored locally and never sent to our servers
            </p>
          </div>

          {/* How to get API Key */}
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-blue-300 mb-2 flex items-center gap-2">
              <Key className="w-4 h-4" />
              How to get your API key:
            </h4>
            <ul className="text-xs text-blue-200 space-y-1">
              {selectedModel === 'openai' && (
                <>
                  <li>1. Go to <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="underline">platform.openai.com/api-keys</a></li>
                  <li>2. Create a new API key</li>
                  <li>3. Copy and paste it above</li>
                </>
              )}
              {selectedModel === 'gemini' && (
                <>
                  <li>1. Go to <a href="https://makersuite.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="underline">makersuite.google.com/app/apikey</a></li>
                  <li>2. Create a new API key</li>
                  <li>3. Copy and paste it above</li>
                </>
              )}
              {selectedModel === 'claude' && (
                <>
                  <li>1. Go to <a href="https://console.anthropic.com/settings/keys" target="_blank" rel="noopener noreferrer" className="underline">console.anthropic.com/settings/keys</a></li>
                  <li>2. Create a new API key</li>
                  <li>3. Copy and paste it above</li>
                </>
              )}
              {selectedModel === 'openrouter' && (
                <>
                  <li>1. Go to <a href="https://openrouter.ai/keys" target="_blank" rel="noopener noreferrer" className="underline">openrouter.ai/keys</a></li>
                  <li>2. Sign in or create account</li>
                  <li>3. Create a new API key</li>
                  <li>4. Copy and paste it above</li>
                </>
              )}
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              onClick={handleSave}
              disabled={!apiKey.trim()}
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
            >
              <Check className="w-4 h-4 mr-2" />
              Save Configuration
            </Button>
            {isConfigured && (
              <Button
                onClick={handleClear}
                variant="outline"
                className="bg-red-500/10 border-red-500/30 hover:bg-red-500/20 text-red-400"
              >
                <X className="w-4 h-4 mr-2" />
                Clear
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
