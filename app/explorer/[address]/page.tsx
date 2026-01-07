'use client'

/**
 * zerothon Blockchain Explorer
 * Professional explorer page like Etherscan/Snowtrace
 */

import { useEffect, useState } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { ExternalLink, CheckCircle2, Code, FileCode, Network, User, Calendar, Hash, Copy, Activity, DollarSign, Zap, Clock, Database, AlertCircle } from 'lucide-react'
import { ethers } from 'ethers'
import { DEFAULT_NETWORKS, getNetworkByChainId, fetchAllNetworks, NetworkConfig } from '@/lib/networks'

interface ContractInfo {
  address: string
  balance: string
  bytecode: string
  deploymentBlock?: number
  txCount?: number
  verified: boolean
  pythonSource?: string
  abi?: any[]
  network: string
}

interface Transaction {
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

interface TokenBalance {
  contractAddress: string
  tokenName: string
  tokenSymbol: string
  tokenDecimal: string
  balance: string
}

export default function ExplorerPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const address = params.address as string
  const networkParam = searchParams.get('network') || '43113' // Default to Fuji ID
  const networkId = parseInt(networkParam)

  const [currentNetwork, setCurrentNetwork] = useState<NetworkConfig>(
    getNetworkByChainId(networkId) || DEFAULT_NETWORKS[3]
  )

  useEffect(() => {
    // If not found in defaults (or fallback was used but ID doesn't match), fetch full list
    if (!getNetworkByChainId(networkId)) {
      fetchAllNetworks().then(networks => {
        const found = networks.find(n => n.chainId === networkId)
        if (found) {
          setCurrentNetwork(found)
        }
      })
    }
  }, [networkId])

  const [contractInfo, setContractInfo] = useState<ContractInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [account, setAccount] = useState<string | null>(null)
  const [functionArgs, setFunctionArgs] = useState<Record<string, string>>({})
  const [activeTab, setActiveTab] = useState<'overview' | 'transactions' | 'tokens' | 'code' | 'read' | 'write'>('overview')

  // Blockscout data
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [tokens, setTokens] = useState<TokenBalance[]>([])
  const [loadingTxs, setLoadingTxs] = useState(false)
  const [loadingTokens, setLoadingTokens] = useState(false)

  useEffect(() => {
    loadContract()
    loadTransactions()
    loadTokens()
    checkWallet()
  }, [address, currentNetwork])

  const getProvider = () => {
    return new ethers.JsonRpcProvider(currentNetwork.rpcUrl)
  }

