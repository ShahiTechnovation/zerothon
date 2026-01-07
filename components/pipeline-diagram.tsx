"use client"

import React from "react"

import { useState } from "react"
import { ArrowRight, Code, Cog, Shield, Rocket, CheckCircle } from "lucide-react"

export function PipelineDiagram() {
  const [activeStep, setActiveStep] = useState(0)

  const steps = [
    {
      id: 0,
      title: "Write Python",
      description: "Write smart contracts in familiar Python syntax with full IDE support",
      icon: Code,
      color: "from-blue-500 to-blue-600",
      details: ["Type-safe Python syntax", "Full IDE integration", "Auto-completion support", "Syntax highlighting"],
    },
    {
      id: 1,
      title: "Compile & Optimize",
      description: "Automatic compilation to optimized Solidity with gas optimization",
      icon: Cog,
      color: "from-purple-500 to-purple-600",
      details: ["Lightning-fast compilation", "Gas optimization", "Dead code elimination", "Bytecode optimization"],
    },
    {
      id: 2,
      title: "Security Analysis",
      description: "Built-in security checks and vulnerability detection",
      icon: Shield,
      color: "from-green-500 to-green-600",
      details: ["Vulnerability scanning", "Best practice checks", "Reentrancy detection", "Access control analysis"],
    },
    {
      id: 3,
      title: "Deploy",
      description: "One-click deployment to any EVM-compatible blockchain",
      icon: Rocket,
      color: "from-red-500 to-red-600",
      details: ["Multi-chain deployment", "Gas estimation", "Transaction monitoring", "Deployment verification"],
    },
  ]

  return (
    <div className="space-y-8">
      {/* Pipeline Flow */}
      <div className="relative">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <button
                onClick={() => setActiveStep(step.id)}
                className={`relative group transition-all duration-300 ${
                  activeStep === step.id ? "scale-110" : "hover:scale-105"
                }`}
              >
                <div
                  className={`w-16 h-16 rounded-full bg-gradient-to-r ${step.color} flex items-center justify-center shadow-lg ${
                    activeStep === step.id ? "ring-4 ring-blue-500/30" : ""
                  }`}
                >
                  <step.icon className="w-8 h-8 text-white" />
                </div>
                <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 text-center">
                  <div className="text-sm font-mono font-semibold text-white whitespace-nowrap">{step.title}</div>
                </div>
              </button>

              {index < steps.length - 1 && (
                <div className="flex-1 mx-4">
                  <div className="h-0.5 bg-gradient-to-r from-slate-600 to-slate-700 relative">
                    <div
                      className={`absolute inset-0 bg-gradient-to-r from-blue-500 to-red-500 transition-all duration-1000 ${
                        activeStep > index ? "w-full" : "w-0"
                      }`}
                    />
                  </div>
                  <ArrowRight className="w-5 h-5 text-slate-500 mx-auto -mt-2.5" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step Details */}
      <div className="mt-16">
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl p-8 border border-slate-700">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <div className="flex items-center gap-4 mb-6">
                <div
                  className={`w-12 h-12 rounded-lg bg-gradient-to-r ${steps[activeStep].color} flex items-center justify-center`}
                >
                  {React.createElement(steps[activeStep].icon, { className: "w-6 h-6 text-white" })}
                </div>
                <div>
                  <h3 className="text-2xl font-mono font-bold text-white">{steps[activeStep].title}</h3>
                  <p className="text-slate-400">{steps[activeStep].description}</p>
                </div>
              </div>

              <ul className="space-y-3">
                {steps[activeStep].details.map((detail, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                    <span className="text-slate-300">{detail}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-slate-950 rounded-lg p-6 border border-slate-600">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="ml-2 font-mono">Step {activeStep + 1}</span>
                </div>

                <div className="font-mono text-sm text-slate-300">
                  {activeStep === 0 && (
                    <pre>{`@contract
class SimpleToken:
    def __init__(self, name: str, symbol: str):
        self.name = name
        self.symbol = symbol
        self.balances = {}
    
    def transfer(self, to: address, amount: uint256):
        # Transfer logic here
        pass`}</pre>
                  )}

                  {activeStep === 1 && (
                    <pre>{`Compiling contract...
✓ Syntax analysis complete
✓ Type checking passed
✓ Gas optimization applied
✓ Solidity generated

Compilation time: 0.23s
Gas saved: 15%`}</pre>
                  )}

                  {activeStep === 2 && (
                    <pre>{`Security Analysis Results:
✓ No reentrancy vulnerabilities
✓ Access controls properly implemented
✓ Integer overflow protection
✓ No unchecked external calls

Security Score: 98/100`}</pre>
                  )}

                  {activeStep === 3 && (
                    <pre>{`Deploying to Ethereum Mainnet...
✓ Contract compiled
✓ Gas estimated: 1,234,567
✓ Transaction sent: 0x1234...
✓ Contract deployed: 0xabcd...

Deployment successful!`}</pre>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
