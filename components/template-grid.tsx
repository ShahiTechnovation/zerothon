"use client"

import { useState, useEffect } from "react"
import { Star, Download, Eye, Copy, Check, ExternalLink, Clock, User, Plus } from "lucide-react"

interface Template {
  id: string
  name: string
  description: string
  category: string
  author: string
  rating: number
  downloads: number
  views: number
  lastUpdated: string
  difficulty: string
  tags: string[]
  preview: string
  isUserSubmitted?: boolean
}

export function TemplateGrid() {
  const [copiedTemplate, setCopiedTemplate] = useState<string | null>(null)
  const [templates, setTemplates] = useState<Template[]>([])
  const [showSubmitForm, setShowSubmitForm] = useState(false)
  const [newTemplate, setNewTemplate] = useState({
    name: "",
    description: "",
    category: "Tokens",
    code: "",
    tags: "",
  })

  const defaultTemplates: Template[] = [
    {
      id: "pyvax-ai-starter",
      name: "PyVax AI Starter",
      description: "AI-powered Python smart contract with AST parser for direct EVM bytecode compilation",
      category: "AI",
      author: "PyVax Team",
      rating: 5.0,
      downloads: 15200,
      views: 52300,
      lastUpdated: "1 day ago",
      difficulty: "Beginner",
      tags: ["AI", "AST Parser", "EVM", "Python", "Bytecode"],
      preview: `from avax_cli.py_contracts import PySmartContract

@PySmartContract
class AISmartContract:
    """
    AI-powered Python smart contract that compiles 
    directly to EVM bytecode without errors using 
    advanced AST parser technology.
    """
    
    def __init__(self):
        self.data = ""
    
    @public
    def set_data(self, value: str):
        """Set contract data with AI validation."""
        self.data = value
        emit DataSet(value)
    
    @view
    def get_data(self) -> str:
        """Retrieve stored data."""
        return self.data`,
    },
    {
      id: "erc20-token",
      name: "ERC-20 Token",
      description: "Standard fungible token with mint, burn, and transfer capabilities",
      category: "Tokens",
      author: "PyVax Team",
      rating: 4.9,
      downloads: 12500,
      views: 45200,
      lastUpdated: "2 days ago",
      difficulty: "Beginner",
      tags: ["ERC-20", "Token", "Mintable", "Burnable"],
      preview: `from avax_cli.py_contracts import PySmartContract

@PySmartContract
class ERC20Token:
    def __init__(self, name: str, symbol: str):
        self.name = name
        self.symbol = symbol
        self.total_supply = 0
        self.balances = {}`,
    },
    {
      id: "nft-collection",
      name: "NFT Collection",
      description: "Complete NFT collection with metadata, royalties, and marketplace integration",
      category: "NFT",
      author: "CryptoArt",
      rating: 4.8,
      downloads: 8900,
      views: 32100,
      lastUpdated: "1 week ago",
      difficulty: "Intermediate",
      tags: ["ERC-721", "NFT", "Metadata", "Royalties"],
      preview: `from avax_cli.py_contracts import PySmartContract

@PySmartContract
class NFTCollection:
    def __init__(self, name: str, symbol: str):
        self.name = name
        self.symbol = symbol
        self.token_counter = 0
        self.owners = {}`,
    },
    {
      id: "staking-pool",
      name: "Staking Pool",
      description: "Flexible staking contract with rewards distribution and lock periods",
      category: "DeFi",
      author: "DeFiBuilder",
      rating: 4.7,
      downloads: 6700,
      views: 28900,
      lastUpdated: "3 days ago",
      difficulty: "Advanced",
      tags: ["Staking", "Rewards", "DeFi", "Yield"],
      preview: `from avax_cli.py_contracts import PySmartContract

@PySmartContract
class StakingPool:
    def __init__(self, reward_token: address):
        self.reward_token = reward_token
        self.total_staked = 0
        self.stakes = {}`,
    },
  ]

  // Load templates from localStorage on mount
  useEffect(() => {
    const savedTemplates = localStorage.getItem("pyvax-templates")
    if (savedTemplates) {
      const userTemplates = JSON.parse(savedTemplates)
      setTemplates([...defaultTemplates, ...userTemplates])
    } else {
      setTemplates(defaultTemplates)
    }
  }, [])

  // Save user templates to localStorage
  const saveTemplates = (newTemplates: Template[]) => {
    const userTemplates = newTemplates.filter((t) => t.isUserSubmitted)
    localStorage.setItem("pyvax-templates", JSON.stringify(userTemplates))
  }

  const handleSubmitTemplate = () => {
    if (!newTemplate.name || !newTemplate.description || !newTemplate.code) {
      alert("Please fill in all required fields")
      return
    }

    const template: Template = {
      id: `user-${Date.now()}`,
      name: newTemplate.name,
      description: newTemplate.description,
      category: newTemplate.category,
      author: "You",
      rating: 0,
      downloads: 0,
      views: 0,
      lastUpdated: "Just now",
      difficulty: "Custom",
      tags: newTemplate.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      preview: newTemplate.code,
      isUserSubmitted: true,
    }

    const updatedTemplates = [...templates, template]
    setTemplates(updatedTemplates)
    saveTemplates(updatedTemplates)

    // Reset form
    setNewTemplate({
      name: "",
      description: "",
      category: "Tokens",
      code: "",
      tags: "",
    })
    setShowSubmitForm(false)
  }

  const handleCopyTemplate = async (templateId: string, code: string) => {
    await navigator.clipboard.writeText(code)
    setCopiedTemplate(templateId)
    setTimeout(() => setCopiedTemplate(null), 2000)
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner":
        return "text-green-200 bg-green-500/20 border-green-500/30"
      case "Intermediate":
        return "text-yellow-200 bg-yellow-500/20 border-yellow-500/30"
      case "Advanced":
        return "text-red-400 bg-red-500/20 border-red-500/30"
      case "Custom":
        return "text-purple-400 bg-purple-500/20 border-purple-500/30"
      default:
        return "text-slate-400 bg-slate-500/20 border-slate-500/30"
    }
  }

  return (
    <div className="space-y-8">
      {/* Submit Template Button */}
      <div className="flex justify-end">
        <button
          onClick={() => setShowSubmitForm(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-red-500 hover:from-blue-600 hover:to-red-600 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105"
        >
          <Plus className="w-4 h-4" />
          Submit Template
        </button>
      </div>

      {/* Submit Form Modal */}
      {showSubmitForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-mono font-bold text-white mb-4">Submit New Template</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-slate-300 mb-2">Template Name *</label>
                <input
                  type="text"
                  value={newTemplate.name}
                  onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-600 rounded px-3 py-2 text-white"
                  placeholder="My Awesome Contract"
                />
              </div>

              <div>
                <label className="block text-sm text-slate-300 mb-2">Description *</label>
                <textarea
                  value={newTemplate.description}
                  onChange={(e) => setNewTemplate({ ...newTemplate, description: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-600 rounded px-3 py-2 text-white h-20"
                  placeholder="Brief description of what this contract does..."
                />
              </div>

              <div>
                <label className="block text-sm text-slate-300 mb-2">Category</label>
                <select
                  value={newTemplate.category}
                  onChange={(e) => setNewTemplate({ ...newTemplate, category: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-600 rounded px-3 py-2 text-white"
                >
                  <option value="Tokens">Tokens</option>
                  <option value="NFT">NFT</option>
                  <option value="DeFi">DeFi</option>
                  <option value="DAO">DAO</option>
                  <option value="Gaming">Gaming</option>
                  <option value="Utility">Utility</option>
                  <option value="AI">AI</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-slate-300 mb-2">Python Code *</label>
                <textarea
                  value={newTemplate.code}
                  onChange={(e) => setNewTemplate({ ...newTemplate, code: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-600 rounded px-3 py-2 text-white font-mono text-sm h-40"
                  placeholder={`from avax_cli.py_contracts import PySmartContract

@PySmartContract
class MyContract:
    def __init__(self):
        # Your contract code here
        pass`}
                />
              </div>

              <div>
                <label className="block text-sm text-slate-300 mb-2">Tags (comma-separated)</label>
                <input
                  type="text"
                  value={newTemplate.tags}
                  onChange={(e) => setNewTemplate({ ...newTemplate, tags: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-600 rounded px-3 py-2 text-white"
                  placeholder="token, erc20, mintable"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleSubmitTemplate}
                className="flex-1 bg-gradient-to-r from-blue-500 to-red-500 hover:from-blue-600 hover:to-red-600 text-white px-4 py-2 rounded-lg font-medium"
              >
                Submit Template
              </button>
              <button
                onClick={() => setShowSubmitForm(false)}
                className="px-4 py-2 border border-slate-600 text-slate-300 rounded-lg hover:bg-slate-700"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Templates Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
        {templates.map((template) => (
          <div
            key={template.id}
            className={`group bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl border overflow-hidden hover:border-blue-500/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/10 ${
              template.isUserSubmitted ? "border-purple-500/30" : "border-slate-700"
            }`}
          >
            {/* Header */}
            <div className="p-6 pb-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-lg font-mono font-semibold text-white group-hover:text-blue-400 transition-colors">
                    {template.name}
                    {template.isUserSubmitted && (
                      <span className="ml-2 text-xs bg-purple-500/20 text-purple-400 px-2 py-1 rounded">
                        Your Template
                      </span>
                    )}
                  </h3>
                  <p className="text-sm text-slate-400 mt-1">{template.description}</p>
                </div>
                <span className="bg-slate-800 text-slate-300 px-2 py-1 rounded text-xs font-medium">
                  {template.category}
                </span>
              </div>

              <div className="flex items-center gap-4 text-xs text-slate-400 mb-4">
                <div className="flex items-center gap-1">
                  <User className="w-3 h-3" />
                  {template.author}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {template.lastUpdated}
                </div>
              </div>

              {!template.isUserSubmitted && (
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4 text-xs text-slate-400">
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-yellow-400 fill-current" />
                      {template.rating}
                    </div>
                    <div className="flex items-center gap-1">
                      <Download className="w-3 h-3" />
                      {template.downloads.toLocaleString()}
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      {template.views.toLocaleString()}
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs border ${getDifficultyColor(template.difficulty)}`}>
                    {template.difficulty}
                  </span>
                </div>
              )}

              <div className="flex flex-wrap gap-1 mb-4">
                {template.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-slate-800 text-slate-400 px-2 py-1 rounded text-xs hover:bg-slate-700 transition-colors cursor-pointer"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Code Preview */}
            <div className="px-6 pb-4">
              <div className="bg-slate-950 rounded-lg border border-slate-600 overflow-hidden transition-all duration-300 hover:border-slate-500">
                <div className="flex items-center justify-between px-3 py-2 bg-slate-900 border-b border-slate-600">
                  <span className="text-xs text-slate-400 font-mono">Preview</span>
                  <button
                    onClick={() => handleCopyTemplate(template.id, template.preview)}
                    className="text-slate-400 hover:text-white transition-all duration-300 hover:scale-110"
                  >
                    {copiedTemplate === template.id ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  </button>
                </div>
                <pre className="p-3 text-xs text-slate-300 font-mono overflow-x-auto">{template.preview}</pre>
              </div>
            </div>

            {/* Actions */}
            <div className="px-6 pb-6">
              <div className="flex gap-3">
                <button className="flex-1 bg-gradient-to-r from-blue-500 to-red-500 hover:from-blue-600 hover:to-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 transform hover:scale-105">
                  Use Template
                </button>
                <button className="border border-slate-600 hover:border-blue-500 text-slate-300 hover:text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 bg-transparent hover:scale-105">
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
