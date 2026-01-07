'use client'

/**
 * Agentic Full-Stack Builder
 * Complete AI-powered dApp generation with streaming
 */

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Sparkles, Code2, FileCode, Shield, TestTube, Rocket,
  Loader2, CheckCircle2, AlertCircle, Brain, Zap,
  Download, Copy, Play, Settings
} from 'lucide-react'
import Editor from '@monaco-editor/react'

interface StreamUpdate {
  type: 'thought' | 'action' | 'code' | 'file' | 'test' | 'error' | 'complete'
  agent: string
  content: string
  data?: any
}

interface GeneratedFile {
  name: string
  content: string
  language: string
}

export function AgenticBuilder() {
  const [requirements, setRequirements] = useState('')
  const [projectType, setProjectType] = useState<string>('token')
  const [chain, setChain] = useState<string>('avalanche')
  const [model, setModel] = useState<string>('llama-3.3-70b-versatile')
  const [apiKey, setApiKey] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [updates, setUpdates] = useState<StreamUpdate[]>([])
  const [files, setFiles] = useState<GeneratedFile[]>([])
  const [currentFile, setCurrentFile] = useState<GeneratedFile | null>(null)
  const [showSettings, setShowSettings] = useState(false)

  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [updates])

  const handleGenerate = async () => {
    if (!requirements.trim()) return

    setIsGenerating(true)
    setUpdates([])
    setFiles([])

    try {
      const response = await fetch('/api/agent/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          requirements,
          projectType,
          chain,
          model,
          apiKey: apiKey || undefined,
        }),
      })

      if (!response.ok) {
        throw new Error('Generation failed')
      }

      const reader = response.body?.getReader()
      if (!reader) throw new Error('No response body')

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
            if (data === '[DONE]') continue

            try {
              const update: StreamUpdate = JSON.parse(data)
              setUpdates(prev => [...prev, update])

              // Handle file generation
              if (update.type === 'complete' && update.data) {
                if (update.data.type === 'contract') {
                  const newFile: GeneratedFile = {
                    name: 'contract.py',
                    content: update.data.code,
                    language: 'python',
                  }
                  setFiles(prev => [...prev, newFile])
                  setCurrentFile(newFile)
                } else if (update.data.type === 'frontend') {
                  const newFile: GeneratedFile = {
                    name: 'App.tsx',
                    content: update.data.code,
                    language: 'typescript',
                  }
                  setFiles(prev => [...prev, newFile])
                  if (!currentFile) setCurrentFile(newFile)
                }
              }
            } catch (e) {
              console.error('Failed to parse update:', e)
            }
          }
        }
      }
    } catch (error) {
      setUpdates(prev => [...prev, {
        type: 'error',
        agent: 'system',
        content: error instanceof Error ? error.message : 'Unknown error',
      }])
    } finally {
      setIsGenerating(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const downloadFile = (file: GeneratedFile) => {
    const blob = new Blob([file.content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = file.name
    a.click()
    URL.revokeObjectURL(url)
  }

  const downloadAllFiles = () => {
    files.forEach(file => downloadFile(file))
  }

  const getAgentIcon = (agent: string) => {
    switch (agent) {
      case 'ContractGenerator': return <Code2 className="w-4 h-4" />
      case 'FrontendGenerator': return <FileCode className="w-4 h-4" />
      case 'SecurityAuditor': return <Shield className="w-4 h-4" />
      case 'TestGenerator': return <TestTube className="w-4 h-4" />
      default: return <Brain className="w-4 h-4" />
    }
  }

  const getUpdateIcon = (type: string) => {
    switch (type) {
      case 'thought': return <Brain className="w-4 h-4 text-purple-500" />
      case 'action': return <Zap className="w-4 h-4 text-blue-500" />
      case 'code': return <Code2 className="w-4 h-4 text-green-500" />
      case 'complete': return <CheckCircle2 className="w-4 h-4 text-green-500" />
      case 'error': return <AlertCircle className="w-4 h-4 text-red-500" />
      default: return <Sparkles className="w-4 h-4 text-yellow-500" />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
              <Sparkles className="w-10 h-10 text-purple-400" />
              zerothon Agentic Builder
            </h1>
            <p className="text-slate-400">AI-powered full-stack dApp generation with multi-agent orchestration</p>
          </div>
          <Button
            variant="outline"
            onClick={() => setShowSettings(!showSettings)}
            className="border-purple-500/30 hover:border-purple-500"
          >
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <Card className="p-6 bg-slate-900/50 border-purple-500/30 backdrop-blur">
            <h3 className="text-lg font-semibold text-white mb-4">Configuration</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-slate-300">AI Model</Label>
                <Select value={model} onValueChange={setModel}>
                  <SelectTrigger className="bg-slate-800 border-slate-700">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="llama-3.3-70b-versatile">Llama 3.3 70B (Groq - Fast)</SelectItem>
                    <SelectItem value="llama-3.1-8b-instant">Llama 3.1 8B (Groq - Instant)</SelectItem>
                    <SelectItem value="mixtral-8x7b-32768">Mixtral 8x7B (Groq)</SelectItem>
                    <SelectItem value="deepseek-chat">DeepSeek Chat</SelectItem>
                    <SelectItem value="mistralai/Mistral-7B-Instruct-v0.2">Mistral 7B (Free)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-slate-300">API Key (Optional)</Label>
                <Input
                  type="password"
                  placeholder="Enter API key for better models"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="bg-slate-800 border-slate-700"
                />
              </div>
            </div>
          </Card>
        )}

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Panel */}
          <Card className="p-6 bg-slate-900/50 border-purple-500/30 backdrop-blur">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <Rocket className="w-5 h-5 text-purple-400" />
              Project Configuration
            </h2>

            <div className="space-y-4">
              <div>
                <Label className="text-slate-300">Project Type</Label>
                <Select value={projectType} onValueChange={setProjectType}>
                  <SelectTrigger className="bg-slate-800 border-slate-700">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="token">ERC20 Token</SelectItem>
                    <SelectItem value="nft">NFT Collection</SelectItem>
                    <SelectItem value="defi">DeFi Protocol</SelectItem>
                    <SelectItem value="dao">DAO Governance</SelectItem>
                    <SelectItem value="game">GameFi</SelectItem>
                    <SelectItem value="custom">Custom dApp</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-slate-300">Blockchain</Label>
                <Select value={chain} onValueChange={setChain}>
                  <SelectTrigger className="bg-slate-800 border-slate-700">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="avalanche">Avalanche C-Chain</SelectItem>
                    <SelectItem value="ethereum">Ethereum</SelectItem>
                    <SelectItem value="polygon">Polygon</SelectItem>
                    <SelectItem value="arbitrum">Arbitrum</SelectItem>
                    <SelectItem value="optimism">Optimism</SelectItem>
                    <SelectItem value="base">Base</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-slate-300">Requirements</Label>
                <Textarea
                  placeholder="Describe your dApp in detail...&#10;&#10;Example:&#10;Create a staking contract where users can stake tokens and earn rewards. Include:&#10;- Stake and unstake functions&#10;- Reward calculation based on time&#10;- Emergency withdraw&#10;- Owner controls for reward rate"
                  value={requirements}
                  onChange={(e) => setRequirements(e.target.value)}
                  className="min-h-[200px] bg-slate-800 border-slate-700 text-white"
                />
              </div>

              <Button
                onClick={handleGenerate}
                disabled={isGenerating || !requirements.trim()}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generate Full-Stack dApp
                  </>
                )}
              </Button>
            </div>

            {/* Agent Activity */}
            {updates.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                  <Brain className="w-5 h-5 text-purple-400" />
                  Agent Activity
                </h3>
                <ScrollArea className="h-[300px] rounded-lg bg-slate-800/50 p-4" ref={scrollRef}>
                  <div className="space-y-3">
                    {updates.map((update, idx) => (
                      <div key={idx} className="flex items-start gap-3 text-sm">
                        {getUpdateIcon(update.type)}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline" className="text-xs">
                              {update.agent}
                            </Badge>
                            <span className="text-xs text-slate-500">{update.type}</span>
                          </div>
                          <p className="text-slate-300">{update.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            )}
          </Card>

          {/* Output Panel */}
          <Card className="p-6 bg-slate-900/50 border-purple-500/30 backdrop-blur">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                <FileCode className="w-5 h-5 text-purple-400" />
                Generated Code
              </h2>
              {files.length > 0 && (
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => currentFile && copyToClipboard(currentFile.content)}
                    className="border-purple-500/30"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={downloadAllFiles}
                    className="border-purple-500/30"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download All
                  </Button>
                </div>
              )}
            </div>

            {files.length > 0 ? (
              <Tabs defaultValue={files[0]?.name} className="w-full">
                <TabsList className="bg-slate-800">
                  {files.map((file) => (
                    <TabsTrigger
                      key={file.name}
                      value={file.name}
                      onClick={() => setCurrentFile(file)}
                      className="data-[state=active]:bg-purple-600"
                    >
                      {file.name}
                    </TabsTrigger>
                  ))}
                </TabsList>
                {files.map((file) => (
                  <TabsContent key={file.name} value={file.name} className="mt-4">
                    <div className="rounded-lg overflow-hidden border border-slate-700">
                      <Editor
                        height="500px"
                        language={file.language}
                        value={file.content}
                        theme="vs-dark"
                        options={{
                          readOnly: false,
                          minimap: { enabled: false },
                          fontSize: 14,
                          lineNumbers: 'on',
                          scrollBeyondLastLine: false,
                          automaticLayout: true,
                        }}
                      />
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            ) : (
              <div className="h-[500px] flex items-center justify-center border border-dashed border-slate-700 rounded-lg">
                <div className="text-center">
                  <Code2 className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                  <p className="text-slate-400">Generated code will appear here</p>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}
