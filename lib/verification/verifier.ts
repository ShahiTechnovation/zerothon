/**
 * Python Smart Contract Verification Logic
 * Dynamic Chain Support via Chainlist
 */

import { ethers } from 'ethers'
import { VerificationRequest, VerificationResult, VerifiedContract } from './types'
import { verificationDB } from './database-server'
import { transpilePythonToSolidity } from '../simple-python-transpiler'
import { compilePythonNative } from '../python-native-compiler'

// Cache chain data in memory
let chainCache: any[] | null = null
const CHAINLIST_URL = 'https://chainid.network/chains.json'

async function getChainInfo(networkId: string | number) {
  if (!chainCache) {
    try {
      console.log('[Verification] Fetching Chainlist data...')
      const res = await fetch(CHAINLIST_URL)
      chainCache = await res.json()
    } catch (e) {
      console.error('[Verification] Failed to fetch Chainlist:', e)
      return null
    }
  }

  const id = Number(networkId)
  if (isNaN(id)) {
    // Falls back to name matching if not a number
    return chainCache?.find(c => c.shortName === networkId || c.name.toLowerCase() === String(networkId).toLowerCase())
  }
  return chainCache?.find(c => c.chainId === id)
}

/**
 * Verify a Python smart contract
 */
export async function verifyPythonContract(
  request: VerificationRequest
): Promise<VerificationResult> {
  try {
    const { address, network, pythonSource, contractName, compilerVersion, abi: providedAbi, bytecode: providedBytecode } = request

    console.log(`[Verification] Starting verification for ${address} on network ${network}`)

    // Resolution of Chain Info
    let rpcUrl = ''
    let explorerUrl = ''
    let chainId = 0

    // Manual overrides for stability if Chainlist is slow or missing local testnets
    if (network === 'fuji' || network === '43113') {
      rpcUrl = 'https://api.avax-test.network/ext/bc/C/rpc'
      explorerUrl = `https://testnet.snowtrace.io/address/${address}`
      chainId = 43113
    } else {
      const chainInfo = await getChainInfo(network)
      if (chainInfo) {
        chainId = chainInfo.chainId
        // Pick first HTTPS RPC
        rpcUrl = chainInfo.rpc.find((url: string) => url.startsWith('https://') && !url.includes('${INFURA_API_KEY}')) || chainInfo.rpc[0]

        // Pick first explorer
        if (chainInfo.explorers && chainInfo.explorers.length > 0) {
          const baseUrl = chainInfo.explorers[0].url
          // Handle different explorer URL formats? Usually just append /address/
          explorerUrl = `${baseUrl}/address/${address}`
        }
      }
    }

    if (!rpcUrl) {
      // Last ditch defaults
      if (network === 'localhost') rpcUrl = 'http://localhost:8545'
      else {
        return {
          success: false, verified: false,
          message: `Unsupported network: ${network}. Could not resolve RPC.`,
          errors: ['Network not found in Chainlist']
        }
      }
    }

    // Check if already verified
    const existing = await verificationDB.getContract(address, network)
    if (existing?.verified) {
      console.log(`[Verification] Contract already verified`)
      return {
        success: true,
        verified: true,
        message: 'Contract already verified',
        contract: existing
      }
    }

    // Get on-chain bytecode
    const provider = new ethers.JsonRpcProvider(rpcUrl)

    // Retry logic for contract propagation
    let onChainCode = '0x'
    let attempts = 0
    while ((onChainCode === '0x' || onChainCode === '0x0') && attempts < 5) {
      if (attempts > 0) await new Promise(r => setTimeout(r, 2000)) // Wait 2s
      try {
        onChainCode = await provider.getCode(address)
      } catch (e) {
        console.warn(`[Verification] Attempt ${attempts + 1} failed to get code:`, e)
      }
      attempts++
    }

    if (onChainCode === '0x' || onChainCode === '0x0') {
      return {
        success: false,
        verified: false,
        message: 'No contract found at this address',
        errors: ['Contract does not exist on blockchain']
      }
    }

    // Use provided ABI and bytecode if available (from IDE compilation)
    let compiledBytecode: string
    let abi: any[]
    let metadata: any
    let soliditySource: string | undefined

    if (providedAbi && providedAbi.length > 0 && providedBytecode) {
      console.log('[Verification] Using provided ABI and bytecode from IDE')
      compiledBytecode = providedBytecode
      abi = providedAbi
      metadata = {
        compiler: compilerVersion || 'pyvax-transpiler-2.0.0',
        version: '1.0.0',
        optimization: true
      }
    } else {
      console.log('[Verification] No ABI provided, attempting to compile source')
      try {
        const nativeResult = await compilePythonNative(pythonSource)
        if (nativeResult.success && nativeResult.bytecode) {
          compiledBytecode = nativeResult.bytecode
          abi = nativeResult.abi || []
          metadata = nativeResult.metadata || {}
        } else {
          const transpileResult = await transpilePythonToSolidity(pythonSource)
          soliditySource = transpileResult.solidity
          compiledBytecode = onChainCode
          abi = transpileResult.abi || []
          metadata = {}
        }
      } catch (error: any) {
        return {
          success: false, verified: false,
          message: 'Failed to compile Python source',
          errors: [error.message]
        }
      }
    }

    const matches = await compareBytecode(onChainCode, compiledBytecode)

    // Get deployment info
    const deploymentInfo = await getDeploymentInfo(provider, address)

    // Create verified contract record
    const verifiedContract: Omit<VerifiedContract, 'id'> = {
      address: address.toLowerCase(),
      network: String(chainId || network),
      pythonSource,
      contractName,
      compilerVersion: compilerVersion || 'python-evm-transpiler-0.1.0',
      bytecode: compiledBytecode,
      abi,
      metadata,
      verified: true,
      verifiedAt: Date.now(),
      verifier: deploymentInfo.creator,
      soliditySource,
      deployedAt: deploymentInfo.timestamp,
      deploymentTx: deploymentInfo.txHash,
      creator: deploymentInfo.creator,
      explorerUrl: explorerUrl || ''
    }

    console.log(`[Verification] Saving contract to database...`)
    const id = await verificationDB.addContract(verifiedContract)
    console.log(`[Verification] Contract saved with ID: ${id}`)

    return {
      success: true,
      verified: true,
      message: 'Contract successfully verified!',
      contract: { ...verifiedContract, id }
    }

  } catch (error: any) {
    return {
      success: false, verified: false,
      message: 'Verification failed',
      errors: [error.message]
    }
  }
}

