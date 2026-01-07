"use client"

import type React from "react"

import { useState, useRef } from "react"
import { motion } from "framer-motion"
import { Sparkles, Code2, Zap, GitBranch, Play, Settings, Copy, Check } from "lucide-react"

interface Agent {
  id: string
  name: string
  role: string
  status: "idle" | "thinking" | "executing"
  progress: number
}

interface DAppTemplate {
  id: string
  name: string
  description: string
  category: "defi" | "nft" | "dao" | "token" | "bridge"
  icon: string
}

const DAPP_TEMPLATES: DAppTemplate[] = [
  {
    id: "uniswap-clone",
    name: "DEX (Uniswap Clone)",
    description: "Decentralized exchange with AMM",
    category: "defi",
    icon: "💱",
  },
  {
    id: "nft-marketplace",
    name: "NFT Marketplace",
    description: "Buy, sell, and trade NFTs",
    category: "nft",
    icon: "🖼️",
  },
  {
    id: "dao-governance",
    name: "DAO Governance",
    description: "Decentralized autonomous organization",
    category: "dao",
    icon: "🏛️",
  },
  {
    id: "token-factory",
    name: "Token Factory",
    description: "Create and manage custom tokens",
    category: "token",
    icon: "🪙",
  },
  {
    id: "bridge-protocol",
    name: "Cross-Chain Bridge",
    description: "Bridge assets between chains",
    category: "bridge",
    icon: "🌉",
  },
]

const AGENTS: Agent[] = [
  { id: "architect", name: "Architect Agent", role: "Smart Contract Design", status: "idle", progress: 0 },
  { id: "developer", name: "Developer Agent", role: "Code Generation", status: "idle", progress: 0 },
  { id: "auditor", name: "Security Auditor", role: "Vulnerability Detection", status: "idle", progress: 0 },
  { id: "optimizer", name: "Gas Optimizer", role: "Performance Tuning", status: "idle", progress: 0 },
]

