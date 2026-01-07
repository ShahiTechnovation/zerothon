'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Footer } from "@/components/footer"
import { BottomDockMenu } from "@/components/bottom-dock-menu"
import {
  Code2,
  Coins,
  Image,
  Vote,
  Lock,
  Zap,
  TrendingUp,
  Users,
  Shield,
  Sparkles,
  Upload,
  X,
  Check,
  Star,
  Download,
  Eye,
  Heart
} from 'lucide-react'

export default function TemplatesPage() {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [showSubmitModal, setShowSubmitModal] = useState(false)
  const [submitForm, setSubmitForm] = useState({
    name: '',
    description: '',
    category: 'Token',
    difficulty: 'Beginner',
    code: '',
    author: ''
  })

  const templates = [
    {
      icon: Coins,
      title: 'ERC20 Token',
      description: 'Standard fungible token with mint, burn, and transfer functions',
      difficulty: 'Beginner',
      category: 'Token',
      gradient: 'from-yellow-500 to-orange-500',
      code: 'Python',
      downloads: 1234,
      likes: 456,
      views: 5678,
      author: 'zerothon',
      verified: true,
      sampleCode: `from vyper.interfaces import ERC20

# ERC20 Token Implementation
name: public(String[64])
symbol: public(String[32])
decimals: public(uint8)
totalSupply: public(uint256)
balanceOf: public(HashMap[address, uint256])
allowance: public(HashMap[address, HashMap[address, uint256]])

@external
def __init__(_name: String[64], _symbol: String[32], _decimals: uint8, _supply: uint256):
    self.name = _name
    self.symbol = _symbol
    self.decimals = _decimals
    self.totalSupply = _supply
    self.balanceOf[msg.sender] = _supply

@external
def transfer(_to: address, _value: uint256) -> bool:
    assert self.balanceOf[msg.sender] >= _value
    self.balanceOf[msg.sender] -= _value
    self.balanceOf[_to] += _value
    return True`
    },
    {
      icon: Image,
      title: 'ERC721 NFT',
      description: 'Non-fungible token with metadata and royalty support',
      difficulty: 'Intermediate',
      category: 'NFT',
      gradient: 'from-purple-500 to-pink-500',
      code: 'Python',
      downloads: 987,
      likes: 321,
      views: 4321,
      author: 'zerothon',
      verified: true,
      sampleCode: `# ERC721 NFT Implementation
name: public(String[64])
symbol: public(String[32])
tokenURI: public(HashMap[uint256, String[256]])
ownerOf: public(HashMap[uint256, address])
balanceOf: public(HashMap[address, uint256])

tokenId: uint256

@external
def __init__(_name: String[64], _symbol: String[32]):
    self.name = _name
    self.symbol = _symbol
    self.tokenId = 0

@external
def mint(_to: address, _uri: String[256]) -> uint256:
    self.tokenId += 1
    self.ownerOf[self.tokenId] = _to
    self.balanceOf[_to] += 1
    self.tokenURI[self.tokenId] = _uri
    return self.tokenId`
    },
    {
      icon: Vote,
      title: 'DAO Governance',
      description: 'Decentralized voting system with proposal and execution',
      difficulty: 'Advanced',
      category: 'Governance',
      gradient: 'from-blue-500 to-cyan-500',
      code: 'Python',
      downloads: 654,
      likes: 234,
      views: 3210,
      author: 'zerothon',
      verified: true,
      sampleCode: `# DAO Governance Contract
struct Proposal:
    description: String[256]
    voteCount: uint256
    executed: bool
    deadline: uint256

proposals: public(HashMap[uint256, Proposal])
hasVoted: public(HashMap[uint256, HashMap[address, bool]])
proposalCount: uint256

@external
def createProposal(_description: String[256], _duration: uint256):
    self.proposalCount += 1
    self.proposals[self.proposalCount] = Proposal({
        description: _description,
        voteCount: 0,
        executed: False,
        deadline: block.timestamp + _duration
    })

@external
def vote(_proposalId: uint256):
    assert not self.hasVoted[_proposalId][msg.sender]
    assert block.timestamp < self.proposals[_proposalId].deadline
    self.proposals[_proposalId].voteCount += 1
    self.hasVoted[_proposalId][msg.sender] = True`
    },
    {
      icon: Lock,
      title: 'Token Vesting',
      description: 'Time-locked token distribution with cliff and vesting schedule',
      difficulty: 'Intermediate',
      category: 'DeFi',
      gradient: 'from-green-500 to-emerald-500',
      code: 'Python',
      downloads: 543,
      likes: 198,
      views: 2876,
      author: 'Community',
      verified: false,
      sampleCode: `# Token Vesting Contract
struct VestingSchedule:
    beneficiary: address
    amount: uint256
    start: uint256
    cliff: uint256
    duration: uint256
    released: uint256

vestingSchedules: public(HashMap[address, VestingSchedule])

@external
def createVesting(_beneficiary: address, _amount: uint256, _cliff: uint256, _duration: uint256):
    self.vestingSchedules[_beneficiary] = VestingSchedule({
        beneficiary: _beneficiary,
        amount: _amount,
        start: block.timestamp,
        cliff: _cliff,
        duration: _duration,
        released: 0
    })

@external
def release():
    schedule: VestingSchedule = self.vestingSchedules[msg.sender]
    assert block.timestamp >= schedule.start + schedule.cliff
    vested: uint256 = self._vestedAmount(schedule)
    releasable: uint256 = vested - schedule.released
    schedule.released += releasable`
    },
    {
      icon: Zap,
      title: 'Staking Contract',
      description: 'Stake tokens and earn rewards with flexible APY',
      difficulty: 'Advanced',
      category: 'DeFi',
      gradient: 'from-orange-500 to-red-500',
      code: 'Python',
      downloads: 876,
      likes: 345,
      views: 4567,
      author: 'Community',
      verified: false,
      sampleCode: `# Staking Contract
struct Stake:
    amount: uint256
    timestamp: uint256
    rewards: uint256

stakes: public(HashMap[address, Stake])
rewardRate: public(uint256)  # APY in basis points

@external
def __init__(_rewardRate: uint256):
    self.rewardRate = _rewardRate

@external
def stake(_amount: uint256):
    self.stakes[msg.sender].amount += _amount
    self.stakes[msg.sender].timestamp = block.timestamp

@external
def calculateRewards(_staker: address) -> uint256:
    stake: Stake = self.stakes[_staker]
    duration: uint256 = block.timestamp - stake.timestamp
    rewards: uint256 = (stake.amount * self.rewardRate * duration) / (365 * 86400 * 10000)
    return rewards`
    },
    {
      icon: TrendingUp,
      title: 'AMM Liquidity Pool',
      description: 'Automated market maker with constant product formula',
      difficulty: 'Expert',
      category: 'DeFi',
      gradient: 'from-cyan-500 to-blue-500',
      code: 'Python',
      downloads: 432,
      likes: 187,
      views: 2345,
      author: 'Community',
      verified: false,
      sampleCode: `# AMM Liquidity Pool (Constant Product)
reserveA: public(uint256)
reserveB: public(uint256)
totalLiquidity: public(uint256)
liquidity: public(HashMap[address, uint256])

@external
def addLiquidity(_amountA: uint256, _amountB: uint256) -> uint256:
    if self.totalLiquidity == 0:
        liquidityMinted: uint256 = sqrt(_amountA * _amountB)
    else:
        liquidityMinted: uint256 = min(
            (_amountA * self.totalLiquidity) / self.reserveA,
            (_amountB * self.totalLiquidity) / self.reserveB
        )
    self.reserveA += _amountA
    self.reserveB += _amountB
    self.totalLiquidity += liquidityMinted
    self.liquidity[msg.sender] += liquidityMinted
    return liquidityMinted

@external
def swap(_amountIn: uint256, _tokenIn: bool) -> uint256:
    # Constant product: x * y = k
    if _tokenIn:
        amountOut: uint256 = (self.reserveB * _amountIn) / (self.reserveA + _amountIn)
        self.reserveA += _amountIn
        self.reserveB -= amountOut
    else:
        amountOut: uint256 = (self.reserveA * _amountIn) / (self.reserveB + _amountIn)
        self.reserveB += _amountIn
        self.reserveA -= amountOut
    return amountOut`
    },
    {
      icon: Users,
      title: 'Multi-Sig Wallet',
      description: 'Secure wallet requiring multiple signatures for transactions',
      difficulty: 'Advanced',
      category: 'Security',
      gradient: 'from-red-500 to-pink-500',
      code: 'Python',
      downloads: 765,
      likes: 298,
      views: 3456,
      author: 'zerothon',
      verified: true,
      sampleCode: `# Multi-Signature Wallet
struct Transaction:
    to: address
    value: uint256
    executed: bool
    confirmations: uint256

owners: public(HashMap[address, bool])
required: public(uint256)
transactions: public(HashMap[uint256, Transaction])
confirmed: public(HashMap[uint256, HashMap[address, bool]])
transactionCount: uint256

@external
def __init__(_owners: address[5], _required: uint256):
    for owner in _owners:
        if owner != ZERO_ADDRESS:
            self.owners[owner] = True
    self.required = _required

@external
def submitTransaction(_to: address, _value: uint256):
    assert self.owners[msg.sender]
    self.transactionCount += 1
    self.transactions[self.transactionCount] = Transaction({
        to: _to,
        value: _value,
        executed: False,
        confirmations: 0
    })

@external
def confirmTransaction(_txId: uint256):
    assert self.owners[msg.sender]
    assert not self.confirmed[_txId][msg.sender]
    self.confirmed[_txId][msg.sender] = True
    self.transactions[_txId].confirmations += 1`
    },
    {
      icon: Shield,
      title: 'Access Control',
      description: 'Role-based permissions with admin and user roles',
      difficulty: 'Beginner',
      category: 'Security',
      gradient: 'from-indigo-500 to-purple-500',
      code: 'Python',
      downloads: 1098,
      likes: 432,
      views: 5432,
      author: 'zerothon',
      verified: true,
      sampleCode: `# Role-Based Access Control
ADMIN_ROLE: constant(bytes32) = keccak256("ADMIN")
USER_ROLE: constant(bytes32) = keccak256("USER")

roles: public(HashMap[bytes32, HashMap[address, bool]])
admin: public(address)

@external
def __init__():
    self.admin = msg.sender
    self.roles[ADMIN_ROLE][msg.sender] = True

@external
def grantRole(_role: bytes32, _account: address):
    assert self.roles[ADMIN_ROLE][msg.sender]
    self.roles[_role][_account] = True

@external
def revokeRole(_role: bytes32, _account: address):
    assert self.roles[ADMIN_ROLE][msg.sender]
    self.roles[_role][_account] = False

@external
def hasRole(_role: bytes32, _account: address) -> bool:
    return self.roles[_role][_account]`
    },
    {
      icon: Sparkles,
      title: 'NFT Marketplace',
      description: 'Buy, sell, and auction NFTs with royalty distribution',
      difficulty: 'Expert',
      category: 'NFT',
      gradient: 'from-pink-500 to-rose-500',
      code: 'Python',
      downloads: 543,
      likes: 234,
      views: 3210,
      author: 'Community',
      verified: false,
      sampleCode: `# NFT Marketplace
struct Listing:
    seller: address
    price: uint256
    active: bool

listings: public(HashMap[uint256, Listing])
royaltyPercentage: public(uint256)

@external
def __init__(_royaltyPercentage: uint256):
    self.royaltyPercentage = _royaltyPercentage

@external
def listNFT(_tokenId: uint256, _price: uint256):
    self.listings[_tokenId] = Listing({
        seller: msg.sender,
        price: _price,
        active: True
    })

@external
@payable
def buyNFT(_tokenId: uint256):
    listing: Listing = self.listings[_tokenId]
    assert listing.active
    assert msg.value >= listing.price
    
    royalty: uint256 = (listing.price * self.royaltyPercentage) / 10000
    sellerAmount: uint256 = listing.price - royalty
    
    send(listing.seller, sellerAmount)
    listing.active = False`
    }
  ]

  const categories = [
    { name: 'All', count: templates.length },
    { name: 'Token', count: templates.filter(t => t.category === 'Token').length },
    { name: 'NFT', count: templates.filter(t => t.category === 'NFT').length },
    { name: 'DeFi', count: templates.filter(t => t.category === 'DeFi').length },
    { name: 'Governance', count: templates.filter(t => t.category === 'Governance').length },
    { name: 'Security', count: templates.filter(t => t.category === 'Security').length }
  ]

  const difficultyColors = {
    'Beginner': 'text-green-500',
    'Intermediate': 'text-yellow-500',
    'Advanced': 'text-orange-500',
    'Expert': 'text-red-500'
  }

  const filteredTemplates = selectedCategory === 'All'
    ? templates
    : templates.filter(t => t.category === selectedCategory)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would send the form data to your backend
    console.log('Submitting template:', submitForm)
    setShowSubmitModal(false)
    // Reset form
    setSubmitForm({
      name: '',
      description: '',
      category: 'Token',
      difficulty: 'Beginner',
      code: '',
      author: ''
    })
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <BottomDockMenu />

      <main className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-7xl mx-auto text-center mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Smart Contract{' '}
            <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Templates
            </span>
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-8">
            Production-ready smart contract templates written in Python. Copy, customize, and deploy in minutes.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <button
              onClick={() => setShowSubmitModal(true)}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 justify-center"
            >
              <Upload className="w-5 h-5" />
              Submit Your Template
            </button>
            <button
              onClick={() => window.location.href = '/playground'}
              className="px-6 py-3 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg font-medium transition-all duration-200"
            >
              Create from Scratch
            </button>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <button
                key={category.name}
                onClick={() => setSelectedCategory(category.name)}
                className={`px-4 py-2 rounded-lg transition-all duration-200 text-sm font-mono ${selectedCategory === category.name
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600'
                  : 'bg-gray-800 hover:bg-gray-700 border border-gray-700'
                  }`}
              >
                {category.name} <span className="text-gray-500">({category.count})</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Templates Grid */}
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map((template, index) => {
              const Icon = template.icon
              return (
                <motion.div
                  key={template.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="group relative cursor-pointer"
                  onClick={() => {
                    // Store template code and redirect to playground
                    localStorage.setItem('templateCode', template.sampleCode)
                    window.location.href = '/playground'
                  }}
                >
                  {/* Glowing Border */}
                  <div className={`absolute -inset-0.5 bg-gradient-to-r ${template.gradient} rounded-lg opacity-20 group-hover:opacity-40 blur transition duration-300`} />

                  {/* Card Content */}
                  <div className="relative bg-black/90 backdrop-blur-sm border border-gray-800 rounded-lg p-6 h-full transition-all duration-300 group-hover:border-gray-700">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-12 h-12 bg-gradient-to-r ${template.gradient} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span className={`text-xs font-mono ${difficultyColors[template.difficulty as keyof typeof difficultyColors]}`}>
                          {template.difficulty}
                        </span>
                        {template.verified && (
                          <div className="flex items-center gap-1 text-blue-500">
                            <Check className="w-3 h-3" />
                            <span className="text-xs">Verified</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold mb-2 text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-white group-hover:to-gray-300 transition-all duration-300">
                      {template.title}
                    </h3>

                    {/* Description */}
                    <p className="text-gray-400 text-sm mb-4 leading-relaxed line-clamp-2">
                      {template.description}
                    </p>

                    {/* Stats */}
                    <div className="flex items-center gap-4 mb-4 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Download className="w-3 h-3" />
                        {template.downloads}
                      </div>
                      <div className="flex items-center gap-1">
                        <Heart className="w-3 h-3" />
                        {template.likes}
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {template.views}
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-800">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-xs font-bold">
                          {template.author[0]}
                        </div>
                        <span className="text-xs text-gray-500">{template.author}</span>
                      </div>
                      <span className="text-xs text-gray-500 font-mono flex items-center gap-1">
                        <Code2 className="w-3 h-3" />
                        {template.code}
                      </span>
                    </div>
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
            <div className="bg-gradient-to-r from-gray-900 to-black border border-gray-800 rounded-lg p-8">
              <h3 className="text-2xl font-bold mb-4">
                Can't find what you're looking for?
              </h3>
              <p className="text-gray-400 mb-6">
                Use our AI assistant to generate custom smart contracts tailored to your needs
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => window.location.href = '/ai-chat'}
                  className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg font-medium transition-all duration-200 transform hover:scale-105"
                >
                  Ask AI to Build
                </button>
                <button
                  onClick={() => setShowSubmitModal(true)}
                  className="px-8 py-4 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 justify-center"
                >
                  <Upload className="w-5 h-5" />
                  Share Your Template
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Submit Template Modal */}
      <AnimatePresence>
        {showSubmitModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-6 overflow-y-auto"
            onClick={() => setShowSubmitModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="max-w-2xl w-full bg-black/90 backdrop-blur-sm border border-gray-700 rounded-lg p-8"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                  Submit Your Template
                </h2>
                <button
                  onClick={() => setShowSubmitModal(false)}
                  className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-gray-400 mb-6">
                Share your smart contract template with the community. Help other developers build faster!
              </p>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Template Name</label>
                  <input
                    type="text"
                    required
                    value={submitForm.name}
                    onChange={(e) => setSubmitForm({ ...submitForm, name: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:border-blue-500 focus:outline-none"
                    placeholder="e.g., ERC20 Token with Governance"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea
                    required
                    value={submitForm.description}
                    onChange={(e) => setSubmitForm({ ...submitForm, description: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:border-blue-500 focus:outline-none h-24 resize-none"
                    placeholder="Describe what your template does..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Category</label>
                    <select
                      value={submitForm.category}
                      onChange={(e) => setSubmitForm({ ...submitForm, category: e.target.value })}
                      className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:border-blue-500 focus:outline-none"
                    >
                      <option>Token</option>
                      <option>NFT</option>
                      <option>DeFi</option>
                      <option>Governance</option>
                      <option>Security</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Difficulty</label>
                    <select
                      value={submitForm.difficulty}
                      onChange={(e) => setSubmitForm({ ...submitForm, difficulty: e.target.value })}
                      className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:border-blue-500 focus:outline-none"
                    >
                      <option>Beginner</option>
                      <option>Intermediate</option>
                      <option>Advanced</option>
                      <option>Expert</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Your Name</label>
                  <input
                    type="text"
                    required
                    value={submitForm.author}
                    onChange={(e) => setSubmitForm({ ...submitForm, author: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:border-blue-500 focus:outline-none"
                    placeholder="Your name or username"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Smart Contract Code</label>
                  <textarea
                    required
                    value={submitForm.code}
                    onChange={(e) => setSubmitForm({ ...submitForm, code: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:border-blue-500 focus:outline-none h-48 resize-none font-mono text-sm"
                    placeholder="Paste your Python/Vyper smart contract code here..."
                  />
                </div>

                {/* Submit Button */}
                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 justify-center"
                  >
                    <Upload className="w-5 h-5" />
                    Submit Template
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowSubmitModal(false)}
                    className="px-6 py-3 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg font-medium transition-all duration-200"
                  >
                    Cancel
                  </button>
                </div>

                <p className="text-xs text-gray-500 text-center">
                  By submitting, you agree to share your template under the MIT license
                </p>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  )
}
