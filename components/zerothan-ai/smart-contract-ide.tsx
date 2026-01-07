'use client'

import { useState, useEffect } from 'react'
import { Play, Save, Download, Upload, Settings, Terminal, FileCode, Zap, CheckCircle, XCircle, Loader2, Copy, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Editor from '@monaco-editor/react'
import { ethers } from 'ethers'
import { ElizaAgentAssistant } from './eliza-agent-assistant'

// Extend Window interface for ethereum
declare global {
  interface Window {
    ethereum?: any
  }
}

interface CompilationResult {
  success: boolean
  abi?: any[]
  bytecode?: string
  errors?: string[]
  warnings?: string[]
}

interface DeploymentResult {
  success: boolean
  address?: string
  transactionHash?: string
  error?: string
}

export function SmartContractIDE() {
  const [code, setCode] = useState(DEFAULT_CONTRACT)
  const [activeTab, setActiveTab] = useState<'editor' | 'console' | 'deploy'>('editor')
  const [isCompiling, setIsCompiling] = useState(false)
  const [isDeploying, setIsDeploying] = useState(false)
  const [compilationResult, setCompilationResult] = useState<CompilationResult | null>(null)
  const [deploymentResult, setDeploymentResult] = useState<DeploymentResult | null>(null)
  const [consoleOutput, setConsoleOutput] = useState<string[]>([])
  const [account, setAccount] = useState<string | null>(null)
  const [network, setNetwork] = useState<string>('Not connected')
  const [balance, setBalance] = useState<string>('0')

  useEffect(() => {
    checkWalletConnection()
  }, [])

  const addConsoleLog = (message: string, type: 'info' | 'success' | 'error' | 'warning' = 'info') => {
    const timestamp = new Date().toLocaleTimeString()
    const prefix = type === 'success' ? '✓' : type === 'error' ? '✗' : type === 'warning' ? '⚠' : 'ℹ'
    setConsoleOutput(prev => [...prev, `[${timestamp}] ${prefix} ${message}`])
  }

  const checkWalletConnection = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum)
        const accounts = await provider.listAccounts()
        if (accounts.length > 0) {
          const signer = await provider.getSigner()
          const address = await signer.getAddress()
          setAccount(address)
          
          const network = await provider.getNetwork()
          setNetwork(network.name)
          
          const balance = await provider.getBalance(address)
          setBalance(ethers.formatEther(balance))
          
          addConsoleLog(`Connected to ${address.slice(0, 6)}...${address.slice(-4)}`, 'success')
        }
      } catch (error) {
        console.error('Wallet check error:', error)
      }
    }
  }

  const connectWallet = async () => {
    if (typeof window.ethereum === 'undefined') {
      addConsoleLog('Please install MetaMask!', 'error')
      return
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum)
      await provider.send('eth_requestAccounts', [])
      await checkWalletConnection()
    } catch (error: any) {
      addConsoleLog(`Wallet connection failed: ${error.message}`, 'error')
    }
  }

  const compileContract = async () => {
    setIsCompiling(true)
    addConsoleLog('Starting compilation...', 'info')
    setActiveTab('console')

    try {
      // Call Solidity compiler API
      const response = await fetch('/api/compile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ source: code })
      })

      const result = await response.json()

      if (result.success) {
        setCompilationResult(result)
        addConsoleLog('✓ Compilation successful!', 'success')
        if (result.warnings && result.warnings.length > 0) {
          result.warnings.forEach((warning: string) => addConsoleLog(warning, 'warning'))
        }
      } else {
        setCompilationResult(result)
        addConsoleLog('✗ Compilation failed', 'error')
        if (result.errors) {
          result.errors.forEach((error: string) => addConsoleLog(error, 'error'))
        }
      }
    } catch (error: any) {
      addConsoleLog(`Compilation error: ${error.message}`, 'error')
      setCompilationResult({ success: false, errors: [error.message] })
    } finally {
      setIsCompiling(false)
    }
  }

  const deployContract = async () => {
    if (!compilationResult?.success || !compilationResult.bytecode) {
      addConsoleLog('Please compile the contract first', 'error')
      return
    }

    if (!account) {
      addConsoleLog('Please connect your wallet first', 'error')
      return
    }

    setIsDeploying(true)
    addConsoleLog('Deploying contract...', 'info')
    setActiveTab('console')

    try {
      const provider = new ethers.BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()

      // Create contract factory
      const factory = new ethers.ContractFactory(
        compilationResult.abi!,
        compilationResult.bytecode,
        signer
      )

      addConsoleLog('Sending deployment transaction...', 'info')
      const contract = await factory.deploy()
      
      addConsoleLog('Waiting for confirmation...', 'info')
      await contract.waitForDeployment()
      
      const address = await contract.getAddress()
      const deployTx = contract.deploymentTransaction()

      setDeploymentResult({
        success: true,
        address,
        transactionHash: deployTx?.hash
      })

      addConsoleLog(`✓ Contract deployed at: ${address}`, 'success')
      addConsoleLog(`Transaction hash: ${deployTx?.hash}`, 'info')
      
      setActiveTab('deploy')
    } catch (error: any) {
      addConsoleLog(`Deployment failed: ${error.message}`, 'error')
      setDeploymentResult({
        success: false,
        error: error.message
      })
    } finally {
      setIsDeploying(false)
    }
  }

  const saveToFile = () => {
    const blob = new Blob([code], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'Contract.sol'
    a.click()
    URL.revokeObjectURL(url)
    addConsoleLog('Contract saved to file', 'success')
  }

  const loadFromFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const content = e.target?.result as string
        setCode(content)
        addConsoleLog(`Loaded ${file.name}`, 'success')
      }
      reader.readAsText(file)
    }
  }

  const clearConsole = () => {
    setConsoleOutput([])
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    addConsoleLog('Copied to clipboard', 'success')
  }

  return (
    <>
      <div className="h-full flex flex-col bg-slate-900 rounded-xl border border-slate-700 overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-800 border-b border-slate-700">
        <div className="flex items-center gap-2">
          <FileCode className="w-5 h-5 text-blue-400" />
          <h2 className="text-lg font-semibold text-white">Smart Contract IDE</h2>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Wallet Status */}
          {account ? (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500/10 border border-green-500/30 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-xs text-green-300">
                {account.slice(0, 6)}...{account.slice(-4)}
              </span>
              <span className="text-xs text-slate-400">|</span>
              <span className="text-xs text-slate-300">{balance.slice(0, 6)} ETH</span>
            </div>
          ) : (
            <Button
              size="sm"
              onClick={connectWallet}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Connect Wallet
            </Button>
          )}

          {/* Action Buttons */}
          <Button
            size="sm"
            variant="outline"
            onClick={saveToFile}
            className="bg-slate-700 border-slate-600 hover:bg-slate-600"
          >
            <Save className="w-4 h-4 mr-1" />
            Save
          </Button>

          <label>
            <Button
              size="sm"
              variant="outline"
              className="bg-slate-700 border-slate-600 hover:bg-slate-600"
              asChild
            >
              <span>
                <Upload className="w-4 h-4 mr-1" />
                Load
              </span>
            </Button>
            <input
              type="file"
              accept=".sol"
              onChange={loadFromFile}
              className="hidden"
            />
          </label>

          <Button
            size="sm"
            onClick={compileContract}
            disabled={isCompiling}
            className="bg-purple-600 hover:bg-purple-700"
          >
            {isCompiling ? (
              <Loader2 className="w-4 h-4 mr-1 animate-spin" />
            ) : (
              <Zap className="w-4 h-4 mr-1" />
            )}
            Compile
          </Button>

          <Button
            size="sm"
            onClick={deployContract}
            disabled={isDeploying || !compilationResult?.success}
            className="bg-green-600 hover:bg-green-700"
          >
            {isDeploying ? (
              <Loader2 className="w-4 h-4 mr-1 animate-spin" />
            ) : (
              <Play className="w-4 h-4 mr-1" />
            )}
            Deploy
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Editor */}
        <div className="flex-1 flex flex-col">
          <Editor
            height="100%"
            defaultLanguage="sol"
            value={code}
            onChange={(value) => setCode(value || '')}
            theme="vs-dark"
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              lineNumbers: 'on',
              scrollBeyondLastLine: false,
              automaticLayout: true,
              tabSize: 2,
              wordWrap: 'on',
            }}
          />
        </div>

        {/* Side Panel */}
        <div className="w-96 border-l border-slate-700 flex flex-col bg-slate-800">
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="flex-1 flex flex-col">
            <TabsList className="bg-slate-900 border-b border-slate-700 rounded-none">
              <TabsTrigger value="console" className="flex-1">
                <Terminal className="w-4 h-4 mr-2" />
                Console
              </TabsTrigger>
              <TabsTrigger value="deploy" className="flex-1">
                <Settings className="w-4 h-4 mr-2" />
                Deploy
              </TabsTrigger>
            </TabsList>

            {/* Console Tab */}
            <TabsContent value="console" className="flex-1 flex flex-col m-0 p-0">
              <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-700">
                <span className="text-sm font-semibold text-white">Output</span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={clearConsole}
                  className="h-7 text-slate-400 hover:text-white"
                >
                  <Trash2 className="w-3 h-3 mr-1" />
                  Clear
                </Button>
              </div>
              <div className="flex-1 overflow-auto p-4 font-mono text-xs text-slate-300 space-y-1">
                {consoleOutput.length === 0 ? (
                  <p className="text-slate-500">Console output will appear here...</p>
                ) : (
                  consoleOutput.map((log, i) => (
                    <div
                      key={i}
                      className={`${
                        log.includes('✓') ? 'text-green-400' :
                        log.includes('✗') ? 'text-red-400' :
                        log.includes('⚠') ? 'text-yellow-400' :
                        'text-slate-300'
                      }`}
                    >
                      {log}
                    </div>
                  ))
                )}
              </div>
            </TabsContent>

            {/* Deploy Tab */}
            <TabsContent value="deploy" className="flex-1 flex flex-col m-0 p-0 overflow-auto">
              <div className="p-4 space-y-4">
                {/* Compilation Status */}
                <div className="bg-slate-900 rounded-lg p-4 border border-slate-700">
                  <h3 className="text-sm font-semibold text-white mb-3">Compilation Status</h3>
                  {compilationResult ? (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        {compilationResult.success ? (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-500" />
                        )}
                        <span className={`text-sm ${compilationResult.success ? 'text-green-400' : 'text-red-400'}`}>
                          {compilationResult.success ? 'Compiled Successfully' : 'Compilation Failed'}
                        </span>
                      </div>
                      {compilationResult.success && (
                        <div className="text-xs text-slate-400 space-y-1">
                          <p>✓ ABI generated</p>
                          <p>✓ Bytecode generated</p>
                          <p>✓ Ready to deploy</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-sm text-slate-400">Not compiled yet</p>
                  )}
                </div>

                {/* Deployment Result */}
                {deploymentResult && (
                  <div className="bg-slate-900 rounded-lg p-4 border border-slate-700">
                    <h3 className="text-sm font-semibold text-white mb-3">Deployment Result</h3>
                    {deploymentResult.success ? (
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-5 h-5 text-green-500" />
                          <span className="text-sm text-green-400">Deployed Successfully</span>
                        </div>
                        
                        <div className="space-y-2">
                          <div>
                            <label className="text-xs text-slate-400 block mb-1">Contract Address</label>
                            <div className="flex items-center gap-2">
                              <code className="text-xs text-blue-400 bg-slate-800 px-2 py-1 rounded flex-1 truncate">
                                {deploymentResult.address}
                              </code>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => copyToClipboard(deploymentResult.address!)}
                                className="h-7 w-7 p-0"
                              >
                                <Copy className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                          
                          <div>
                            <label className="text-xs text-slate-400 block mb-1">Transaction Hash</label>
                            <div className="flex items-center gap-2">
                              <code className="text-xs text-slate-300 bg-slate-800 px-2 py-1 rounded flex-1 truncate">
                                {deploymentResult.transactionHash}
                              </code>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => copyToClipboard(deploymentResult.transactionHash!)}
                                className="h-7 w-7 p-0"
                              >
                                <Copy className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        </div>

                        <Button
                          size="sm"
                          variant="outline"
                          className="w-full"
                          onClick={() => window.open(`https://sepolia.etherscan.io/address/${deploymentResult.address}`, '_blank')}
                        >
                          View on Etherscan
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <XCircle className="w-5 h-5 text-red-500" />
                          <span className="text-sm text-red-400">Deployment Failed</span>
                        </div>
                        <p className="text-xs text-slate-400">{deploymentResult.error}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Network Info */}
                <div className="bg-slate-900 rounded-lg p-4 border border-slate-700">
                  <h3 className="text-sm font-semibold text-white mb-3">Network Info</h3>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Network:</span>
                      <span className="text-white">{network}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Account:</span>
                      <span className="text-white">
                        {account ? `${account.slice(0, 6)}...${account.slice(-4)}` : 'Not connected'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Balance:</span>
                      <span className="text-white">{balance} ETH</span>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
    
    {/* Eliza AI Agent Assistant */}
    <ElizaAgentAssistant currentCode={code} />
    </>
  )
}

const DEFAULT_CONTRACT = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title SimpleStorage
 * @dev Store and retrieve a value
 */
contract SimpleStorage {
    uint256 private value;
    
    event ValueChanged(uint256 newValue);
    
    /**
     * @dev Store a new value
     * @param newValue The value to store
     */
    function store(uint256 newValue) public {
        value = newValue;
        emit ValueChanged(newValue);
    }
    
    /**
     * @dev Retrieve the stored value
     * @return The stored value
     */
    function retrieve() public view returns (uint256) {
        return value;
    }
}
`
