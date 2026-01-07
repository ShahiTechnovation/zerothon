'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Code2,
  Zap,
  Rocket,
  MessageSquare,
  FileCode,
  Network,
  Lock,
  Cpu,
  GitBranch,
  Terminal,
  Shield,
  Sparkles,
  ChevronRight,
  Book,
  PlayCircle,
  CheckCircle,
  AlertCircle
} from 'lucide-react'

export function DocsContentNew() {
  const [activeSection, setActiveSection] = useState('getting-started')

  const sections = [
    { id: 'getting-started', title: 'Getting Started', icon: PlayCircle },
    { id: 'features', title: 'Features', icon: Sparkles },
    { id: 'ai-chat', title: 'AI Chat', icon: MessageSquare },
    { id: 'playground', title: 'Playground', icon: Code2 },
    { id: 'templates', title: 'Templates', icon: FileCode },
    { id: 'deployment', title: 'Deployment', icon: Rocket },
    { id: 'pricing', title: 'Pricing', icon: Zap },
    { id: 'api', title: 'API Reference', icon: Terminal },
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
            Documentation
          </span>
        </h1>
        <p className="text-xl text-gray-400 max-w-3xl mx-auto">
          Everything you need to build, deploy, and manage smart contracts with Python
        </p>
      </motion.div>

      {/* Navigation */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <div className="lg:w-64 flex-shrink-0">
          <div className="sticky top-24 space-y-2">
            {sections.map((section) => {
              const Icon = section.icon
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${activeSection === section.id
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                    : 'bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white'
                    }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{section.title}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="bg-black/50 backdrop-blur-sm border border-gray-800 rounded-lg p-8">
            {activeSection === 'getting-started' && <GettingStarted />}
            {activeSection === 'features' && <Features />}
            {activeSection === 'ai-chat' && <AIChat />}
            {activeSection === 'playground' && <Playground />}
            {activeSection === 'templates' && <Templates />}
            {activeSection === 'deployment' && <Deployment />}
            {activeSection === 'pricing' && <Pricing />}
            {activeSection === 'api' && <APIReference />}
          </div>
        </div>
      </div>
    </div>
  )
}

function GettingStarted() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold mb-4 flex items-center gap-3">
          <PlayCircle className="w-8 h-8 text-blue-500" />
          Getting Started
        </h2>
        <p className="text-gray-400 text-lg">
          Welcome to zerothon! Build EVM smart contracts using Python in minutes.
        </p>
      </div>

      <div className="space-y-6">
        <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
          <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            What is zerothon?
          </h3>
          <p className="text-gray-400 mb-4">
            zerothon is a revolutionary platform that lets you write Ethereum Virtual Machine (EVM) smart contracts using Python instead of Solidity. Our transpiler converts your Python code to Vyper/Solidity automatically.
          </p>
          <ul className="space-y-2 text-gray-400">
            <li className="flex items-start gap-2">
              <ChevronRight className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
              <span>Write smart contracts in Python - no Solidity knowledge required</span>
            </li>
            <li className="flex items-start gap-2">
              <ChevronRight className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
              <span>AI-powered contract generation and assistance</span>
            </li>
            <li className="flex items-start gap-2">
              <ChevronRight className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
              <span>Deploy to multiple chains (Avalanche, Ethereum, Polygon, BSC, etc.)</span>
            </li>
            <li className="flex items-start gap-2">
              <ChevronRight className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
              <span>Built-in IDE with real-time compilation</span>
            </li>
          </ul>
        </div>

        <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
          <h3 className="text-xl font-bold mb-3">Quick Start</h3>
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-sm font-bold">1</span>
                <span className="font-medium">Choose Your Path</span>
              </div>
              <p className="text-gray-400 ml-8">
                <strong className="text-white">AI Chat:</strong> Describe your contract to AI and get instant code<br />
                <strong className="text-white">Playground:</strong> Write code manually with full IDE features
              </p>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-sm font-bold">2</span>
                <span className="font-medium">Write or Generate Code</span>
              </div>
              <p className="text-gray-400 ml-8">
                Use our templates or AI to generate smart contracts in Python
              </p>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-sm font-bold">3</span>
                <span className="font-medium">Compile & Deploy</span>
              </div>
              <p className="text-gray-400 ml-8">
                One-click compilation and deployment to your chosen blockchain
              </p>
            </div>
          </div>
        </div>

        <div className="bg-blue-900/20 border border-blue-800 rounded-lg p-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-blue-500 flex-shrink-0 mt-1" />
            <div>
              <h4 className="font-bold mb-2">Prerequisites</h4>
              <ul className="space-y-1 text-gray-400">
                <li>• Basic Python knowledge</li>
                <li>• MetaMask wallet installed</li>
                <li>• Some test tokens for deployment</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function Features() {
  const features = [
    {
      icon: Code2,
      title: 'Python to Solidity',
      description: 'Write smart contracts in Python. Our transpiler automatically converts to Vyper/Solidity.',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      icon: MessageSquare,
      title: 'AI-Powered Assistant',
      description: 'ChatGPT-style AI helps you write, debug, and optimize contracts. Ask questions and get instant help.',
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      icon: Terminal,
      title: 'Unified Playground',
      description: 'Full-featured IDE with Monaco editor, syntax highlighting, and real-time compilation.',
      gradient: 'from-green-500 to-emerald-500'
    },
    {
      icon: Rocket,
      title: 'Multi-Chain Deployment',
      description: 'Deploy to Avalanche, Ethereum, Polygon, BSC, Arbitrum, Optimism, and more with one click.',
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
      description: 'Built-in security checks, vulnerability scanning, and best practice recommendations.',
      gradient: 'from-red-500 to-pink-500'
    },
    {
      icon: FileCode,
      title: 'Smart Templates',
      description: '9+ production-ready templates for ERC20, ERC721, DeFi, DAO, and more.',
      gradient: 'from-indigo-500 to-purple-500'
    },
    {
      icon: Network,
      title: 'Contract Explorer',
      description: 'View and interact with deployed contracts. Read state, call functions, monitor events.',
      gradient: 'from-cyan-500 to-blue-500'
    },
    {
      icon: Cpu,
      title: 'Native Compilation',
      description: 'Client-side Python compilation with Pyodide. Everything runs in your browser.',
      gradient: 'from-pink-500 to-rose-500'
    },
    {
      icon: Lock,
      title: 'Wallet Integration',
      description: 'Seamless MetaMask integration. Your keys, your control.',
      gradient: 'from-violet-500 to-purple-500'
    },
    {
      icon: GitBranch,
      title: 'Version Control',
      description: 'Save and manage multiple versions with IndexedDB storage.',
      gradient: 'from-teal-500 to-cyan-500'
    },
    {
      icon: Sparkles,
      title: 'Premium UI',
      description: 'Matrix-style glitchy interface with binary rain, VHS effects, and CRT scanlines.',
      gradient: 'from-gray-500 to-slate-500'
    }
  ]

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold mb-4 flex items-center gap-3">
          <Sparkles className="w-8 h-8 text-purple-500" />
          Platform Features
        </h2>
        <p className="text-gray-400 text-lg">
          Comprehensive tools for smart contract development
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {features.map((feature, index) => {
          const Icon = feature.icon
          return (
            <div
              key={index}
              className="bg-gray-900/50 border border-gray-800 rounded-lg p-6 hover:border-gray-700 transition-all duration-200"
            >
              <div className={`w-12 h-12 bg-gradient-to-r ${feature.gradient} rounded-lg flex items-center justify-center mb-4`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
              <p className="text-gray-400 text-sm">{feature.description}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function AIChat() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold mb-4 flex items-center gap-3">
          <MessageSquare className="w-8 h-8 text-purple-500" />
          AI Chat Assistant
        </h2>
        <p className="text-gray-400 text-lg">
          Your intelligent smart contract development companion
        </p>
      </div>

      <div className="space-y-6">
        <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
          <h3 className="text-xl font-bold mb-4">What Can AI Chat Do?</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-2 text-blue-400">Generate Contracts</h4>
              <p className="text-gray-400 text-sm">
                Describe your contract in plain English and get production-ready code instantly.
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-2 text-purple-400">Debug Code</h4>
              <p className="text-gray-400 text-sm">
                Paste your code and get detailed explanations of errors and how to fix them.
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-2 text-green-400">Optimize Gas</h4>
              <p className="text-gray-400 text-sm">
                Get suggestions to reduce gas costs and improve contract efficiency.
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-2 text-orange-400">Security Audit</h4>
              <p className="text-gray-400 text-sm">
                Identify vulnerabilities and get recommendations for secure coding practices.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
          <h3 className="text-xl font-bold mb-4">Example Prompts</h3>
          <div className="space-y-3">
            <div className="bg-black/50 border border-gray-700 rounded-lg p-4">
              <p className="text-gray-300 mb-2">"Create an ERC20 token with 1 million supply"</p>
              <p className="text-gray-500 text-sm">→ Generates complete ERC20 contract</p>
            </div>
            <div className="bg-black/50 border border-gray-700 rounded-lg p-4">
              <p className="text-gray-300 mb-2">"Build an NFT marketplace with royalties"</p>
              <p className="text-gray-500 text-sm">→ Creates marketplace contract with royalty distribution</p>
            </div>
            <div className="bg-black/50 border border-gray-700 rounded-lg p-4">
              <p className="text-gray-300 mb-2">"Add staking functionality to my token"</p>
              <p className="text-gray-500 text-sm">→ Generates staking contract with rewards</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-blue-800 rounded-lg p-6">
          <h3 className="text-xl font-bold mb-4">Premium Features</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Rocket className="w-5 h-5 text-green-500 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-medium mb-1">Direct Deployment</h4>
                <p className="text-gray-400 text-sm">
                  Deploy contracts directly from AI chat with one click (Pro & Enterprise)
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Zap className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-medium mb-1">Unlimited Messages</h4>
                <p className="text-gray-400 text-sm">
                  No message limits with Pro plan (Free: 50 messages/month)
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-purple-500 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-medium mb-1">Advanced AI</h4>
                <p className="text-gray-400 text-sm">
                  Access to GPT-4 and custom-trained models for better results
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function Playground() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold mb-4 flex items-center gap-3">
          <Code2 className="w-8 h-8 text-green-500" />
          Playground IDE
        </h2>
        <p className="text-gray-400 text-lg">
          Full-featured development environment for smart contracts
        </p>
      </div>

      <div className="space-y-6">
        <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
          <h3 className="text-xl font-bold mb-4">IDE Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3 text-blue-400">Editor</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                  Monaco editor (VS Code engine)
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                  Syntax highlighting for Python/Vyper
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                  Auto-completion and IntelliSense
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                  Error highlighting and linting
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-3 text-purple-400">Compilation</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                  Real-time compilation
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                  Detailed error messages
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                  Gas estimation
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                  Optimization suggestions
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
          <h3 className="text-xl font-bold mb-4">Code Example</h3>
          <div className="bg-black border border-gray-700 rounded-lg p-4 font-mono text-sm overflow-x-auto">
            <pre className="text-gray-300">
              {`# ERC20 Token in Python
from vyper.interfaces import ERC20

name: public(String[64])
symbol: public(String[32])
decimals: public(uint8)
totalSupply: public(uint256)
balanceOf: public(HashMap[address, uint256])

@external
def __init__(_name: String[64], _symbol: String[32]):
    self.name = _name
    self.symbol = _symbol
    self.decimals = 18
    self.totalSupply = 1000000 * 10**18
    self.balanceOf[msg.sender] = self.totalSupply

@external
def transfer(_to: address, _value: uint256) -> bool:
    assert self.balanceOf[msg.sender] >= _value
    self.balanceOf[msg.sender] -= _value
    self.balanceOf[_to] += _value
    return True`}
            </pre>
          </div>
        </div>

        <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
          <h3 className="text-xl font-bold mb-4">Keyboard Shortcuts</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex justify-between items-center py-2 border-b border-gray-800">
              <span className="text-gray-400">Compile</span>
              <kbd className="px-2 py-1 bg-gray-800 rounded text-sm">Ctrl + Enter</kbd>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-800">
              <span className="text-gray-400">Save</span>
              <kbd className="px-2 py-1 bg-gray-800 rounded text-sm">Ctrl + S</kbd>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-800">
              <span className="text-gray-400">Format</span>
              <kbd className="px-2 py-1 bg-gray-800 rounded text-sm">Shift + Alt + F</kbd>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-800">
              <span className="text-gray-400">Find</span>
              <kbd className="px-2 py-1 bg-gray-800 rounded text-sm">Ctrl + F</kbd>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function Templates() {
  const templates = [
    { name: 'ERC20 Token', difficulty: 'Beginner', category: 'Token' },
    { name: 'ERC721 NFT', difficulty: 'Intermediate', category: 'NFT' },
    { name: 'DAO Governance', difficulty: 'Advanced', category: 'Governance' },
    { name: 'Token Vesting', difficulty: 'Intermediate', category: 'DeFi' },
    { name: 'Staking Contract', difficulty: 'Advanced', category: 'DeFi' },
    { name: 'AMM Liquidity Pool', difficulty: 'Expert', category: 'DeFi' },
    { name: 'Multi-Sig Wallet', difficulty: 'Advanced', category: 'Security' },
    { name: 'Access Control', difficulty: 'Beginner', category: 'Security' },
    { name: 'NFT Marketplace', difficulty: 'Expert', category: 'NFT' },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold mb-4 flex items-center gap-3">
          <FileCode className="w-8 h-8 text-orange-500" />
          Smart Contract Templates
        </h2>
        <p className="text-gray-400 text-lg">
          Production-ready templates to jumpstart your development
        </p>
      </div>

      <div className="space-y-6">
        <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
          <h3 className="text-xl font-bold mb-4">Available Templates</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {templates.map((template, index) => (
              <div
                key={index}
                className="bg-black/50 border border-gray-700 rounded-lg p-4 hover:border-gray-600 transition-all duration-200"
              >
                <h4 className="font-medium mb-2">{template.name}</h4>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">{template.category}</span>
                  <span className={`px-2 py-1 rounded text-xs ${template.difficulty === 'Beginner' ? 'bg-green-900/50 text-green-400' :
                    template.difficulty === 'Intermediate' ? 'bg-yellow-900/50 text-yellow-400' :
                      template.difficulty === 'Advanced' ? 'bg-orange-900/50 text-orange-400' :
                        'bg-red-900/50 text-red-400'
                    }`}>
                    {template.difficulty}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
          <h3 className="text-xl font-bold mb-4">How to Use Templates</h3>
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-sm font-bold">1</span>
                <span className="font-medium">Browse Templates</span>
              </div>
              <p className="text-gray-400 ml-8 text-sm">
                Visit the Templates page and filter by category or difficulty
              </p>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-sm font-bold">2</span>
                <span className="font-medium">Click to Load</span>
              </div>
              <p className="text-gray-400 ml-8 text-sm">
                Click any template card to load the code in the Playground
              </p>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-sm font-bold">3</span>
                <span className="font-medium">Customize & Deploy</span>
              </div>
              <p className="text-gray-400 ml-8 text-sm">
                Modify the code to fit your needs and deploy to your chosen blockchain
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-900/20 to-pink-900/20 border border-purple-800 rounded-lg p-6">
          <h3 className="text-xl font-bold mb-3">Community Templates</h3>
          <p className="text-gray-400 mb-4">
            Submit your own templates to help the community! Click "Submit Your Template" on the Templates page.
          </p>
          <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-lg font-medium transition-all duration-200">
            Submit Template
          </button>
        </div>
      </div>
    </div>
  )
}

function Deployment() {
  const chains = [
    { name: 'Avalanche C-Chain', rpc: 'https://api.avax.network/ext/bc/C/rpc', chainId: 43114 },
    { name: 'Ethereum Mainnet', rpc: 'https://eth.llamarpc.com', chainId: 1 },
    { name: 'Polygon', rpc: 'https://polygon-rpc.com', chainId: 137 },
    { name: 'BSC', rpc: 'https://bsc-dataseed.binance.org', chainId: 56 },
    { name: 'Arbitrum', rpc: 'https://arb1.arbitrum.io/rpc', chainId: 42161 },
    { name: 'Optimism', rpc: 'https://mainnet.optimism.io', chainId: 10 },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold mb-4 flex items-center gap-3">
          <Rocket className="w-8 h-8 text-red-500" />
          Multi-Chain Deployment
        </h2>
        <p className="text-gray-400 text-lg">
          Deploy your contracts to any EVM-compatible blockchain
        </p>
      </div>

      <div className="space-y-6">
        <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
          <h3 className="text-xl font-bold mb-4">Supported Networks</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {chains.map((chain, index) => (
              <div
                key={index}
                className="bg-black/50 border border-gray-700 rounded-lg p-4"
              >
                <h4 className="font-medium mb-2">{chain.name}</h4>
                <div className="space-y-1 text-sm text-gray-400">
                  <p>Chain ID: {chain.chainId}</p>
                  <p className="truncate">RPC: {chain.rpc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
          <h3 className="text-xl font-bold mb-4">Deployment Steps</h3>
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-sm font-bold">1</span>
                <span className="font-medium">Connect Wallet</span>
              </div>
              <p className="text-gray-400 ml-8 text-sm">
                Click "Connect Wallet" and approve MetaMask connection
              </p>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-sm font-bold">2</span>
                <span className="font-medium">Select Network</span>
              </div>
              <p className="text-gray-400 ml-8 text-sm">
                Choose your target blockchain from the network dropdown
              </p>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-sm font-bold">3</span>
                <span className="font-medium">Compile Contract</span>
              </div>
              <p className="text-gray-400 ml-8 text-sm">
                Click "Compile" to transpile Python to Solidity and compile
              </p>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-sm font-bold">4</span>
                <span className="font-medium">Deploy</span>
              </div>
              <p className="text-gray-400 ml-8 text-sm">
                Click "Deploy" and confirm the transaction in MetaMask
              </p>
            </div>
          </div>
        </div>

        <div className="bg-blue-900/20 border border-blue-800 rounded-lg p-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-blue-500 flex-shrink-0 mt-1" />
            <div>
              <h4 className="font-bold mb-2">Gas Fees</h4>
              <p className="text-gray-400 text-sm mb-2">
                Make sure you have enough native tokens for gas fees:
              </p>
              <ul className="space-y-1 text-gray-400 text-sm">
                <li>• Avalanche: AVAX</li>
                <li>• Ethereum: ETH</li>
                <li>• Polygon: MATIC</li>
                <li>• BSC: BNB</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function Pricing() {
  const plans = [
    {
      name: 'Free',
      price: '$0',
      features: [
        '50 AI messages/month',
        'Basic smart contract help',
        'View generated contracts',
        'Community support',
        'Standard response time'
      ]
    },
    {
      name: 'Pro',
      price: '$29',
      popular: true,
      features: [
        'Unlimited AI messages',
        'Advanced AI assistance',
        'Code generation',
        '🚀 Direct deployment from chat',
        'Multi-chain deployment',
        'Priority support',
        'Fast response time',
        'Custom training',
        'API access'
      ]
    },
    {
      name: 'Enterprise',
      price: '$99',
      features: [
        'Everything in Pro',
        '🚀 One-click deployment',
        'Team collaboration',
        'Dedicated support',
        'Custom integrations',
        'SLA guarantee',
        'Advanced analytics',
        'White-label option',
        'On-premise deployment'
      ]
    }
  ]

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold mb-4 flex items-center gap-3">
          <Zap className="w-8 h-8 text-yellow-500" />
          Pricing Plans
        </h2>
        <p className="text-gray-400 text-lg">
          Choose the plan that fits your needs
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan, index) => (
          <div
            key={index}
            className={`bg-gray-900/50 border rounded-lg p-6 ${plan.popular ? 'border-blue-600 ring-2 ring-blue-600/50' : 'border-gray-800'
              }`}
          >
            {plan.popular && (
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs px-3 py-1 rounded-full inline-block mb-4">
                MOST POPULAR
              </div>
            )}
            <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
            <div className="mb-6">
              <span className="text-4xl font-bold">{plan.price}</span>
              <span className="text-gray-500">/month</span>
            </div>
            <ul className="space-y-3 mb-6">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-300">{feature}</span>
                </li>
              ))}
            </ul>
            <button className={`w-full py-3 rounded-lg font-medium transition-all duration-200 ${plan.popular
              ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white'
              : 'bg-gray-800 hover:bg-gray-700 text-gray-300'
              }`}>
              {plan.name === 'Free' ? 'Get Started' : plan.name === 'Enterprise' ? 'Contact Sales' : 'Upgrade Now'}
            </button>
          </div>
        ))}
      </div>

      <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
        <h3 className="text-xl font-bold mb-4">All Plans Include</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start gap-2">
            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
            <span className="text-gray-300">Access to Playground IDE</span>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
            <span className="text-gray-300">Smart contract templates</span>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
            <span className="text-gray-300">Multi-chain deployment</span>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
            <span className="text-gray-300">Contract explorer</span>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
            <span className="text-gray-300">Real-time compilation</span>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
            <span className="text-gray-300">Security checks</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function APIReference() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold mb-4 flex items-center gap-3">
          <Terminal className="w-8 h-8 text-cyan-500" />
          API Reference
        </h2>
        <p className="text-gray-400 text-lg">
          Integrate zerothon into your applications
        </p>
      </div>

      <div className="space-y-6">
        <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
          <h3 className="text-xl font-bold mb-4">Authentication</h3>
          <p className="text-gray-400 mb-4">
            All API requests require authentication using JWT tokens.
          </p>
          <div className="bg-black border border-gray-700 rounded-lg p-4 font-mono text-sm overflow-x-auto">
            <pre className="text-gray-300">
              {`POST /api/chatbase-auth
Content-Type: application/json

{
  "userId": "user-123",
  "email": "user@example.com",
  "customAttributes": {}
}

Response:
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}`}
            </pre>
          </div>
        </div>

        <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
          <h3 className="text-xl font-bold mb-4">Compile Contract</h3>
          <div className="bg-black border border-gray-700 rounded-lg p-4 font-mono text-sm overflow-x-auto">
            <pre className="text-gray-300">
              {`POST /api/compile
Authorization: Bearer <token>
Content-Type: application/json

{
  "code": "# Your Python/Vyper code",
  "language": "python"
}

Response:
{
  "success": true,
  "bytecode": "0x6080604052...",
  "abi": [...],
  "gasEstimate": 250000
}`}
            </pre>
          </div>
        </div>

        <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
          <h3 className="text-xl font-bold mb-4">Deploy Contract</h3>
          <div className="bg-black border border-gray-700 rounded-lg p-4 font-mono text-sm overflow-x-auto">
            <pre className="text-gray-300">
              {`POST /api/deploy
Authorization: Bearer <token>
Content-Type: application/json

{
  "bytecode": "0x6080604052...",
  "abi": [...],
  "chainId": 43114,
  "constructorArgs": []
}

Response:
{
  "success": true,
  "address": "0x1234567890abcdef...",
  "transactionHash": "0xabcdef..."
}`}
            </pre>
          </div>
        </div>

        <div className="bg-blue-900/20 border border-blue-800 rounded-lg p-6">
          <div className="flex items-start gap-3">
            <Book className="w-6 h-6 text-blue-500 flex-shrink-0 mt-1" />
            <div>
              <h4 className="font-bold mb-2">Full API Documentation</h4>
              <p className="text-gray-400 text-sm mb-3">
                For complete API documentation including all endpoints, parameters, and examples, visit our API docs.
              </p>
              <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium transition-all duration-200">
                View Full API Docs
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
