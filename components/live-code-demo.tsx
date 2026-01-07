"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Play, Copy, Check, Sparkles } from "lucide-react"

export function LiveCodeDemo() {
  const [copied, setCopied] = useState(false)
  const [isCompiling, setIsCompiling] = useState(false)
  const [compilationComplete, setCompilationComplete] = useState(false)

  const pythonCode = `from avax_cli.py_contracts import PySmartContract

@PySmartContract
class ERC20Token:
    def __init__(self, name: str, symbol: str, total_supply: uint256):
        self.name = name
        self.symbol = symbol
        self.total_supply = total_supply
        self.balances = {msg.sender: total_supply}
        self.allowances = {}
    
    @public
    def transfer(self, to: address, amount: uint256) -> bool:
        require(self.balances[msg.sender] >= amount, "Insufficient balance")
        self.balances[msg.sender] -= amount
        self.balances[to] += amount
        emit Transfer(msg.sender, to, amount)
        return True
    
    @public
    def approve(self, spender: address, amount: uint256) -> bool:
        self.allowances[msg.sender][spender] = amount
        emit Approval(msg.sender, spender, amount)
        return True`

  const handleCopy = async () => {
    await navigator.clipboard.writeText(pythonCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

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
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-mono font-bold text-white mb-4">See PyVax in Action</h2>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto">
            Write smart contracts in Python with familiar syntax and powerful AST parser compilation
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h3 className="text-xl font-mono text-white">Python Smart Contract</h3>
                {isCompiling && (
                  <div className="flex items-center gap-2 text-blue-400 animate-pulse">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                    <span className="text-sm">Compiling with AST parser...</span>
                  </div>
                )}
                {compilationComplete && (
                  <div className="flex items-center gap-2 text-green-400 animate-fade-in">
                    <Sparkles className="w-4 h-4" />
                    <span className="text-sm">Compiled to EVM bytecode!</span>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleCopy}
                  className="text-slate-400 border-slate-600 hover:border-blue-500 bg-transparent transition-all duration-300 hover:scale-105"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
                <Button
                  size="sm"
                  onClick={handleCompile}
                  disabled={isCompiling}
                  className="bg-gradient-to-r from-blue-500 to-red-500 hover:from-blue-600 hover:to-red-600 text-white transition-all duration-300 hover:scale-105 disabled:scale-100"
                >
                  {isCompiling ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Compiling...
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      Compile
                    </>
                  )}
                </Button>
              </div>
            </div>

            <div className="bg-slate-950 rounded-lg border border-slate-700 overflow-hidden transition-all duration-500 hover:border-slate-600 hover:shadow-2xl hover:shadow-blue-500/10">
              <div className="bg-slate-900 px-4 py-2 border-b border-slate-700">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full transition-all duration-300 hover:scale-110"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full transition-all duration-300 hover:scale-110"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full transition-all duration-300 hover:scale-110"></div>
                  <span className="ml-4 text-sm text-slate-400 font-mono">smart_contract.py</span>
                  {isCompiling && (
                    <div className="ml-auto flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-ping"></div>
                      <span className="text-xs text-blue-400">Processing...</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="p-4 overflow-x-auto">
                <pre className="text-sm text-slate-300 font-mono leading-relaxed">{pythonCode}</pre>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 bg-gradient-to-r from-slate-900 to-slate-800 rounded-xl p-6 border border-slate-700 transition-all duration-500 hover:border-slate-600">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
            <div className="group cursor-pointer transition-all duration-300 hover:scale-105">
              <div className="text-2xl font-mono font-bold text-green-400 group-hover:text-green-300 transition-colors">
                Fast
              </div>
              <div className="text-sm text-slate-400 group-hover:text-slate-300 transition-colors">AST Compilation</div>
            </div>
            <div className="group cursor-pointer transition-all duration-300 hover:scale-105">
              <div className="text-2xl font-mono font-bold text-blue-400 group-hover:text-blue-300 transition-colors">
                Clean
              </div>
              <div className="text-sm text-slate-400 group-hover:text-slate-300 transition-colors">Python Syntax</div>
            </div>
            <div className="group cursor-pointer transition-all duration-300 hover:scale-105">
              <div className="text-2xl font-mono font-bold text-purple-400 group-hover:text-purple-300 transition-colors">
                Direct
              </div>
              <div className="text-sm text-slate-400 group-hover:text-slate-300 transition-colors">EVM Bytecode</div>
            </div>
            <div className="group cursor-pointer transition-all duration-300 hover:scale-105">
              <div className="text-2xl font-mono font-bold text-orange-400 group-hover:text-orange-300 transition-colors">
                Error-Free
              </div>
              <div className="text-sm text-slate-400 group-hover:text-slate-300 transition-colors">Compilation</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
