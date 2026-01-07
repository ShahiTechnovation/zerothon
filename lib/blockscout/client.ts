/**
 * Blockscout API Client
 * Handles efficient blockchain data queries via Blockscout/Snowtrace API
 */

export interface BlockscoutConfig {
  baseUrl: string
  apiKey?: string
}

export interface Transaction {
  hash: string
  from: string
  to: string
  value: string
  timeStamp: string
  isError: string
  input: string
  gasUsed: string
  gasPrice: string
}

export interface TokenBalance {
  contractAddress: string
  tokenName: string
  tokenSymbol: string
  tokenDecimal: string
  balance: string
}

export interface ContractInfo {
  SourceCode: string
  ABI: string
  ContractName: string
  CompilerVersion: string
  Runs: string
}

class BlockscoutClient {
  private config: BlockscoutConfig

  constructor(config: BlockscoutConfig) {
    this.config = config
  }

  private async fetch(module: string, action: string, params: Record<string, string> = {}) {
    const url = new URL(this.config.baseUrl)
    url.searchParams.set('module', module)
    url.searchParams.set('action', action)
    
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.set(key, value)
    })

    if (this.config.apiKey) {
      url.searchParams.set('apikey', this.config.apiKey)
    }

    const response = await fetch(url.toString())
    const data = await response.json()

    if (data.status === '1') {
      return data.result
    } else {
      console.warn('[Blockscout] API error:', data.message)
      return null
    }
  }

  /**
   * Get transaction list for an address
   */
  async getTransactions(
    address: string,
    startBlock = 0,
    endBlock = 99999999,
    page = 1,
    offset = 10
  ): Promise<Transaction[]> {
    return this.fetch('account', 'txlist', {
      address,
      startblock: startBlock.toString(),
      endblock: endBlock.toString(),
      page: page.toString(),
      offset: offset.toString(),
      sort: 'desc'
    })
  }

  /**
   * Get internal transactions
   */
  async getInternalTransactions(
    address: string,
    startBlock = 0,
    endBlock = 99999999
  ): Promise<Transaction[]> {
    return this.fetch('account', 'txlistinternal', {
      address,
      startblock: startBlock.toString(),
      endblock: endBlock.toString(),
      sort: 'desc'
    })
  }

  /**
   * Get token balances (ERC-20)
   */
  async getTokenBalances(address: string): Promise<TokenBalance[]> {
    return this.fetch('account', 'tokenlist', { address })
  }

  /**
   * Get token transfers (ERC-20)
   */
  async getTokenTransfers(
    address: string,
    contractAddress?: string,
    page = 1,
    offset = 100
  ): Promise<Transaction[]> {
    const params: Record<string, string> = {
      address,
      page: page.toString(),
      offset: offset.toString(),
      sort: 'desc'
    }
    
    if (contractAddress) {
      params.contractaddress = contractAddress
    }

    return this.fetch('account', 'tokentx', params)
  }

  /**
   * Get NFT transfers (ERC-721/ERC-1155)
   */
  async getNFTTransfers(address: string): Promise<Transaction[]> {
    return this.fetch('account', 'tokennfttx', {
      address,
      sort: 'desc'
    })
  }

  /**
   * Get contract source code (if verified on Blockscout)
   */
  async getContractSource(address: string): Promise<ContractInfo | null> {
    const result = await this.fetch('contract', 'getsourcecode', { address })
    return result && result.length > 0 ? result[0] : null
  }

  /**
   * Get contract ABI (if verified on Blockscout)
   */
  async getContractABI(address: string): Promise<any[] | null> {
    const result = await this.fetch('contract', 'getabi', { address })
    if (result) {
      try {
        return JSON.parse(result)
      } catch {
        return null
      }
    }
    return null
  }

  /**
   * Get account balance (AVAX/ETH)
   */
  async getBalance(address: string): Promise<string> {
    return this.fetch('account', 'balance', { address, tag: 'latest' })
  }

  /**
   * Get multiple account balances
   */
  async getBalances(addresses: string[]): Promise<Record<string, string>> {
    const result = await this.fetch('account', 'balancemulti', {
      address: addresses.join(','),
      tag: 'latest'
    })

    if (Array.isArray(result)) {
      return result.reduce((acc, item) => {
        acc[item.account] = item.balance
        return acc
      }, {} as Record<string, string>)
    }

    return {}
  }

  /**
   * Get block by number
   */
  async getBlockByNumber(blockNumber: number): Promise<any> {
    return this.fetch('proxy', 'eth_getBlockByNumber', {
      tag: `0x${blockNumber.toString(16)}`,
      boolean: 'true'
    })
  }

  /**
   * Get transaction by hash
   */
  async getTransaction(txHash: string): Promise<any> {
    return this.fetch('proxy', 'eth_getTransactionByHash', {
      txhash: txHash
    })
  }

  /**
   * Get transaction receipt
   */
  async getTransactionReceipt(txHash: string): Promise<any> {
    return this.fetch('proxy', 'eth_getTransactionReceipt', {
      txhash: txHash
    })
  }
}

// Avalanche C-Chain Snowtrace configuration
export const avalancheClient = new BlockscoutClient({
  baseUrl: 'https://api.snowtrace.io/api',
  apiKey: process.env.SNOWTRACE_API_KEY // Optional: Get from https://snowtrace.io/myapikey
})

// Avalanche Fuji Testnet configuration
export const fujiClient = new BlockscoutClient({
  baseUrl: 'https://api-testnet.snowtrace.io/api',
  apiKey: process.env.SNOWTRACE_API_KEY
})

// Helper to get the right client based on network
export function getBlockscoutClient(network: string): BlockscoutClient {
  switch (network.toLowerCase()) {
    case 'mainnet':
    case 'avalanche':
      return avalancheClient
    case 'fuji':
    case 'testnet':
    default:
      return fujiClient
  }
}