export function AIDAppBuilder() {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const [prompt, setPrompt] = useState("")
  const [agents, setAgents] = useState<Agent[]>(AGENTS)
  const [copied, setCopied] = useState(false)
  const [useOrchestration, setUseOrchestration] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [generatedCode, setGeneratedCode] = useState("")
  const codeRef = useRef<HTMLDivElement>(null)

  const handleBuild = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!prompt.trim() || !selectedTemplate) return

    setIsLoading(true)
    const agentSequence = ["architect", "developer", "auditor", "optimizer"]
    let agentIndex = 0

    const agentInterval = setInterval(
      () => {
        if (agentIndex < agentSequence.length) {
          const currentAgentId = agentSequence[agentIndex]

          setAgents((prev) =>
            prev.map((a) => {
              if (a.id === currentAgentId) {
                return { ...a, status: "thinking" as const, progress: 0 }
              }
              return a
            }),
          )

          let progress = 0
          const progressInterval = setInterval(() => {
            progress += Math.random() * 30
            if (progress >= 100) {
              progress = 100
              clearInterval(progressInterval)
              setAgents((prev) =>
                prev.map((a) => (a.id === currentAgentId ? { ...a, status: "executing" as const, progress: 100 } : a)),
              )
            } else {
              setAgents((prev) => prev.map((a) => (a.id === currentAgentId ? { ...a, progress } : a)))
            }
          }, 200)

          agentIndex++
        } else {
          clearInterval(agentInterval)
          setAgents((prev) => prev.map((a) => ({ ...a, status: "idle" as const, progress: 0 })))

          // Generate sample code after agents complete
          const sampleCode = `@contract
class ${selectedTemplate === "uniswap-clone" ? "DEX" : selectedTemplate === "nft-marketplace" ? "NFTMarketplace" : "DApp"}:
    def __init__(self):
        self.owner = msg.sender
        self.initialized = True
    
    @public
    def ${selectedTemplate === "uniswap-clone" ? "swap" : "execute"}(self, amount: uint256) -> bool:
        require(amount > 0, "Invalid amount")
        # ${prompt}
        return True`

          setGeneratedCode(sampleCode)
          setIsLoading(false)
        }
      },
      useOrchestration ? 3000 : 2000,
    )
  }

  const copyToClipboard = () => {
    if (generatedCode) {
      navigator.clipboard.writeText(generatedCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <Sparkles className="w-8 h-8 text-blue-500" />
            <h1 className="text-4xl font-bold">zerothon AI dApp Builder</h1>
          </div>
          <p className="text-slate-400 text-lg">Build production-ready Web3 dApps using agentic AI orchestration</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Panel - Templates & Input */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-1">
            <div className="space-y-6">
              {/* Templates */}
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-6 border border-slate-700">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Code2 className="w-5 h-5 text-blue-500" />
                  Templates
                </h2>
                <div className="space-y-2">
                  {DAPP_TEMPLATES.map((template) => (
                    <motion.button
                      key={template.id}
                      onClick={() => setSelectedTemplate(template.id)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`w-full text-left p-3 rounded-lg transition-all ${selectedTemplate === template.id
                        ? "bg-blue-600 border border-blue-500"
                        : "bg-slate-700/50 border border-slate-600 hover:bg-slate-700"
                        }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{template.icon}</span>
                        <div>
                          <div className="font-medium text-sm">{template.name}</div>
                          <div className="text-xs text-slate-400">{template.description}</div>
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Prompt Input */}
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-6 border border-slate-700">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-yellow-500" />
                  Describe Your dApp
                </h2>
                <form onSubmit={handleBuild} className="space-y-4">
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Describe what you want to build... e.g., 'A DEX with liquidity pools and yield farming'"
                    className="w-full h-32 bg-slate-700/50 border border-slate-600 rounded-lg p-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 resize-none"
                  />
                  <label className="flex items-center gap-2 text-sm text-slate-300">
                    <input
                      type="checkbox"
                      checked={useOrchestration}
                      onChange={(e) => setUseOrchestration(e.target.checked)}
                      className="w-4 h-4 rounded border-slate-600 bg-slate-700"
                    />
                    Use Full Agent Orchestration
                  </label>
                  <motion.button
                    type="submit"
                    disabled={isLoading || !prompt.trim() || !selectedTemplate}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all"
                  >
                    <Play className="w-4 h-4" />
                    {isLoading ? "Building..." : "Build dApp"}
                  </motion.button>
                </form>
              </div>
            </div>
          </motion.div>

          {/* Middle Panel - Agent Orchestration */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-1">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-6 border border-slate-700 h-full">
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <GitBranch className="w-5 h-5 text-purple-500" />
                Agent Orchestration
              </h2>
              <div className="space-y-4">
                {agents.map((agent, index) => (
                  <motion.div
                    key={agent.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-slate-700/50 rounded-lg p-4 border border-slate-600"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <div className="font-semibold text-sm">{agent.name}</div>
                        <div className="text-xs text-slate-400">{agent.role}</div>
                      </div>
                      <div
                        className={`w-3 h-3 rounded-full ${agent.status === "idle"
                          ? "bg-slate-500"
                          : agent.status === "thinking"
                            ? "bg-yellow-500 animate-pulse"
                            : "bg-green-500"
                          }`}
                      />
                    </div>
                    <div className="w-full bg-slate-600/50 rounded-full h-2 overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${agent.progress}%` }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right Panel - Generated Code */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-1">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-6 border border-slate-700 h-full flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <Code2 className="w-5 h-5 text-green-500" />
                  Generated Contract
                </h2>
                {generatedCode && (
                  <motion.button
                    onClick={copyToClipboard}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-2 hover:bg-slate-700 rounded-lg transition-all"
                  >
                    {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                  </motion.button>
                )}
              </div>
              <div
                ref={codeRef}
                className="flex-1 overflow-auto bg-slate-900/50 rounded-lg p-4 font-mono text-sm border border-slate-600"
              >
                {generatedCode ? (
                  <pre className="text-slate-300 whitespace-pre-wrap break-words">{generatedCode}</pre>
                ) : (
                  <div className="text-slate-500 text-center py-8">
                    {isLoading ? (
                      <div className="space-y-2">
                        <div className="animate-pulse">Generating contract...</div>
                        <div className="text-xs">Agents are orchestrating...</div>
                      </div>
                    ) : (
                      "Select a template and describe your dApp to generate code"
                    )}
                  </div>
                )}
              </div>
              {generatedCode && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="mt-4 w-full bg-slate-700 hover:bg-slate-600 py-2 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all"
                >
                  <Settings className="w-4 h-4" />
                  Deploy Contract
                </motion.button>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
