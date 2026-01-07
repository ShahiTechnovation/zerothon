
export interface NetworkConfig {
    chainId: number
    name: string
    rpcUrl: string
    explorer: string
    nativeCurrency: {
        name: string
        symbol: string
        decimals: number
    }
}

export const DEFAULT_NETWORKS: NetworkConfig[] = [
    {
        chainId: 1,
        name: 'Ethereum Mainnet',
        rpcUrl: 'https://eth.llamarpc.com',
        explorer: 'https://eth.blockscout.com',
        nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 }
    },
    {
        chainId: 11155111,
        name: 'Sepolia Testnet',
        rpcUrl: 'https://rpc.sepolia.org',
        explorer: 'https://eth-sepolia.blockscout.com',
        nativeCurrency: { name: 'Sepolia Ether', symbol: 'SEP', decimals: 18 }
    },
    {
        chainId: 43114,
        name: 'Avalanche C-Chain',
        rpcUrl: 'https://api.avax.network/ext/bc/C/rpc',
        explorer: 'https://snowtrace.io',
        nativeCurrency: { name: 'Avalanche', symbol: 'AVAX', decimals: 18 }
    },
    {
        chainId: 43113,
        name: 'Avalanche Fuji',
        rpcUrl: 'https://api.avax-test.network/ext/bc/C/rpc',
        explorer: 'https://testnet.snowtrace.io',
        nativeCurrency: { name: 'Avalanche', symbol: 'AVAX', decimals: 18 }
    },
    {
        chainId: 137,
        name: 'Polygon Mainnet',
        rpcUrl: 'https://polygon-rpc.com',
        explorer: 'https://polygon.blockscout.com',
        nativeCurrency: { name: 'Polygon', symbol: 'MATIC', decimals: 18 }
    },
    {
        chainId: 8453,
        name: 'Base Mainnet',
        rpcUrl: 'https://mainnet.base.org',
        explorer: 'https://base.blockscout.com',
        nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 }
    },
    {
        chainId: 56,
        name: 'BNB Smart Chain',
        rpcUrl: 'https://bsc-dataseed.binance.org',
        explorer: 'https://bscscan.com',
        nativeCurrency: { name: 'BNB', symbol: 'BNB', decimals: 18 }
    }
]

export function getNetworkByChainId(chainId: number): NetworkConfig | undefined {
    return DEFAULT_NETWORKS.find(n => n.chainId === chainId)
}

export async function fetchAllNetworks(): Promise<NetworkConfig[]> {
    try {
        // Use the official GitHub-hosted chain list which is CORS-friendly
        const response = await fetch('https://chainid.network/chains.json')
        if (!response.ok) throw new Error('Failed to fetch chainlist')
        const data = await response.json()

        // Map the Chainlist format to our NetworkConfig format
        const networks = data.map((chain: any) => ({
            chainId: chain.chainId,
            name: chain.name,
            rpcUrl: chain.rpc && chain.rpc.length > 0 ? chain.rpc.find((rpc: string) => rpc.startsWith('https')) || chain.rpc[0] : '',
            explorer: chain.explorers && chain.explorers.length > 0 ? chain.explorers[0].url : '',
            nativeCurrency: {
                name: chain.nativeCurrency?.name || 'Unknown',
                symbol: chain.nativeCurrency?.symbol || 'ETH',
                decimals: chain.nativeCurrency?.decimals || 18
            }
        })).filter((n: any) => n.rpcUrl && n.rpcUrl.startsWith('http'))

        return networks
    } catch (error) {
        console.error('Error fetching networks:', error)
        return DEFAULT_NETWORKS
    }
}
