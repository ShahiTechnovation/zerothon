"use client"

import { motion } from "framer-motion"
import {
  Brain,
  Code2,
  Shield,
  Zap,
  Layers,
  Database,
  Palette,
  GitBranch,
  Sparkles,
  MessageSquare,
} from "lucide-react"

const capabilities = [
  {
    icon: Brain,
    title: "Agentic AI Orchestration",
    description: "Multiple specialized AI agents work together to architect, develop, audit, and optimize your dApp",
    color: "from-purple-500 to-pink-500",
    features: ["Multi-agent collaboration", "Intelligent task distribution", "Autonomous decision making"],
  },
  {
    icon: MessageSquare,
    title: "Natural Language Processing",
    description: "Describe your dApp in plain English - our AI understands context, requirements, and technical nuances",
    color: "from-blue-500 to-cyan-500",
    features: ["Context-aware understanding", "Requirement extraction", "Technical translation"],
  },
  {
    icon: Code2,
    title: "Python Smart Contracts",
    description: "Write smart contracts in Python with full type safety, then compile to optimized EVM bytecode",
    color: "from-yellow-500 to-orange-500",
    features: ["Familiar Python syntax", "Type-safe development", "EVM compatibility"],
  },
  {
    icon: Layers,
    title: "Full-Stack Generation",
    description: "Generate complete dApps with smart contracts, frontend UI, Web3 integration, and deployment scripts",
    color: "from-green-500 to-emerald-500",
    features: ["React/Next.js frontend", "Web3 integration", "Complete deployment"],
  },
  {
    icon: Shield,
    title: "Built-in Security",
    description: "Automated security audits detect vulnerabilities and suggest fixes before deployment",
    color: "from-red-500 to-rose-500",
    features: ["Vulnerability scanning", "Best practice enforcement", "Security recommendations"],
  },
  {
    icon: Zap,
    title: "Avalanche Optimized",
    description: "Optimized for Avalanche's C-Chain with support for subnets and cross-chain functionality",
    color: "from-indigo-500 to-purple-500",
    features: ["C-Chain deployment", "Subnet support", "Cross-chain bridges"],
  },
]

export function AICapabilities() {
  return (
    <section className="relative z-10 py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-950/80 to-slate-900/80">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 rounded-full px-4 py-2 mb-6">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="text-sm text-purple-300 font-medium">AI-Powered Development</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Why Choose <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">zerothon AI</span>
          </h2>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto">
            Leverage the power of agentic AI to build production-ready dApps without deep blockchain expertise
          </p>
        </motion.div>

        {/* Capabilities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {capabilities.map((capability, index) => {
            const Icon = capability.icon
            return (
              <motion.div
                key={capability.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="group relative bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6 hover:border-slate-600 transition-all"
              >
                {/* Gradient Glow */}
                <div className={`absolute inset-0 bg-gradient-to-br ${capability.color} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity`} />

                {/* Icon */}
                <div className={`relative w-12 h-12 rounded-xl bg-gradient-to-br ${capability.color} p-2.5 mb-4`}>
                  <Icon className="w-full h-full text-white" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold text-white mb-3">{capability.title}</h3>
                <p className="text-slate-400 mb-4 leading-relaxed">{capability.description}</p>

                {/* Features */}
                <ul className="space-y-2">
                  {capability.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm text-slate-500">
                      <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${capability.color}`} />
                      {feature}
                    </li>
                  ))}
                </ul>
              </motion.div>
            )
          })}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center gap-2 text-slate-400">
            <GitBranch className="w-5 h-5" />
            <span className="text-lg">
              Built for <span className="text-blue-400 font-semibold">Python developers</span> entering Web3
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
