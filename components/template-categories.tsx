import { Coins, ImageIcon, TrendingUp, Users, Gamepad2, Wrench, Shield, Zap } from "lucide-react"

export function TemplateCategories() {
  const categories = [
    {
      id: "tokens",
      name: "Token Contracts",
      description: "ERC-20, ERC-721, and custom token implementations",
      icon: Coins,
      count: 24,
      color: "from-yellow-500 to-orange-500",
      popular: ["ERC-20 Token", "Mintable Token", "Burnable Token"],
    },
    {
      id: "nft",
      name: "NFT Collections",
      description: "NFT marketplaces, collections, and utility contracts",
      icon: ImageIcon,
      count: 18,
      color: "from-purple-500 to-pink-500",
      popular: ["NFT Collection", "NFT Marketplace", "Royalty NFT"],
    },
    {
      id: "defi",
      name: "DeFi Protocols",
      description: "Staking, lending, DEX, and yield farming contracts",
      icon: TrendingUp,
      count: 32,
      color: "from-green-500 to-emerald-500",
      popular: ["Staking Pool", "Liquidity Mining", "Yield Vault"],
    },
    {
      id: "dao",
      name: "DAO Governance",
      description: "Voting, treasury, and governance mechanism contracts",
      icon: Users,
      count: 15,
      color: "from-blue-500 to-cyan-500",
      popular: ["Voting Contract", "Treasury", "Proposal System"],
    },
    {
      id: "gaming",
      name: "Gaming & Metaverse",
      description: "Game mechanics, virtual worlds, and gaming tokens",
      icon: Gamepad2,
      count: 21,
      color: "from-red-500 to-pink-500",
      popular: ["Game Items", "Player Stats", "Tournament"],
    },
    {
      id: "utility",
      name: "Utility Contracts",
      description: "Multi-sig wallets, oracles, and utility functions",
      icon: Wrench,
      count: 27,
      color: "from-indigo-500 to-purple-500",
      popular: ["Multi-Sig", "Oracle", "Time Lock"],
    },
    {
      id: "security",
      name: "Security Patterns",
      description: "Access control, upgradeable, and security-focused contracts",
      icon: Shield,
      count: 12,
      color: "from-emerald-500 to-teal-500",
      popular: ["Access Control", "Upgradeable", "Pausable"],
    },
    {
      id: "advanced",
      name: "Advanced Patterns",
      description: "Complex patterns, optimizations, and experimental features",
      icon: Zap,
      count: 9,
      color: "from-orange-500 to-red-500",
      popular: ["Factory Pattern", "Proxy", "Diamond"],
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {categories.map((category) => (
        <div
          key={category.id}
          className="group bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl p-6 border border-slate-700 hover:border-slate-600 transition-all duration-300 cursor-pointer"
        >
          <div className="flex items-start justify-between mb-4">
            <div
              className={`w-12 h-12 bg-gradient-to-r ${category.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}
            >
              <category.icon className="w-6 h-6 text-white" />
            </div>
            <span className="bg-slate-800 text-slate-300 px-2 py-1 rounded-full text-xs font-mono">
              {category.count}
            </span>
          </div>

          <h3 className="text-lg font-mono font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors">
            {category.name}
          </h3>

          <p className="text-slate-400 text-sm leading-relaxed mb-4">{category.description}</p>

          <div className="space-y-2">
            <div className="text-xs text-slate-500 font-medium">Popular:</div>
            <div className="flex flex-wrap gap-1">
              {category.popular.map((item, index) => (
                <span
                  key={index}
                  className="bg-slate-800 text-slate-200 px-2 py-1 rounded text-xs hover:bg-slate-700 transition-colors"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
