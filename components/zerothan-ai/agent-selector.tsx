'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Shield, Coins, Layers, Code2, Sparkles } from 'lucide-react'

export interface Agent {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  color: string
  capabilities: string[]
}

const AGENTS: Agent[] = [
  {
    id: 'core',
    name: 'PyVax Core',
    description: 'Generate Python smart contracts with PyVax syntax',
    icon: <Code2 className="w-6 h-6" />,
    color: 'from-blue-500 to-cyan-500',
    capabilities: ['Python contracts', 'EVM compilation', 'Gas optimization'],
  },
  {
    id: 'security',
    name: 'Security Agent',
    description: 'Security auditing and secure contract patterns (OpenZeppelin-inspired)',
    icon: <Shield className="w-6 h-6" />,
    color: 'from-red-500 to-rose-500',
    capabilities: ['Security audits', 'Vulnerability detection', 'Access control'],
  },
  {
    id: 'token',
    name: 'Token Specialist',
    description: 'ERC20/ERC721 token deployment specialist',
    icon: <Coins className="w-6 h-6" />,
    color: 'from-yellow-500 to-orange-500',
    capabilities: ['ERC20 tokens', 'NFT contracts', 'Token economics'],
  },
  {
    id: 'dapp',
    name: 'Full-Stack DApp',
    description: 'Complete dApp with Python contract and React frontend',
    icon: <Layers className="w-6 h-6" />,
    color: 'from-purple-500 to-pink-500',
    capabilities: ['Full-stack', 'React UI', 'Web3 integration'],
  },
]

interface AgentSelectorProps {
  selectedAgent: string
  onSelectAgent: (agentId: string) => void
}

export function AgentSelector({ selectedAgent, onSelectAgent }: AgentSelectorProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-5 h-5 text-purple-400" />
        <h3 className="text-lg font-semibold text-white">Choose Your AI Agent</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {AGENTS.map((agent) => {
          const isSelected = selectedAgent === agent.id

          return (
            <motion.button
              key={agent.id}
              onClick={() => onSelectAgent(agent.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`relative p-4 rounded-xl border transition-all text-left ${
                isSelected
                  ? 'bg-white/10 border-white/30 shadow-lg'
                  : 'bg-white/5 border-white/10 hover:bg-white/8'
              }`}
            >
              {/* Icon */}
              <div
                className={`w-12 h-12 rounded-lg bg-gradient-to-br ${agent.color} flex items-center justify-center mb-3`}
              >
                {agent.icon}
              </div>

              {/* Content */}
              <h4 className="text-white font-semibold mb-1">{agent.name}</h4>
              <p className="text-slate-400 text-sm mb-3">{agent.description}</p>

              {/* Capabilities */}
              <div className="flex flex-wrap gap-1">
                {agent.capabilities.map((cap) => (
                  <span
                    key={cap}
                    className="text-xs px-2 py-1 rounded-full bg-white/5 text-slate-300"
                  >
                    {cap}
                  </span>
                ))}
              </div>

              {/* Selected indicator */}
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-3 right-3 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center"
                >
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </motion.div>
              )}
            </motion.button>
          )
        })}
      </div>

      {/* Info */}
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
        <p className="text-sm text-blue-300">
          <strong>Multi-chain support:</strong> Avalanche, Ethereum, Polygon, and more
        </p>
      </div>
    </div>
  )
}
