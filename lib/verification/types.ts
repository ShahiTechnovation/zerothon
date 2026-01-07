/**
 * Types for Python Smart Contract Verification System
 */

export interface VerifiedContract {
  id: string
  address: string
  network: string // 'fuji', 'mainnet', 'ethereum', etc.
  
  // Source code
  pythonSource: string
  contractName: string
  compilerVersion: string // 'python-evm-transpiler-0.1.0'
  
  // Compilation artifacts
  bytecode: string
  abi: any[]
  metadata: ContractMetadata
  
  // Verification
  verified: boolean
  verifiedAt: number // timestamp
  verifier: string // address of verifier
  
  // Optional Solidity intermediate
  soliditySource?: string
  
  // IPFS storage
  ipfsHash?: string
  
  // Explorer links
  explorerUrl?: string
  
  // Stats
  deployedAt: number
  deploymentTx: string
  creator: string
}

export interface ContractMetadata {
  compiler: string
  version: string
  optimization: boolean
  gasEstimate?: number
  stateVariables?: Record<string, any>
  functions?: ContractFunction[]
}

export interface ContractFunction {
  name: string
  signature: string
  selector: string // 4-byte function selector
  type: 'view' | 'nonpayable' | 'payable'
  inputs: FunctionInput[]
  outputs: FunctionOutput[]
  pythonSignature?: string // Original Python signature
}

export interface FunctionInput {
  name: string
  type: string // Solidity type
  pythonType?: string // Python type hint
}

export interface FunctionOutput {
  name: string
  type: string
  pythonType?: string
}

export interface VerificationRequest {
  address: string
  network: string
  pythonSource: string
  contractName: string
  compilerVersion?: string
  constructorArgs?: any[]
  abi?: any[]  // Optional: Pre-compiled ABI from IDE
  bytecode?: string  // Optional: Pre-compiled bytecode from IDE
}

export interface VerificationResult {
  success: boolean
  verified: boolean
  message: string
  contract?: VerifiedContract
  errors?: string[]
}

export interface ContractSearchParams {
  address?: string
  network?: string
  creator?: string
  verified?: boolean
  limit?: number
  offset?: number
}

export interface ContractStats {
  totalVerified: number
  totalContracts: number
  byNetwork: Record<string, number>
  recentVerifications: VerifiedContract[]
}