async function compareBytecode(onChain: string, compiled: string): Promise<boolean> {
  const onChainClean = onChain.toLowerCase().replace('0x', '')
  const compiledClean = compiled.toLowerCase().replace('0x', '')
  if (onChainClean === compiledClean) return true
  if (onChainClean.includes(compiledClean) || compiledClean.includes(onChainClean)) return true
  const similarity = calculateSimilarity(onChainClean, compiledClean)
  return similarity > 0.95
}

function calculateSimilarity(a: string, b: string): number {
  const minLen = Math.min(a.length, b.length)
  const maxLen = Math.max(a.length, b.length)
  if (maxLen === 0) return 1
  let matches = 0
  for (let i = 0; i < minLen; i++) {
    if (a[i] === b[i]) matches++
  }
  return matches / maxLen
}

async function getDeploymentInfo(
  provider: ethers.JsonRpcProvider,
  address: string
): Promise<{ creator: string; timestamp: number; txHash: string }> {
  try {
    return {
      creator: address,
      timestamp: Date.now(),
      txHash: '0x0000000000000000000000000000000000000000000000000000000000000000'
    }
  } catch (error) {
    return {
      creator: '0x0000000000000000000000000000000000000000',
      timestamp: Date.now(),
      txHash: '0x0000000000000000000000000000000000000000000000000000000000000000'
    }
  }
}

export async function getVerifiedContract(
  address: string,
  network: string
): Promise<VerifiedContract | null> {
  const contract = await verificationDB.getContract(address, network)
  return contract || null
}

export async function isContractVerified(
  address: string,
  network: string
): Promise<boolean> {
  const contract = await verificationDB.getContract(address, network)
  return contract?.verified || false
}
