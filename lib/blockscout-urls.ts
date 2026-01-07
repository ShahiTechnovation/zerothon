/**
 * Blockscout Explorer URL Utilities
 * Provides chain-specific Blockscout URLs for multi-chain support
 */

export interface BlockscoutConfig {
    chainId: number
    name: string
    blockscoutUrl: string
    apiUrl?: string
}

// Blockscout instances for various chains
export const BLOCKSCOUT_EXPLORERS: BlockscoutConfig[] = [
    {
        chainId: 1,
        name: 'Ethereum Mainnet',
        blockscoutUrl: 'https://eth.blockscout.com',
        apiUrl: 'https://eth.blockscout.com/api'
    },
    {
        chainId: 11155111,
        name: 'Sepolia Testnet',
        blockscoutUrl: 'https://eth-sepolia.blockscout.com',
        apiUrl: 'https://eth-sepolia.blockscout.com/api'
    },
    {
        chainId: 43114,
        name: 'Avalanche C-Chain',
        blockscoutUrl: 'https://snowtrace.io', // Avalanche uses Snowtrace (Blockscout-based)
        apiUrl: 'https://api.snowtrace.io/api'
    },
    {
        chainId: 43113,
        name: 'Avalanche Fuji',
        blockscoutUrl: 'https://testnet.snowtrace.io',
        apiUrl: 'https://api-testnet.snowtrace.io/api'
    },
    {
        chainId: 137,
        name: 'Polygon Mainnet',
        blockscoutUrl: 'https://polygon.blockscout.com',
        apiUrl: 'https://polygon.blockscout.com/api'
    },
    {
        chainId: 80002,
        name: 'Polygon Amoy Testnet',
        blockscoutUrl: 'https://polygon-amoy.blockscout.com',
        apiUrl: 'https://polygon-amoy.blockscout.com/api'
    },
    {
        chainId: 8453,
        name: 'Base Mainnet',
        blockscoutUrl: 'https://base.blockscout.com',
        apiUrl: 'https://base.blockscout.com/api'
    },
    {
        chainId: 84532,
        name: 'Base Sepolia',
        blockscoutUrl: 'https://base-sepolia.blockscout.com',
        apiUrl: 'https://base-sepolia.blockscout.com/api'
    },
    {
        chainId: 56,
        name: 'BNB Smart Chain',
        blockscoutUrl: 'https://bscscan.com', // BSC uses BSCScan
        apiUrl: 'https://api.bscscan.com/api'
    },
    {
        chainId: 97,
        name: 'BNB Testnet',
        blockscoutUrl: 'https://testnet.bscscan.com',
        apiUrl: 'https://api-testnet.bscscan.com/api'
    },
    {
        chainId: 10,
        name: 'Optimism',
        blockscoutUrl: 'https://optimism.blockscout.com',
        apiUrl: 'https://optimism.blockscout.com/api'
    },
    {
        chainId: 42161,
        name: 'Arbitrum One',
        blockscoutUrl: 'https://arbitrum.blockscout.com',
        apiUrl: 'https://arbitrum.blockscout.com/api'
    },
    {
        chainId: 100,
        name: 'Gnosis Chain',
        blockscoutUrl: 'https://gnosis.blockscout.com',
        apiUrl: 'https://gnosis.blockscout.com/api'
    }
]

/**
 * Get Blockscout explorer URL for a specific chain
 */
export function getBlockscoutUrl(chainId: number): string {
    const config = BLOCKSCOUT_EXPLORERS.find(e => e.chainId === chainId)
    return config?.blockscoutUrl || 'https://eth.blockscout.com'
}

/**
 * Get Blockscout API URL for a specific chain
 */
export function getBlockscoutApiUrl(chainId: number): string {
    const config = BLOCKSCOUT_EXPLORERS.find(e => e.chainId === chainId)
    return config?.apiUrl || 'https://eth.blockscout.com/api'
}

/**
 * Get address URL on Blockscout
 */
export function getAddressUrl(chainId: number, address: string): string {
    const baseUrl = getBlockscoutUrl(chainId)
    return `${baseUrl}/address/${address}`
}

/**
 * Get transaction URL on Blockscout
 */
export function getTxUrl(chainId: number, txHash: string): string {
    const baseUrl = getBlockscoutUrl(chainId)
    return `${baseUrl}/tx/${txHash}`
}

/**
 * Get token URL on Blockscout
 */
export function getTokenUrl(chainId: number, tokenAddress: string): string {
    const baseUrl = getBlockscoutUrl(chainId)
    return `${baseUrl}/token/${tokenAddress}`
}

/**
 * Get block URL on Blockscout
 */
export function getBlockUrl(chainId: number, blockNumber: number | string): string {
    const baseUrl = getBlockscoutUrl(chainId)
    return `${baseUrl}/block/${blockNumber}`
}
