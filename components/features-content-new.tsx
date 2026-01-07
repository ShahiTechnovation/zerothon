'use client'

import { motion } from 'framer-motion'
import {
  Code2,
  Zap,
  Shield,
  Sparkles,
  Terminal,
  Rocket,
  MessageSquare,
  FileCode,
  Network,
  Lock,
  Cpu,
  GitBranch
} from 'lucide-react'

export function FeaturesContentNew() {
  const features = [
    {
      icon: Code2,
      title: 'Python to Solidity',
      description: 'Write smart contracts in Python and automatically transpile to Solidity. No need to learn a new language.',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      icon: MessageSquare,
      title: 'AI-Powered Assistant',
      description: 'ChatGPT-style AI assistant to help you write, debug, and optimize smart contracts in real-time.',
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      icon: Terminal,
      title: 'Unified IDE',
      description: 'Full-featured IDE with Monaco editor, syntax highlighting, and real-time compilation for both Python and Solidity.',
      gradient: 'from-green-500 to-emerald-500'
    },
    {
      icon: Rocket,
      title: 'Multi-Chain Deployment',
      description: 'Deploy to Avalanche, Ethereum, Polygon, BSC, and more with a single click. Switch networks seamlessly.',
      gradient: 'from-orange-500 to-red-500'
    },
    {
      icon: Zap,
      title: 'Instant Compilation',
      description: 'Real-time compilation with detailed error messages and gas optimization suggestions.',
      gradient: 'from-yellow-500 to-orange-500'
    },
    {
      icon: Shield,
      title: 'Security First',
      description: 'Built-in security checks, vulnerability scanning, and best practice recommendations for your contracts.',
      gradient: 'from-red-500 to-pink-500'
    },
    {
      icon: FileCode,
      title: 'Smart Templates',
      description: 'Pre-built templates for ERC20, ERC721, DeFi protocols, and more. Start building in seconds.',
      gradient: 'from-indigo-500 to-purple-500'
    },
    {
      icon: Network,
      title: 'Contract Explorer',
      description: 'View and interact with deployed contracts. Read state, call functions, and monitor events.',
      gradient: 'from-cyan-500 to-blue-500'
    },
    {
      icon: Cpu,
      title: 'Native Compilation',
      description: 'Client-side Python compilation with Pyodide. No server needed, everything runs in your browser.',
      gradient: 'from-pink-500 to-rose-500'
    },
    {
      icon: Lock,
      title: 'Wallet Integration',
      description: 'Seamless MetaMask integration for contract deployment and interaction. Your keys, your control.',
      gradient: 'from-violet-500 to-purple-500'
    },
    {
      icon: GitBranch,
      title: 'Version Control',
      description: 'Save and manage multiple versions of your contracts with IndexedDB storage.',
      gradient: 'from-teal-500 to-cyan-500'
    },
    {
      icon: Sparkles,
      title: 'Glitchy UI',
      description: 'Matrix-style interface with binary rain, VHS effects, and CRT scanlines for a premium developer experience.',
      gradient: 'from-gray-500 to-slate-500'
    }
  ]

  return (
    <div className="py-20">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <h1 className="text-5xl md:text-6xl font-bold mb-6">
          <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            Powerful Features
          </span>
        </h1>
        <p className="text-xl text-gray-400 max-w-3xl mx-auto">
          Everything you need to build, deploy, and manage smart contracts with Python
        </p>
      </motion.div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => {
          const Icon = feature.icon
          return (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="group relative"
            >
              {/* Glowing Border */}
              <div className={`absolute -inset-0.5 bg-gradient-to-r ${feature.gradient} rounded-lg opacity-20 group-hover:opacity-40 blur transition duration-300`} />

              {/* Card Content */}
              <div className="relative bg-black/90 backdrop-blur-sm border border-gray-800 rounded-lg p-6 h-full transition-all duration-300 group-hover:border-gray-700">
                {/* Icon */}
                <div className={`w-12 h-12 bg-gradient-to-r ${feature.gradient} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold mb-3 text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-white group-hover:to-gray-300 transition-all duration-300">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="text-gray-400 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* CTA Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="text-center mt-16"
      >
        <div className="inline-flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => window.location.href = '/playground'}
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg font-medium transition-all duration-200 transform hover:scale-105"
          >
            Try Playground
          </button>
          <button
            onClick={() => window.location.href = '/ai-chat'}
            className="px-8 py-4 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg font-medium transition-all duration-200"
          >
            Talk to AI
          </button>
        </div>
      </motion.div>
    </div>
  )
}