  const loadContract = async () => {
    try {
      setLoading(true)
      setError(null)

      const provider = getProvider()

      // Get basic contract info from blockchain
      const code = await provider.getCode(address)
      const balance = await provider.getBalance(address)

      if (code === '0x' || code === '0x0') {
        setError('No contract found at this address')
        setLoading(false)
        return
      }

      // Try to get verified contract data
      let verifiedData = null
      try {
        const response = await fetch(`/api/verify/${address}?network=${currentNetwork.name}`)
        const data = await response.json()
        if (data.success && data.contract) {
          verifiedData = data.contract
        }
      } catch (err) {
        console.log('Contract not verified yet')
      }

      setContractInfo({
        address,
        balance: ethers.formatEther(balance),
        bytecode: code,
        verified: !!verifiedData,
        pythonSource: verifiedData?.pythonSource,
        abi: verifiedData?.abi || [],
        network: currentNetwork.name,
      })

    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const loadTransactions = async () => {
    try {
      setLoadingTxs(true)
      const response = await fetch(`/api/blockscout?action=transactions&address=${address}&network=${currentNetwork.name}&limit=10`)
      const data = await response.json()

      if (data.success && data.data) {
        setTransactions(data.data || [])
      }
    } catch (err) {
      console.log('Failed to load transactions from Blockscout', err)
      // Silently fail - transactions are optional
    } finally {
      setLoadingTxs(false)
    }
  }

  const loadTokens = async () => {
    try {
      setLoadingTokens(true)
      const response = await fetch(`/api/blockscout?action=tokens&address=${address}&network=${currentNetwork.name}`)
      const data = await response.json()

      if (data.success && data.data) {
        setTokens(data.data || [])
      }
    } catch (err) {
      console.log('Failed to load tokens from Blockscout', err)
      // Silently fail - tokens are optional
    } finally {
      setLoadingTokens(false)
    }
  }

  const checkWallet = async () => {
    if (typeof window !== 'undefined' && window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' })
        if (accounts.length > 0) {
          setAccount(accounts[0])
        }
      } catch (err) {
        console.error('Wallet check failed:', err)
      }
    }
  }

  const connectWallet = async () => {
    if (typeof window !== 'undefined' && window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
        if (accounts.length > 0) {
          setAccount(accounts[0])
        }
      } catch (err) {
        console.error('Wallet connection failed:', err)
      }
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    alert('Copied to clipboard!')
  }

  const callFunction = async (func: any, isView: boolean) => {
    if (!contractInfo || !contractInfo.abi || (!account && !isView)) return

    try {
      const provider = new ethers.BrowserProvider(window.ethereum)
      const signer = isView ? provider : await provider.getSigner()

      const contract = new ethers.Contract(
        contractInfo.address,
        contractInfo.abi,
        signer
      )

      const args = func.inputs.map((input: any) => {
        const value = functionArgs[`${func.name}_${input.name}`] || ''
        return value || (input.type.includes('int') ? '0' : '')
      })

      if (isView) {
        const result = await contract[func.name](...args)
        alert(`Result: ${result.toString()}`)
      } else {
        const tx = await contract[func.name](...args)
        alert(`Transaction sent: ${tx.hash}\nWaiting for confirmation...`)
        await tx.wait()
        alert(`Transaction confirmed!`)
      }
    } catch (err: any) {
      alert(`Error: ${err.message}`)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950/20 to-slate-950 flex items-center justify-center p-8">
        <Card className="p-8 bg-slate-900/80 border-blue-500/20 backdrop-blur-sm">
          <div className="flex items-center gap-3 text-white">
            <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-lg">Loading contract...</span>
          </div>
        </Card>
      </div>
    )
  }

  if (error || !contractInfo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950/20 to-slate-950 flex items-center justify-center p-8">
        <Card className="p-8 bg-slate-900/80 border-red-500/20 backdrop-blur-sm max-w-md">
          <div className="flex items-center gap-3 text-red-400 mb-4">
            <AlertCircle className="w-8 h-8" />
            <div>
              <h2 className="text-xl font-bold">Contract Not Found</h2>
              <p className="text-sm mt-1 text-slate-400">{error || 'Unable to load contract'}</p>
            </div>
          </div>
          <div className="space-y-2 text-sm text-slate-300">
            <p>This could mean:</p>
            <ul className="list-disc list-inside space-y-1 text-slate-400">
              <li>No contract deployed at this address</li>
              <li>Wrong network selected</li>
              <li>Invalid address format</li>
            </ul>
          </div>
          <Button
            onClick={() => window.location.href = '/playground'}
            className="mt-4 bg-blue-600 hover:bg-blue-700 w-full"
          >
            Back to Playground
          </Button>
        </Card>
      </div>
    )
  }

