"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect } from "react"
import { MessageSquare, Code2, Shield, Palette, Rocket, CheckCircle2, Sparkles } from "lucide-react"

const workflowSteps = [
  {
    id: 1,
    icon: MessageSquare,
    title: "Describe Your Idea",
    description: "Tell zerothon AI what you want to build in natural language",
    color: "from-blue-500 to-cyan-500",
    example: "Create a DEX with liquidity pools and yield farming on Avalanche",
    duration: 2000,
  },
  {
    id: 2,
    icon: Code2,
    title: "AI Generates Smart Contracts",
    description: "Python smart contracts are generated with full type safety",
    color: "from-yellow-500 to-orange-500",
    example: `@contract
class LiquidityPool:
    def __init__(self):
        self.reserves = {}
        self.lp_tokens = {}
    
    def add_liquidity(self, amount: uint256):
        # Add liquidity logic
        pass`,
    duration: 3000,
  },
  {
    id: 3,
    icon: Shield,
    title: "Security Audit",
    description: "Automated security checks detect vulnerabilities",
    color: "from-red-500 to-rose-500",
    example: "✓ No reentrancy vulnerabilities\n✓ Safe math operations\n✓ Access control verified",
    duration: 2500,
  },
  {
    id: 4,
    icon: Palette,
    title: "Frontend Generation",
    description: "Modern React UI with Web3 integration",
    color: "from-purple-500 to-pink-500",
    example: "Generated: React components, Web3 hooks, Wallet integration, UI/UX design",
    duration: 2500,
  },
  {
    id: 5,
    icon: Rocket,
    title: "Deploy to Avalanche",
    description: "One-click deployment to Avalanche C-Chain",
    color: "from-green-500 to-emerald-500",
    example: "✓ Smart contracts deployed\n✓ Frontend deployed\n✓ dApp live at: your-dapp.avax",
    duration: 2000,
  },
]

export function AIWorkflowDemo() {
  const [activeStep, setActiveStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)

  useEffect(() => {
    if (!isPlaying) return

    const timer = setTimeout(() => {
      setActiveStep((prev) => (prev + 1) % workflowSteps.length)
    }, workflowSteps[activeStep].duration)

    return () => clearTimeout(timer)
  }, [activeStep, isPlaying])

  const currentStep = workflowSteps[activeStep]
  const Icon = currentStep.icon

  return (
    <section className="relative z-10 py-20 px-4 sm:px-6 lg:px-8 bg-slate-950/80">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-2 mb-6">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span className="text-sm text-blue-300 font-medium">See It In Action</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            From Idea to <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Live dApp</span> in Minutes
          </h2>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto">
            Watch how zerothon AI transforms your natural language description into a production-ready dApp
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: Workflow Steps */}
          <div className="space-y-4">
            {workflowSteps.map((step, index) => {
              const StepIcon = step.icon
              const isActive = index === activeStep
              const isCompleted = index < activeStep

              return (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  onClick={() => {
                    setActiveStep(index)
                    setIsPlaying(false)
                  }}
                  className={`relative cursor-pointer transition-all ${isActive
                    ? "bg-slate-800/80 border-slate-600"
                    : "bg-slate-800/30 border-slate-700/50 hover:bg-slate-800/50"
                    } backdrop-blur-sm border rounded-xl p-4`}
                >
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div
                      className={`relative w-12 h-12 rounded-lg flex items-center justify-center ${isActive ? `bg-gradient-to-br ${step.color}` : "bg-slate-700/50"
                        }`}
                    >
                      {isCompleted && !isActive ? (
                        <CheckCircle2 className="w-6 h-6 text-green-400" />
                      ) : (
                        <StepIcon className={`w-6 h-6 ${isActive ? "text-white" : "text-slate-400"}`} />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-mono text-slate-500">Step {step.id}</span>
                        {isActive && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"
                          />
                        )}
                      </div>
                      <h3 className={`text-lg font-semibold mb-1 ${isActive ? "text-white" : "text-slate-400"}`}>
                        {step.title}
                      </h3>
                      <p className="text-sm text-slate-500">{step.description}</p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  {isActive && (
                    <motion.div
                      className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-b-xl"
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: step.duration / 1000, ease: "linear" }}
                    />
                  )}
                </motion.div>
              )
            })}
          </div>

          {/* Right: Code/Output Display */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-3xl" />
            <motion.div
              key={activeStep}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="relative bg-slate-900/80 backdrop-blur-sm border border-slate-700 rounded-2xl p-6 shadow-2xl"
            >
              {/* Terminal Header */}
              <div className="flex items-center gap-2 mb-4 pb-4 border-b border-slate-700">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="ml-4 text-sm text-slate-400 font-mono">{currentStep.title}</span>
              </div>

              {/* Icon Display */}
              <div className="flex items-center gap-4 mb-6">
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${currentStep.color} p-3 animate-pulse`}>
                  <Icon className="w-full h-full text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-1">{currentStep.title}</h3>
                  <p className="text-sm text-slate-400">{currentStep.description}</p>
                </div>
              </div>

              {/* Code/Output Display */}
              <div className="bg-slate-950/50 rounded-lg p-4 font-mono text-sm min-h-[200px]">
                <AnimatePresence mode="wait">
                  <motion.pre
                    key={activeStep}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-slate-300 whitespace-pre-wrap"
                  >
                    {currentStep.example}
                  </motion.pre>
                </AnimatePresence>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-700">
                <div className="flex items-center gap-2">
                  {workflowSteps.map((_, index) => (
                    <div
                      key={index}
                      className={`h-1.5 rounded-full transition-all ${index === activeStep
                        ? "w-8 bg-blue-500"
                        : index < activeStep
                          ? "w-1.5 bg-green-500"
                          : "w-1.5 bg-slate-700"
                        }`}
                    />
                  ))}
                </div>
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="text-sm text-slate-400 hover:text-white transition-colors"
                >
                  {isPlaying ? "Pause" : "Play"}
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
