"use client"

import { useState } from "react"
import { Play, Save, Share, Settings, Zap, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

export function PlaygroundToolbar() {
  const [isCompiling, setIsCompiling] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState("pyvax-ai")
  const [compilationComplete, setCompilationComplete] = useState(false)

  const templates = [
    { id: "pyvax-ai", name: "PyVax AI Starter", description: "AST parser with direct EVM compilation" },
    { id: "blank", name: "Blank Contract", description: "Start from scratch" },
    { id: "erc20", name: "ERC-20 Token", description: "Standard fungible token" },
    { id: "nft", name: "NFT Collection", description: "Non-fungible token contract" },
    { id: "staking", name: "Staking Pool", description: "DeFi staking rewards" },
    { id: "multisig", name: "Multi-Sig Wallet", description: "Multi-signature security" },
  ]

  const handleCompile = () => {
    setIsCompiling(true)
    setCompilationComplete(false)
    setTimeout(() => {
      setIsCompiling(false)
      setCompilationComplete(true)
      setTimeout(() => setCompilationComplete(false), 3000)
    }, 2000)
  }

  return (
    <div className="bg-slate-900 border-b border-slate-700 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-red-500 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 hover:rotate-12">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-xl font-mono font-bold text-white">PyVax Playground</h1>
            {isCompiling && (
              <div className="flex items-center gap-2 text-blue-400 animate-pulse">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                <span className="text-sm">Compiling...</span>
              </div>
            )}
            {compilationComplete && (
              <div className="flex items-center gap-2 text-green-400 animate-fade-in">
                <Sparkles className="w-4 h-4" />
                <span className="text-sm">Ready!</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-400">Template:</span>
            <select
              value={selectedTemplate}
              onChange={(e) => setSelectedTemplate(e.target.value)}
              className="bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500 transition-all duration-300 hover:border-slate-500 hover:bg-slate-750"
            >
              {templates.map((template) => (
                <option key={template.id} value={template.id} title={template.description}>
                  {template.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={handleCompile}
            disabled={isCompiling}
            className="bg-gradient-to-r from-blue-500 to-red-500 hover:from-blue-600 hover:to-red-600 text-white px-4 py-2 text-sm transition-all duration-300 transform hover:scale-105 disabled:scale-100 disabled:opacity-70"
          >
            {isCompiling ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Compiling...
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                Compile & Run
              </>
            )}
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="text-slate-300 border-slate-600 hover:border-blue-500 bg-transparent transition-all duration-300 hover:scale-105"
          >
            <Save className="w-4 h-4 mr-2" />
            Save
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="text-slate-300 border-slate-600 hover:border-blue-500 bg-transparent transition-all duration-300 hover:scale-105"
          >
            <Share className="w-4 h-4 mr-2" />
            Share
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="text-slate-300 border-slate-600 hover:border-blue-500 bg-transparent transition-all duration-300 hover:scale-105"
          >
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