  const getExplorerUrl = () => {
    return `${currentNetwork.explorer}/address/${address}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950/20 to-slate-950 text-white">
      {/* Header */}
      <div className="border-b border-blue-500/20 bg-slate-900/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <FileCode className="w-10 h-10 text-blue-400" />
                <div className="absolute inset-0 blur-xl bg-blue-400/30"></div>
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  zerothon Explorer
                </h1>
                <p className="text-slate-400 text-sm mt-1">Avalanche Contract Explorer</p>
              </div>
            </div>

            {account ? (
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30 px-4 py-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2"></div>
                {account.slice(0, 6)}...{account.slice(-4)}
              </Badge>
            ) : (
              <Button
                onClick={connectWallet}
                className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:opacity-90"
              >
                Connect Wallet
              </Button>
            )}
          </div>

          {/* Contract Address Bar */}
          <div className="bg-slate-950/50 rounded-xl p-4 border border-blue-500/20">
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1">
                <p className="text-xs text-slate-400 mb-1">Contract Address</p>
                <code className="text-sm text-blue-400 font-mono select-all break-all">{address}</code>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyToClipboard(address)}
                  className="bg-slate-800 border-slate-700 hover:bg-slate-700"
                >
                  <Copy className="w-4 h-4 mr-1" />
                  Copy
                </Button>
                <a
                  href={getExplorerUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button
                    size="sm"
                    variant="outline"
                    className="bg-slate-800 border-slate-700 hover:bg-slate-700"
                  >
                    <ExternalLink className="w-4 h-4 mr-1" />
                    Snowtrace
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-slate-900/50 border-slate-700/50 p-4 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <DollarSign className="w-8 h-8 text-green-400" />
              <div>
                <p className="text-xs text-slate-400">Balance</p>
                <p className="text-lg font-bold text-white">{parseFloat(contractInfo.balance).toFixed(4)} AVAX</p>
              </div>
            </div>
          </Card>

          <Card className="bg-slate-900/50 border-slate-700/50 p-4 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <Network className="w-8 h-8 text-blue-400" />
              <div>
                <p className="text-xs text-slate-400">Network</p>
                <p className="text-lg font-bold text-white capitalize">{currentNetwork.name}</p>
              </div>
            </div>
          </Card>

          <Card className="bg-slate-900/50 border-slate-700/50 p-4 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              {contractInfo.verified ? (
                <CheckCircle2 className="w-8 h-8 text-green-400" />
              ) : (
                <AlertCircle className="w-8 h-8 text-yellow-400" />
              )}
              <div>
                <p className="text-xs text-slate-400">Status</p>
                <p className="text-lg font-bold text-white">
                  {contractInfo.verified ? 'Verified' : 'Unverified'}
                </p>
              </div>
            </div>
          </Card>

          <Card className="bg-slate-900/50 border-slate-700/50 p-4 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <Database className="w-8 h-8 text-purple-400" />
              <div>
                <p className="text-xs text-slate-400">Bytecode</p>
                <p className="text-lg font-bold text-white">{(contractInfo.bytecode.length / 2 - 1).toLocaleString()} bytes</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Tabs */}
        <div className="bg-slate-900/50 rounded-xl border border-slate-700/50 overflow-hidden backdrop-blur-sm">
          <div className="flex border-b border-slate-700/50 overflow-x-auto">
            {['overview', 'transactions', 'tokens', 'code', 'read', 'write'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`px-6 py-4 font-medium transition-all whitespace-nowrap ${activeTab === tab
                  ? 'bg-blue-600 text-white border-b-2 border-blue-400'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                  }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                {tab === 'transactions' && transactions.length > 0 && (
                  <Badge className="ml-2 bg-blue-500/20 text-blue-400 text-xs">{transactions.length}</Badge>
                )}
                {tab === 'tokens' && tokens.length > 0 && (
                  <Badge className="ml-2 bg-green-500/20 text-green-400 text-xs">{tokens.length}</Badge>
                )}
              </button>
            ))}
          </div>

          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-slate-400 mb-2">Contract Address</p>
                    <code className="text-sm text-blue-400 font-mono">{address}</code>
                  </div>
                  <div>
                    <p className="text-sm text-slate-400 mb-2">Network</p>
                    <Badge className="bg-blue-500/20 text-blue-400">{currentNetwork.name}</Badge>
                  </div>
                  <div>
                    <p className="text-sm text-slate-400 mb-2">Balance</p>
                    <p className="text-sm text-white">{contractInfo.balance} AVAX</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-400 mb-2">Verification Status</p>
                    <Badge className={contractInfo.verified ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}>
                      {contractInfo.verified ? 'Verified ✓' : 'Not Verified'}
                    </Badge>
                  </div>
                </div>

                {!contractInfo.verified && (
                  <Card className="bg-yellow-500/10 border-yellow-500/30 p-4 mt-4">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-yellow-400 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-yellow-400">Contract Not Verified</p>
                        <p className="text-xs text-slate-400 mt-1">
                          This contract hasn't been verified yet. To verify and enable Read/Write functions, deploy again from the zerothon IDE.
                        </p>
                      </div>
                    </div>
                  </Card>
                )}
              </div>
            )}

            {/* Transactions Tab */}
            {activeTab === 'transactions' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold flex items-center gap-2">
                    <Activity className="w-5 h-5 text-blue-400" />
                    Recent Transactions
                    <Badge className="bg-blue-500/20 text-blue-400">
                      Powered by Snowtrace
                    </Badge>
                  </h3>
                </div>

                {loadingTxs ? (
                  <div className="flex items-center justify-center py-8 text-slate-400">
                    <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mr-3"></div>
                    Loading transactions...
                  </div>
                ) : transactions.length === 0 ? (
                  <Card className="bg-slate-950/50 border-slate-700/50 p-8 text-center">
                    <Activity className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                    <p className="text-slate-400">No transactions found</p>
                    <p className="text-xs text-slate-500 mt-2">This contract hasn't been interacted with yet</p>
                  </Card>
                ) : (
                  <div className="space-y-2">
                    {transactions.map((tx, idx) => (
                      <Card key={tx.hash} className="bg-slate-950/50 border-slate-700/50 p-4 hover:border-blue-500/30 transition-all">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center gap-2">
                              <Hash className="w-4 h-4 text-blue-400" />
                              <a
                                href={`https://testnet.snowtrace.io/tx/${tx.hash}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm font-mono text-blue-400 hover:text-blue-300 hover:underline"
                              >
                                {tx.hash.slice(0, 10)}...{tx.hash.slice(-8)}
                              </a >
                              {
                                tx.isError === '0' ? (
                                  <Badge className="bg-green-500/20 text-green-400 text-xs">Success</Badge>
                                ) : (
                                  <Badge className="bg-red-500/20 text-red-400 text-xs">Failed</Badge>
                                )
                              }
                            </div >

                            <div className="grid grid-cols-2 gap-4 text-xs">
                              <div>
                                <span className="text-slate-400">From:</span>
                                <p className="text-slate-300 font-mono">{tx.from.slice(0, 8)}...{tx.from.slice(-6)}</p>
                              </div>
                              <div>
                                <span className="text-slate-400">To:</span>
                                <p className="text-slate-300 font-mono">{tx.to.slice(0, 8)}...{tx.to.slice(-6)}</p>
                              </div>
                            </div>

                            <div className="flex items-center gap-4 text-xs text-slate-400">
                              <div className="flex items-center gap-1">
                                <DollarSign className="w-3 h-3" />
                                {(parseFloat(ethers.formatEther(tx.value)) || 0).toFixed(4)} AVAX
                              </div>
                              <div className="flex items-center gap-1">
                                <Zap className="w-3 h-3" />
                                {parseInt(tx.gasUsed).toLocaleString()} gas
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {new Date(parseInt(tx.timeStamp) * 1000).toLocaleString()}
                              </div>
                            </div>
                          </div >

                          <a
                            href={`https://testnet.snowtrace.io/tx/${tx.hash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-2"
                          >
                            <Button
                              size="sm"
                              variant="outline"
                              className="bg-slate-800 border-slate-700 hover:bg-slate-700"
                            >
                              <ExternalLink className="w-3 h-3" />
                            </Button>
                          </a>
                        </div >
                      </Card >
                    ))
                    }

                    {
                      transactions.length >= 10 && (
                        <Card className="bg-blue-500/10 border-blue-500/30 p-4 text-center">
                          <p className="text-sm text-blue-400">
                            Showing last 10 transactions.
                            <a
                              href={`https://testnet.snowtrace.io/address/${address}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="ml-1 hover:underline font-medium"
                            >
                              View all on Snowtrace →
                            </a>
                          </p>
                        </Card>
                      )
                    }
                  </div >
                )}
              </div >
            )}

            {/* Tokens Tab */}
            {
              activeTab === 'tokens' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold flex items-center gap-2">
                      <DollarSign className="w-5 h-5 text-green-400" />
                      Token Holdings
                      <Badge className="bg-green-500/20 text-green-400">
                        Powered by Snowtrace
                      </Badge>
                    </h3>
                  </div>

                  {loadingTokens ? (
                    <div className="flex items-center justify-center py-8 text-slate-400">
                      <div className="w-6 h-6 border-2 border-green-500 border-t-transparent rounded-full animate-spin mr-3"></div>
                      Loading tokens...
                    </div>
                  ) : tokens.length === 0 ? (
                    <Card className="bg-slate-950/50 border-slate-700/50 p-8 text-center">
                      <DollarSign className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                      <p className="text-slate-400">No tokens found</p>
                      <p className="text-xs text-slate-500 mt-2">This contract doesn't hold any ERC-20 tokens</p>
                    </Card>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {tokens.map((token, idx) => (
                        <Card key={idx} className="bg-slate-950/50 border-slate-700/50 p-4 hover:border-green-500/30 transition-all">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-cyan-400 flex items-center justify-center text-white font-bold text-sm">
                                  {token.tokenSymbol.slice(0, 2)}
                                </div>
                                <div>
                                  <p className="text-sm font-bold text-white">{token.tokenName}</p>
                                  <p className="text-xs text-slate-400">{token.tokenSymbol}</p>
                                </div>
                              </div>

                              <div className="space-y-1 text-xs">
                                <div>
                                  <span className="text-slate-400">Balance:</span>
                                  <p className="text-green-400 font-bold text-lg">
                                    {(parseInt(token.balance) / Math.pow(10, parseInt(token.tokenDecimal))).toLocaleString(undefined, { maximumFractionDigits: 4 })} {token.tokenSymbol}
                                  </p>
                                </div>
                                <div>
                                  <span className="text-slate-400">Contract:</span>
                                  <p className="text-slate-300 font-mono">{token.contractAddress.slice(0, 8)}...{token.contractAddress.slice(-6)}</p>
                                </div>
                              </div>
                            </div>

                            <a
                              href={`https://testnet.snowtrace.io/token/${token.contractAddress}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Button
                                size="sm"
                                variant="outline"
                                className="bg-slate-800 border-slate-700 hover:bg-slate-700"
                              >
                                <ExternalLink className="w-3 h-3" />
                              </Button>
                            </a>
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              )
            }

            {/* Code Tab */}
            {
              activeTab === 'code' && (
                <div className="space-y-6">
                  {contractInfo.verified && contractInfo.pythonSource ? (
                    <>
                      {/* Python Source Code */}
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-bold flex items-center gap-2">
                            <Code className="w-5 h-5 text-green-400" />
                            Python Source Code
                          </h3>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              navigator.clipboard.writeText(contractInfo.pythonSource!)
                              alert('Python source copied to clipboard!')
                            }}
                            className="bg-slate-800 border-slate-700 hover:bg-slate-700"
                          >
                            <Copy className="w-4 h-4 mr-2" />
                            Copy Source
                          </Button>
                        </div>
                        <pre className="bg-slate-950 p-4 rounded-lg overflow-auto max-h-[400px] text-xs border border-slate-700">
                          <code className="text-green-400">{contractInfo.pythonSource}</code>
                        </pre>
                      </div>

                      {/* ABI Output */}
                      {contractInfo.abi && contractInfo.abi.length > 0 && (
                        <div>
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold flex items-center gap-2">
                              <FileCode className="w-5 h-5 text-blue-400" />
                              Contract ABI
                              <Badge className="bg-blue-500/20 text-blue-400 text-xs">
                                {contractInfo.abi.length} functions
                              </Badge>
                            </h3>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                navigator.clipboard.writeText(JSON.stringify(contractInfo.abi, null, 2))
                                alert('ABI copied to clipboard!')
                              }}
                              className="bg-slate-800 border-slate-700 hover:bg-slate-700"
                            >
                              <Copy className="w-4 h-4 mr-2" />
                              Copy ABI
                            </Button>
                          </div>

                          {/* ABI Preview */}
                          <Card className="bg-slate-950 border-blue-500/20 p-4">
                            <p className="text-xs text-slate-400 mb-2">Use this ABI in your frontend to interact with the contract:</p>
                            <pre className="bg-slate-900 p-3 rounded-lg overflow-auto max-h-[300px] text-xs border border-slate-800">
                              <code className="text-blue-300">{JSON.stringify(contractInfo.abi, null, 2)}</code>
                            </pre>

                            {/* Usage Example */}
                            <details className="mt-4">
                              <summary className="text-sm text-slate-400 cursor-pointer hover:text-white font-medium">
                                📝 Frontend Integration Example
                              </summary>
                              <div className="mt-3 space-y-3">
                                <div>
                                  <p className="text-xs font-medium text-slate-300 mb-2">JavaScript / ethers.js:</p>
                                  <pre className="bg-slate-900 p-3 rounded text-xs overflow-auto border border-slate-800">
                                    <code className="text-cyan-300">{`import { ethers } from 'ethers'

// Contract ABI (copy from above)
const abi = ${JSON.stringify(contractInfo.abi, null, 2)}

// Contract address
const address = "${contractInfo.address}"

// Connect to contract
const provider = new ethers.BrowserProvider(window.ethereum)
const signer = await provider.getSigner()
const contract = new ethers.Contract(address, abi, signer)

// Call view functions (free)
const result = await contract.someViewFunction()

// Send transactions (costs gas)
const tx = await contract.someWriteFunction(arg1, arg2)
await tx.wait() // Wait for confirmation`}</code>
                                  </pre>
                                </div>

                                <div>
                                  <p className="text-xs font-medium text-slate-300 mb-2">React Hook:</p>
                                  <pre className="bg-slate-900 p-3 rounded text-xs overflow-auto border border-slate-800">
                                    <code className="text-pink-300">{`import { useContract } from 'wagmi'

function MyComponent() {
  const contract = useContract({
    address: "${contractInfo.address}",
    abi: ${JSON.stringify(contractInfo.abi.slice(0, 2), null, 2)},
    // ... more functions
  })
  
  return <div>Contract loaded!</div>
}`}</code>
                                  </pre>
                                </div>
                              </div>
                            </details>
                          </Card>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="text-center py-12">
                      <Code className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                      <p className="text-slate-400 mb-2">Source code not available</p>
                      <p className="text-sm text-slate-500">Contract needs to be verified to view source code</p>
                    </div>
                  )}
                </div>
              )
            }

            {/* Read Contract Tab */}
            {
              activeTab === 'read' && (
                <div>
                  {contractInfo.verified && contractInfo.abi && contractInfo.abi.length > 0 ? (
                    <div className="space-y-3">
                      {contractInfo.abi
                        .filter((item: any) => item.type === 'function' && (item.stateMutability === 'view' || item.stateMutability === 'pure'))
                        .map((func: any, idx: number) => (
                          <Card key={idx} className="bg-slate-950 border-blue-500/20 p-4">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-sm text-white">{func.name}</span>
                                <Badge className="bg-blue-500/20 text-blue-400 text-xs">view</Badge>
                              </div>
                              <Button
                                size="sm"
                                onClick={() => callFunction(func, true)}
                                className="bg-blue-600 hover:bg-blue-700"
                              >
                                Query
                              </Button>
                            </div>
                            {func.inputs.length > 0 && (
                              <div className="space-y-2">
                                {func.inputs.map((input: any, inputIdx: number) => (
                                  <input
                                    key={inputIdx}
                                    type="text"
                                    placeholder={`${input.name} (${input.type})`}
                                    value={functionArgs[`${func.name}_${input.name}`] || ''}
                                    onChange={(e) => setFunctionArgs({
                                      ...functionArgs,
                                      [`${func.name}_${input.name}`]: e.target.value
                                    })}
                                    className="w-full px-3 py-2 text-sm bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                                  />
                                ))}
                              </div>
                            )}
                          </Card>
                        ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Activity className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                      <p className="text-slate-400 mb-2">No read functions available</p>
                      <p className="text-sm text-slate-500">Contract needs to be verified to interact</p>
                    </div>
                  )}
                </div>
              )
            }

            {/* Write Contract Tab */}
            {
              activeTab === 'write' && (
                <div>
                  {!account ? (
                    <div className="text-center py-12">
                      <User className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                      <p className="text-slate-400 mb-4">Connect wallet to write to contract</p>
                      <Button
                        onClick={connectWallet}
                        className="bg-gradient-to-r from-blue-600 to-cyan-600"
                      >
                        Connect Wallet
                      </Button>
                    </div>
                  ) : contractInfo.verified && contractInfo.abi && contractInfo.abi.length > 0 ? (
                    <div className="space-y-3">
                      {contractInfo.abi
                        .filter((item: any) => item.type === 'function' && item.stateMutability !== 'view' && item.stateMutability !== 'pure')
                        .map((func: any, idx: number) => (
                          <Card key={idx} className="bg-slate-950 border-orange-500/20 p-4">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-sm text-white">{func.name}</span>
                                <Badge className="bg-orange-500/20 text-orange-400 text-xs">write</Badge>
                              </div>
                              <Button
                                size="sm"
                                onClick={() => callFunction(func, false)}
                                className="bg-orange-600 hover:bg-orange-700"
                              >
                                Write
                              </Button>
                            </div>
                            {func.inputs.length > 0 && (
                              <div className="space-y-2">
                                {func.inputs.map((input: any, inputIdx: number) => (
                                  <input
                                    key={inputIdx}
                                    type="text"
                                    placeholder={`${input.name} (${input.type})`}
                                    value={functionArgs[`${func.name}_${input.name}`] || ''}
                                    onChange={(e) => setFunctionArgs({
                                      ...functionArgs,
                                      [`${func.name}_${input.name}`]: e.target.value
                                    })}
                                    className="w-full px-3 py-2 text-sm bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
                                  />
                                ))}
                              </div>
                            )}
                          </Card>
                        ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Zap className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                      <p className="text-slate-400 mb-2">No write functions available</p>
                      <p className="text-sm text-slate-500">Contract needs to be verified to interact</p>
                    </div>
                  )}
                </div>
              )
            }
          </div >
        </div >
      </div >
    </div >
  )
}
