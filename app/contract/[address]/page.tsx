'use client'

/**
 * Custom Contract Explorer Page
 * Shows Python source code and Read/Write interface
 */

import { useEffect, useState } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { ExternalLink, CheckCircle2, XCircle, Code, FileCode, Network, User, Calendar, Hash } from 'lucide-react'
import { VerifiedContract } from '@/lib/verification/types'
import { ethers } from 'ethers'

export default function ContractPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const address = params.address as string
  const network = searchParams.get('network') || 'fuji'

  const [contract, setContract] = useState<VerifiedContract | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [account, setAccount] = useState<string | null>(null)
  const [functionArgs, setFunctionArgs] = useState<Record<string, string>>({})

  useEffect(() => {
    loadContract()
    checkWallet()
  }, [address, network])

  const loadContract = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/verify/${address}?network=${network}`)
      const data = await response.json()

      if (data.success && data.contract) {
        setContract(data.contract)
      } else {
        setError('Contract not found or not verified')
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
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

  const callFunction = async (func: any, isView: boolean) => {
    if (!contract || (!account && !isView)) return

    try {
      const provider = new ethers.BrowserProvider(window.ethereum)
      const signer = isView ? provider : await provider.getSigner()
      
      const contractInstance = new ethers.Contract(
        contract.address,
        contract.abi,
        signer
      )

      // Parse arguments
      const args = func.inputs.map((input: any) => {
        const value = functionArgs[`${func.name}_${input.name}`] || ''
        return value || (input.type.includes('int') ? '0' : '')
      })

      if (isView) {
        const result = await contractInstance[func.name](...args)
        alert(`Result: ${result.toString()}`)
      } else {
        const tx = await contractInstance[func.name](...args)
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
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading contract...</div>
      </div>
    )
  }

  if (error || !contract) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <Card className="p-8 bg-slate-800 border-red-500">
          <div className="flex items-center gap-3 text-red-400">
            <XCircle className="w-8 h-8" />
            <div>
              <h2 className="text-xl font-bold">Contract Not Found</h2>
              <p className="text-sm mt-1">{error}</p>
            </div>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900 text-white p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <FileCode className="w-8 h-8 text-purple-400" />
              Python Smart Contract
            </h1>
            <p className="text-slate-400 mt-1">{contract.contractName}</p>
          </div>
          {contract.verified && (
            <Badge className="bg-green-500/20 text-green-400 border-green-500 px-4 py-2">
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Verified
            </Badge>
          )}
        </div>

        {/* Contract Info */}
        <Card className="bg-slate-800/50 border-slate-700 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <Hash className="w-5 h-5 text-purple-400" />
              <div>
                <p className="text-xs text-slate-400">Address</p>
                <p className="font-mono text-sm">{contract.address}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Network className="w-5 h-5 text-blue-400" />
              <div>
                <p className="text-xs text-slate-400">Network</p>
                <p className="text-sm capitalize">{contract.network}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <User className="w-5 h-5 text-green-400" />
              <div>
                <p className="text-xs text-slate-400">Creator</p>
                <p className="font-mono text-sm">{contract.creator.slice(0, 10)}...{contract.creator.slice(-8)}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-yellow-400" />
              <div>
                <p className="text-xs text-slate-400">Deployed</p>
                <p className="text-sm">{new Date(contract.deployedAt).toLocaleString()}</p>
              </div>
            </div>
          </div>

          {contract.explorerUrl && (
            <a
              href={contract.explorerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-blue-400 hover:text-blue-300 mt-4"
            >
              View on Snowtrace <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Python Source Code */}
          <Card className="bg-slate-800/50 border-slate-700 p-6">
            <h2 className="text-xl font-bold flex items-center gap-2 mb-4">
              <Code className="w-5 h-5 text-purple-400" />
              Python Source Code
            </h2>
            <pre className="bg-slate-900 p-4 rounded-lg overflow-auto max-h-[600px] text-xs">
              <code className="text-green-400">{contract.pythonSource}</code>
            </pre>
          </Card>

          {/* Read/Write Contract Interface */}
          <Card className="bg-slate-800/50 border-slate-700 p-6">
            <h2 className="text-xl font-bold mb-4">Read/Write Contract</h2>
            
            <div className="space-y-4">
              {contract.abi
                .filter((item: any) => item.type === 'function')
                .map((func: any, idx: number) => {
                  const isView = func.stateMutability === 'view' || func.stateMutability === 'pure'
                  return (
                    <Card key={idx} className="bg-slate-900 border-slate-700 p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm">{func.name}</span>
                          <Badge className={isView ? 'bg-blue-500/20 text-blue-400' : 'bg-orange-500/20 text-orange-400'}>
                            {isView ? 'view' : 'write'}
                          </Badge>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => callFunction(func, isView)}
                          className={isView ? 'bg-blue-600 hover:bg-blue-700' : 'bg-orange-600 hover:bg-orange-700'}
                        >
                          {isView ? 'Call' : 'Send'}
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
                              className="w-full px-3 py-2 text-sm bg-slate-800 border border-slate-600 rounded text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                            />
                          ))}
                        </div>
                      )}
                    </Card>
                  )
                })}
            </div>

            {!account && (
              <div className="mt-4 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded">
                <p className="text-sm text-yellow-400">
                  Connect your wallet to interact with write functions
                </p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}
