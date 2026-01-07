"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"

export function CodeTransformation() {
  const [currentStep, setCurrentStep] = useState(0)

  const transformationSteps = [
    {
      title: "Python Smart Contract",
      language: "python",
      code: `@contract
class SimpleToken:
    def __init__(self, name: str, symbol: str):
        self.name = name
        self.symbol = symbol
        self.balances = {}
    
    def mint(self, to: address, amount: uint256):
        self.balances[to] += amount`,
    },
    {
      title: "EVM Bytecode",
      language: "assembly",
      code: `608060405234801561001057600080fd5b50604051610c38380380610c38
833981810160405281019061003291906100fa565b8160009080519060200190
610048929190610251565b50806001908051906020019061005f929190610251565b505050610445565b6000815190506100748161042e565b92915050565b6000806040838503121561008d57600080fd5b600061009b85828601610065565b92505060206100ac85828601610065565b9150509250929050565b60006100c1826103f7565b6100cb8185610402565b93506100db818560208601610413565b6100e481610446565b840191505092915050565b60006100fa82610402565b9050919050565b600061010c826103f7565b9050919050565b60005b8381101561013157808201518184015260208101905061011657600080fd5b83811115610140576000848401525b50505050565b6000600282049050600182168061015e57607f821691505b6020821081141561017257610171610417565b5b50919050565b`,
    },
  ]

  // Auto-advance animation
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % transformationSteps.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl p-8 border border-slate-700">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-red-500/10 rounded-xl" />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-mono text-white">{transformationSteps[currentStep].title}</h3>
          <div className="flex gap-2">
            {transformationSteps.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentStep(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentStep ? "bg-blue-400" : "bg-slate-600 hover:bg-slate-500"
                }`}
              />
            ))}
          </div>
        </div>

        <div className="bg-slate-950 rounded-lg p-4 font-mono text-sm overflow-x-auto">
          <pre className="text-slate-300 whitespace-pre-wrap">{transformationSteps[currentStep].code}</pre>
        </div>

        <div className="flex justify-center mt-6">
          <Button
            onClick={() => setCurrentStep((prev) => (prev + 1) % transformationSteps.length)}
            className="bg-gradient-to-r from-blue-500 to-red-500 hover:from-blue-600 hover:to-red-600 text-white px-6 py-2"
          >
            Next Step →
          </Button>
        </div>
      </div>
    </div>
  )
}
