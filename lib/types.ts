// Core types for PyVax IDE

export type Language = "python" | "solidity"
export type ContractType = "storage" | "token" | "counter" | "custom"

export interface FileEntry {
  id: string
  path: string
  name: string
  content: string
  language: Language
  lastModified: number
}

export interface CompilationResult {
  success: boolean
  abi?: any[]
  bytecode?: string
  deployedBytecode?: string
  contractName?: string
  error?: string
  warnings?: any[]
}

export interface DeploymentEntry {
  id: string
  contractName: string
  address: string
  network: string
  abi: any[]
  bytecode: string
  timestamp: number
  txHash: string
}

export interface NetworkConfig {
  name: string
  rpcUrl: string
  chainId: number
  explorer: string
  nativeCurrency: {
    name: string
    symbol: string
    decimals: number
  }
}

export interface IDEState {
  files: FileEntry[]
  currentFileId: string | null
  compiledContracts: Record<string, CompilationResult>
  deployedContracts: DeploymentEntry[]
  consoleLogs: ConsoleLog[]
  selectedNetwork: NetworkConfig
  walletAddress: string | null
  walletBalance: string | null
}

export interface ConsoleLog {
  id: string
  type: "log" | "error" | "warning" | "success"
  message: string
  timestamp: number
}
