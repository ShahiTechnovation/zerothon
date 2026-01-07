export interface DAppTemplate {
  id: string
  name: string
  description: string
  category: "defi" | "nft" | "dao" | "token" | "bridge"
  icon: string
  features: string[]
  complexity: "beginner" | "intermediate" | "advanced"
  estimatedGasUsage: string
  contracts: string[]
}

export const DAPP_TEMPLATES: DAppTemplate[] = [
  {
    id: "uniswap-clone",
    name: "DEX (Uniswap Clone)",
    description: "Decentralized exchange with AMM",
    category: "defi",
    icon: "💱",
    features: [
      "Automated Market Maker (AMM)",
      "Liquidity Pools",
      "Token Swaps",
      "Fee Collection",
      "Slippage Protection",
    ],
    complexity: "advanced",
    estimatedGasUsage: "High",
    contracts: ["UniswapV2Factory", "UniswapV2Pair", "UniswapV2Router"],
  },
  {
    id: "nft-marketplace",
    name: "NFT Marketplace",
    description: "Buy, sell, and trade NFTs",
    category: "nft",
    icon: "🖼️",
    features: ["NFT Listing", "Auction System", "Royalty Management", "Collection Support", "Offer System"],
    complexity: "intermediate",
    estimatedGasUsage: "Medium",
    contracts: ["NFTMarketplace", "CollectionFactory", "RoyaltyManager"],
  },
  {
    id: "dao-governance",
    name: "DAO Governance",
    description: "Decentralized autonomous organization",
    category: "dao",
    icon: "🏛️",
    features: ["Governance Token", "Proposal System", "Voting Mechanism", "Treasury Management", "Timelock"],
    complexity: "advanced",
    estimatedGasUsage: "Medium",
    contracts: ["GovernanceToken", "Governor", "Timelock", "Treasury"],
  },
  {
    id: "token-factory",
    name: "Token Factory",
    description: "Create and manage custom tokens",
    category: "token",
    icon: "🪙",
    features: ["ERC20 Token Creation", "Minting/Burning", "Pausable Tokens", "Snapshot Capability", "Permit Support"],
    complexity: "beginner",
    estimatedGasUsage: "Low",
    contracts: ["TokenFactory", "CustomToken", "TokenVault"],
  },
  {
    id: "bridge-protocol",
    name: "Cross-Chain Bridge",
    description: "Bridge assets between chains",
    category: "bridge",
    icon: "🌉",
    features: [
      "Cross-Chain Messaging",
      "Asset Wrapping",
      "Liquidity Pools",
      "Fee Management",
      "Multi-Signature Validation",
    ],
    complexity: "advanced",
    estimatedGasUsage: "High",
    contracts: ["BridgeSource", "BridgeDestination", "LiquidityPool"],
  },
]

export const TEMPLATE_DESCRIPTIONS: Record<string, string> = {
  "uniswap-clone": `A complete DEX implementation featuring:
- Constant product AMM formula (x*y=k)
- Liquidity provider tokens (LP tokens)
- Swap functionality with slippage protection
- Flash swap capability
- Fee tier support (0.01%, 0.05%, 0.30%, 1%)`,

  "nft-marketplace": `A full-featured NFT marketplace with:
- ERC721 and ERC1155 support
- Fixed price and auction listings
- Royalty enforcement
- Collection management
- Offer/counter-offer system`,

  "dao-governance": `A complete DAO framework including:
- ERC20 governance token
- Proposal creation and voting
- Timelock for security
- Treasury management
- Delegation support`,

  "token-factory": `A token creation platform with:
- ERC20 token deployment
- Customizable parameters
- Minting and burning
- Pausable functionality
- Snapshot for voting`,

  "bridge-protocol": `A cross-chain bridge solution featuring:
- Multi-chain support
- Asset wrapping and unwrapping
- Liquidity management
- Multi-signature validation
- Fee collection`,
}

export function getTemplateById(id: string): DAppTemplate | undefined {
  return DAPP_TEMPLATES.find((t) => t.id === id)
}

export function getTemplatesByCategory(category: string): DAppTemplate[] {
  return DAPP_TEMPLATES.filter((t) => t.category === category)
}

export function getTemplatesByComplexity(complexity: string): DAppTemplate[] {
  return DAPP_TEMPLATES.filter((t) => t.complexity === complexity)
}
