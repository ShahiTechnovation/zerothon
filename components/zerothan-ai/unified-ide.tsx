'use client'

import { useState, useEffect } from 'react'
import { Play, Save, Download, Upload, Code2, Zap, Loader2, FileCode, Terminal, Settings, ExternalLink, Code, ChevronDown, ChevronUp, Sparkles, X, Globe, Plus, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Toaster, toast } from 'sonner'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Editor from '@monaco-editor/react'
import { ethers } from 'ethers'

import { transpilePythonToSolidity, PYTHON_CONTRACT_TEMPLATE } from '@/lib/simple-python-transpiler'
import { compileSolidity, EVM_CONTRACT_TEMPLATE, EVM_CONFIG } from '@/lib/solidity-compiler'
import { DEFAULT_NETWORKS, NetworkConfig, fetchAllNetworks } from '@/lib/networks'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { FileSystem } from '@/lib/indexeddb-filesystem'
import { compilePythonNative, checkCompilerStatus } from '@/lib/python-native-compiler'
import { smartCompile, warmupBrowserCompiler } from '@/lib/smart-compiler'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { FileExplorerSidebar } from './file-explorer-sidebar'
import { ActivityBar, ActivityView } from './activity-bar'
import { NetworkSelector } from './network-selector'
import { SearchSidebar } from './sidebars/search-sidebar'
import { DeploySidebar } from './sidebars/deploy-sidebar'
import { EditorTabs } from './editor-tabs'
import { FileEntry } from '@/lib/indexeddb-filesystem'
import { SolidityCompilerPlugin } from '@/lib/plugins/solidity-compiler/SolidityCompilerPlugin'
import EventEmitter from 'events'

declare global {
  interface Window {
    ethereum?: any
  }
}

type Language = 'python' | 'solidity'
type CompilerMode = 'native' | 'transpile' | 'browser'

export function UnifiedIDE() {
  const [language, setLanguage] = useState<Language>('python')
  const [compilerMode, setCompilerMode] = useState<CompilerMode>('native')
  const [pythonCode, setPythonCode] = useState(PYTHON_CONTRACT_TEMPLATE)
  const [solidityCode, setSolidityCode] = useState(EVM_CONTRACT_TEMPLATE)
  const [isTranspiling, setIsTranspiling] = useState(false)
  const [isCompiling, setIsCompiling] = useState(false)
  const [isDeploying, setIsDeploying] = useState(false)
  const [consoleOutput, setConsoleOutput] = useState<string[]>([])
  const [compiledContract, setCompiledContract] = useState<any>(null)
  const [account, setAccount] = useState<string | null>(null)
  const [network, setNetwork] = useState<NetworkConfig | null>(null)
  const [balance, setBalance] = useState<string>('0')
  const [compilerStatus, setCompilerStatus] = useState<'checking' | 'available' | 'unavailable'>('checking')
  const [browserCompilerReady, setBrowserCompilerReady] = useState(false)
  const [browserCompilerInitializing, setBrowserCompilerInitializing] = useState(false)
  const [deployedContract, setDeployedContract] = useState<{ address: string, abi: any[] } | null>(null)
  const [selectedFunction, setSelectedFunction] = useState<string>('')
  const [functionArgs, setFunctionArgs] = useState<{ [key: string]: string }>({})
  const [isConsoleCollapsed, setIsConsoleCollapsed] = useState(false)

  // File System State
  const [files, setFiles] = useState<FileEntry[]>([])
  const [selectedFile, setSelectedFile] = useState<FileEntry | null>(null)
  const [openFiles, setOpenFiles] = useState<FileEntry[]>([])

  // UI State
  const [activeView, setActiveView] = useState<ActivityView>('explorer')

  // Browser Compiler State
  const [compilerPlugin, setCompilerPlugin] = useState<SolidityCompilerPlugin | null>(null)

  // Network Management State
  const [availableNetworks, setAvailableNetworks] = useState<NetworkConfig[]>(DEFAULT_NETWORKS)
  const [allChainlistNetworks, setAllChainlistNetworks] = useState<NetworkConfig[]>([])
  const [isNetworkDialogOpen, setIsNetworkDialogOpen] = useState(false)
  const [isLoadingNetworks, setIsLoadingNetworks] = useState(false)

  const loadAllNetworks = async () => {
    if (allChainlistNetworks.length > 0) return
    setIsLoadingNetworks(true)
    const networks = await fetchAllNetworks()
    setAllChainlistNetworks(networks)
    setIsLoadingNetworks(false)
  }

  useEffect(() => {
    checkWalletConnection()
    checkPythonCompiler()
    initBrowserCompiler()

    // Initialize File System
    loadFiles()

    // Initialize Solidity Compiler Plugin
    const bus = new EventEmitter()
    const plugin = new SolidityCompilerPlugin(bus)

    bus.on('solidityCompiler:compiled', (data: any) => {
      setIsCompiling(false)
      addLog(`✓ Compilation successful! (${data.contracts.length} contracts)`, 'success')

      // Find the most likely contract (last one or one matching file name)
      if (data.contracts.length > 0) {
        const contract = data.contracts[0] // Simple pick
        setCompiledContract(contract)
        addLog(`Contract: ${contract.name}`, 'info')
        addLog(`Bytecode size: ${contract.bytecode.length / 2} bytes`, 'info')
      }

      if (data.warnings && data.warnings.length > 0) {
        data.warnings.forEach((w: any) => addLog(w.formattedMessage || w.message, 'warning'))
      }
    })

    bus.on('solidityCompiler:compilationError', (data: any) => {
      setIsCompiling(false)
      addLog('✗ Compilation failed', 'error')
      if (data.errors) {
        data.errors.forEach((e: any) => addLog(e.formattedMessage || e.message, 'error'))
      } else if (data.error) {
        addLog(data.error, 'error')
      }
    })

    plugin.activate().then(() => {
      setCompilerPlugin(plugin)
      addLog('💎 Solidity Browser Compiler Ready (Remix Mode)', 'success')
    }).catch(err => {
      console.error('Failed to init compiler plugin:', err)
      addLog('⚠ Failed to init local compiler', 'warning')
    })

    return () => plugin.deactivate()
  }, [])

  const loadFiles = async () => {
    try {
      const loaded = await FileSystem.getAllFiles()
      setFiles(loaded)
    } catch (e) {
      console.error('Failed to load files', e)
    }
  }

  const handleSelectFile = (file: FileEntry) => {
    setSelectedFile(file)

    // Add to open files if not present
    if (!openFiles.find(f => f.path === file.path)) {
      setOpenFiles([...openFiles, file])
    }

    if (file.language === 'python') {
      setLanguage('python')
      setPythonCode(file.content)
    } else {
      setLanguage('solidity')
      setSolidityCode(file.content)
    }
  }

  const handleCloseFile = (fileId: number | string) => {
    const newOpenFiles = openFiles.filter(f => (f.id || f.path) !== fileId)
    setOpenFiles(newOpenFiles)

    // If closing active file, switch to another
    if (selectedFile && (selectedFile.id || selectedFile.path) === fileId) {
      if (newOpenFiles.length > 0) {
        handleSelectFile(newOpenFiles[newOpenFiles.length - 1])
      } else {
        setSelectedFile(null)
      }
    }
  }

  const handleCreateFile = async (name: string, type: 'python' | 'solidity') => {
    const path = name.startsWith('/') ? name : `/contracts/${name}`
    const content = type === 'python' ? PYTHON_CONTRACT_TEMPLATE : EVM_CONTRACT_TEMPLATE

    try {
      // Check existence
      const exists = files.find(f => f.path === path)
      if (exists) {
        addLog(`File ${name} already exists`, 'warning')
        return
      }

      const file: FileEntry = {
        name: name.split('/').pop() || name,
        path,
        content,
        language: type,
        createdAt: new Date(),
        updatedAt: new Date(),
        size: content.length
      }

      await FileSystem.saveFile(file)
      await loadFiles()
      handleSelectFile(file)
      addLog(`Created ${name}`, 'success')
    } catch (e: any) {
      addLog(`Error creating file: ${e.message}`, 'error')
    }
  }

  const handleDeleteFile = async (path: string) => {
    if (confirm(`Delete ${path}?`)) {
      await FileSystem.deleteFile(path)
      await loadFiles()
      if (selectedFile?.path === path) {
        setSelectedFile(null)
      }
      addLog(`Deleted ${path}`, 'info')
    }
  }


  const initBrowserCompiler = async () => {
    setBrowserCompilerInitializing(true)
    addLog('🔄 Initializing browser compiler...', 'info')

    try {
      await warmupBrowserCompiler()
      setBrowserCompilerReady(true)
      setBrowserCompilerInitializing(false)
      addLog('✓ Browser compiler ready! (Pyodide loaded)', 'success')
      addLog('ℹ You can now compile Python without a server!', 'info')
    } catch (error: any) {
      setBrowserCompilerInitializing(false)
      addLog('⚠ Browser compiler initialization failed', 'warning')
      addLog('ℹ Falling back to transpiler mode', 'info')
    }
  }

  const checkPythonCompiler = async () => {
    try {
      const status = await checkCompilerStatus()
      setCompilerStatus(status.available ? 'available' : 'unavailable')
      if (status.available) {
        addLog('Python native compiler is available', 'success')
      } else {
        addLog('Python native compiler is not available. Using browser fallback.', 'warning')
        // Keep as 'native' to allow smartCompile to choose browser mode
        // setCompilerMode('transpile')
      }
    } catch (error) {
      setCompilerStatus('unavailable')
      setCompilerStatus('unavailable')
      // setCompilerMode('transpile')
    }
  }

  const addLog = (message: string, type: 'info' | 'success' | 'error' | 'warning' = 'info') => {
    const timestamp = new Date().toLocaleTimeString()
    const prefix = type === 'success' ? '✓' : type === 'error' ? '✗' : type === 'warning' ? '⚠' : 'ℹ'
    setConsoleOutput(prev => [...prev, `[${timestamp}] ${prefix} ${message}`])

    // UX Improvement: Show Toast notifications
    if (type === 'success') toast.success(message)
    else if (type === 'error') toast.error(message)
    else if (type === 'warning') toast.warning(message)
    // Avoid toasting every 'info' log to prevent spam, unless it's critical
    else if (message.includes('Deploying') || message.includes('Transpiling') || message.includes('Compiling') || message.includes('Transaction sent')) {
      toast.info(message)
    }
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
          const foundNetwork = DEFAULT_NETWORKS.find(n => n.chainId === Number(network.chainId))

          setNetwork(foundNetwork || {
            chainId: Number(network.chainId),
            name: network.name === 'unknown' ? `Chain ID: ${network.chainId}` : network.name,
            rpcUrl: '',
            explorer: '',
            nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 }
          })

          const balance = await provider.getBalance(address)
          setBalance(ethers.formatEther(balance))

          addLog(`Connected to ${address.slice(0, 6)}...${address.slice(-4)}`, 'success')
        }
      } catch (error) {
        console.error('Wallet check error:', error)
      }
    }
  }

  const connectWallet = async () => {
    if (typeof window.ethereum === 'undefined') {
      addLog('Please install MetaMask!', 'error')
      return
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum)
      await provider.send('eth_requestAccounts', [])
      await checkWalletConnection()
    } catch (error: any) {
      addLog(`Wallet connection failed: ${error.message}`, 'error')
    }
  }

  const switchToAvalanche = async () => {
    if (typeof window.ethereum === 'undefined') {
      addLog('Please install MetaMask!', 'error')
      return
    }

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0xa869' }], // Avalanche Fuji Testnet
      })
      addLog('Switched to Avalanche Fuji Testnet', 'success')
      await checkWalletConnection()
    } catch (error: any) {
      if (error.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: '0xa869',
              chainName: 'Avalanche Fuji Testnet',
              nativeCurrency: {
                name: 'AVAX',
                symbol: 'AVAX',
                decimals: 18
              },
              rpcUrls: ['https://api.avax-test.network/ext/bc/C/rpc'],
              blockExplorerUrls: ['https://testnet.snowtrace.io/']
            }]
          })
          addLog('Added Avalanche Fuji Testnet', 'success')
        } catch (addError) {
          addLog('Failed to add Avalanche network', 'error')
        }
      } else {
        addLog(`Failed to switch network: ${error.message}`, 'error')
      }
    }
  }

  const compilePythonContract = async () => {
    if (compilerMode === 'native') {
      await compilePythonNativeMode()
    } else {
      await transpilePythonMode()
    }
  }

  const compilePythonNativeMode = async () => {
    setIsCompiling(true)
    addLog('🚀 Compiling Python contract...', 'info')

    try {
      // Use smart compiler - automatically picks best method
      const result = await smartCompile(pythonCode, 'auto')

      if (result.success && result.bytecode && result.abi) {
        setCompiledContract({
          bytecode: result.bytecode,
          abi: result.abi,
          metadata: result.metadata
        })

        // Show compiler mode used
        const compilerName = result.mode === 'browser'
          ? '🌐 Browser Compiler (Pyodide)'
          : result.mode === 'api'
            ? '🔌 API Compiler'
            : '⚡ Transpiler'

        addLog('✓ Compilation successful!', 'success')
        addLog(`Compiler: ${compilerName}`, 'info')
        addLog(`Mode: ${result.mode}`, 'info')
        addLog(`Bytecode size: ${result.bytecode.length / 2} bytes`, 'info')

        if (result.mode === 'browser') {
          addLog('ℹ Compiled entirely in your browser!', 'info')
        }
      } else {
        addLog('✗ Compilation failed', 'error')
        result.errors?.forEach(err => addLog(err, 'error'))
      }
    } catch (error: any) {
      addLog(`Compilation error: ${error.message}`, 'error')
    } finally {
      setIsCompiling(false)
    }
  }

  const transpilePythonMode = async () => {
    setIsTranspiling(true)
    addLog('Transpiling Python to Solidity...', 'info')

    try {
      const result = await transpilePythonToSolidity(pythonCode)

      if (result.success && result.solidity) {
        setSolidityCode(result.solidity)
        setLanguage('solidity')
        addLog('✓ Transpilation successful!', 'success')

        // Save to IndexedDB
        await FileSystem.saveFile({
          name: 'transpiled.sol',
          path: '/contracts/transpiled.sol',
          content: result.solidity,
          language: 'solidity'
        })

        // Auto-compile the Solidity
        await compileContract()
      } else {
        addLog('✗ Transpilation failed', 'error')
        result.errors?.forEach((err: string) => addLog(err, 'error'))
      }
    } catch (error: any) {
      addLog(`Transpilation error: ${error.message}`, 'error')
    } finally {
      setIsTranspiling(false)
    }
  }

  const compileContract = async () => {
    setIsCompiling(true)
    addLog('Compiling Solidity contract...', 'info')

    if (compilerPlugin && compilerPlugin.getStatus().isActive) {
      addLog('Using Browser Compiler (Remix Mode)...', 'info')
      // Using fileName "Contract.sol" as default if no file selected, or the actual file name
      const fileName = selectedFile ? selectedFile.name : 'Contract.sol'
      try {
        await compilerPlugin.compile(solidityCode, fileName)
        // Result is handled via event listeners in useEffect
      } catch (e: any) {
        setIsCompiling(false)
        addLog(`Compiler Error: ${e.message}`, 'error')
      }
      return
    }

    addLog('Fallback to Server Compiler...', 'warning')
    try {
      const result = await compileSolidity(solidityCode, 'Contract')

      if (result.success && result.contracts) {
        const contractName = Object.keys(result.contracts)[0]
        const contract = result.contracts[contractName]

        setCompiledContract(contract)
        addLog('✓ Compilation successful!', 'success')
        addLog(`Contract: ${contractName}`, 'info')
        addLog(`Bytecode size: ${contract.bytecode.length / 2} bytes`, 'info')

        if (result.errors && result.errors.length > 0) {
          result.errors.forEach(err => {
            addLog(err.message, 'warning')
          })
        }
      } else {
        addLog('✗ Compilation failed', 'error')
        result.errors?.forEach(err => {
          addLog(err.message, 'error')
        })
      }
    } catch (error: any) {
      addLog(`Compilation error: ${error.message}`, 'error')
    } finally {
      setIsCompiling(false)
    }
  }

  const deployContract = async () => {
    if (!compiledContract) {
      addLog('Please compile the contract first', 'error')
      return
    }

    if (!account) {
      addLog('Please connect your wallet first', 'error')
      return
    }

    // Validate bytecode
    // For mock compilation we only require non-empty hex bytecode.
    // Very small contracts (like 0x00) are allowed so we can test the full
    // deployment flow even with minimal bytecode.
    if (!compiledContract.bytecode || compiledContract.bytecode === '0x') {
      addLog('Invalid bytecode generated', 'error')
      addLog('This usually means the contract is too simple or has compilation errors', 'error')
      addLog('Try adding a constructor with state variables', 'info')
      return
    }

    setIsDeploying(true)
    addLog('Deploying contract to Avalanche...', 'info')

    try {
      const provider = new ethers.BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()

      // Check if bytecode is valid
      addLog(`📦 Bytecode size: ${(compiledContract.bytecode.length / 2 - 1)} bytes`, 'info')

      if ((compiledContract.bytecode.length / 2 - 1) < 50) {
        addLog('⚠️ Warning: Bytecode is very small, deployment might fail', 'info')
      }

      // For Python contracts from zerocli, wrap runtime bytecode in deployment bytecode
      let deploymentBytecode = compiledContract.bytecode
      if (language === 'python' && !compiledContract.bytecode.includes('6080604052')) {
        addLog('🔧 Wrapping runtime bytecode for deployment...', 'info')

        // Remove 0x prefix if present
        const runtimeCode = compiledContract.bytecode.startsWith('0x')
          ? compiledContract.bytecode.slice(2)
          : compiledContract.bytecode

        const runtimeLength = runtimeCode.length / 2
        const runtimeLengthHex = runtimeLength.toString(16).padStart(4, '0')

        // Create deployment bytecode that:
        // 1. Copies runtime code to memory
        // 2. Returns it to be stored as contract code
        deploymentBytecode = '0x' +
          '61' + runtimeLengthHex +  // PUSH2 <runtime_length>
          '80' +                      // DUP1
          '60' + '0c' +              // PUSH1 12 (offset where runtime code starts)
          '60' + '00' +              // PUSH1 0 (destOffset in memory)
          '39' +                      // CODECOPY
          '60' + '00' +              // PUSH1 0 (offset in memory)
          'f3' +                      // RETURN
          runtimeCode                 // The actual runtime bytecode

        addLog(`✓ Deployment bytecode: ${deploymentBytecode.length / 2} bytes`, 'info')
      }

      const factory = new ethers.ContractFactory(
        compiledContract.abi,
        deploymentBytecode,
        signer
      )

      // For Python contracts, skip gas estimation as the bytecode format may not support it
      // The zerocli compiler produces valid bytecode but it may not estimate correctly
      if (language === 'python') {
        addLog('⚡ Skipping gas estimation for Python contract', 'info')
        addLog('📝 Note: Python contracts from zerocli use Vyper-style bytecode', 'info')
      } else {
        addLog('Estimating gas...', 'info')
        try {
          const deploymentData = factory.interface.encodeDeploy([])
          const gasEstimate = await provider.estimateGas({
            from: account,
            data: compiledContract.bytecode,
          })
          addLog(`⛽ Estimated gas: ${gasEstimate.toString()}`, 'info')
        } catch (gasError: any) {
          addLog('⚠️ Gas estimation failed - will try deployment anyway', 'warning')
          addLog(`Reason: ${gasError.message.substring(0, 100)}`, 'info')
        }
      }

      addLog('Sending deployment transaction...', 'info')
      const contract = await factory.deploy()

      addLog('Waiting for confirmation...', 'info')
      await contract.waitForDeployment()

      const address = await contract.getAddress()
      const deployTx = contract.deploymentTransaction()

      addLog(`✓ Contract deployed at: ${address}`, 'success')
      addLog(`Transaction hash: ${deployTx?.hash}`, 'info')

      // Use the network's explorer URL (Blockscout or chain-specific)
      const explorerUrl = network?.explorer || 'https://eth.blockscout.com'
      addLog(`View on Explorer: ${explorerUrl}/address/${address}`, 'info')

      // Save deployed contract for interaction
      setDeployedContract({
        address,
        abi: compiledContract.abi
      })

      // Auto-verify contract
      if (language === 'python') {
        addLog('Auto-verifying contract...', 'info')
        await autoVerifyContract(address, pythonCode)
      }
    } catch (error: any) {
      addLog(`❌ Deployment failed: ${error.message}`, 'error')

      if (error.message.includes('user rejected')) {
        addLog('Transaction was rejected in MetaMask', 'info')
      } else if (error.message.includes('insufficient funds')) {
        addLog('Insufficient AVAX balance for deployment', 'error')
        addLog('Get testnet AVAX from: https://faucet.avax.network/', 'info')
      }
    } finally {
      setIsDeploying(false)
    }
  }

  const saveToIndexedDB = async () => {
    try {
      const content = language === 'python' ? pythonCode : solidityCode
      const path = selectedFile ? selectedFile.path : (language === 'python' ? '/contracts/contract.py' : '/contracts/contract.sol')
      const name = selectedFile ? selectedFile.name : (language === 'python' ? 'contract.py' : 'contract.sol')

      await FileSystem.saveFile({
        name,
        path,
        content,
        language
      })
      await loadFiles()
      addLog('Saved to IndexedDB', 'success')
    } catch (error: any) {
      addLog(`Save error: ${error.message}`, 'error')
    }
  }

  const loadFromIndexedDB = async () => {
    try {
      const files = await FileSystem.getAllFiles()
      if (files.length > 0) {
        addLog(`Loaded ${files.length} files from IndexedDB`, 'info')
      }
    } catch (error: any) {
      console.error('Load error:', error)
    }
  }

  const autoVerifyContract = async (address: string, sourceCode: string) => {
    let currentNetwork = '43113' // Default ID (Fuji)
    try {
      addLog(`🔍 Starting auto-verification...`, 'info')

      // Extract contract name from source code
      const contractNameMatch = sourceCode.match(/class\s+(\w+)/)
      const contractName = contractNameMatch ? contractNameMatch[1] : 'Contract'

      // Get network from current connection (default to fuji)
      try {
        if (typeof window.ethereum !== 'undefined') {
          const provider = new ethers.BrowserProvider(window.ethereum)
          const network = await provider.getNetwork()
          currentNetwork = network.chainId.toString()
        }
      } catch (e) {
        // Keep default if retrieval fails, but preferably we want the ID
        console.warn('Could not get network ID, defaulting to fuji')
      }

      const response = await fetch('/api/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          address,
          network: currentNetwork,
          pythonSource: sourceCode,
          contractName: contractName,
          compilerVersion: 'pyvax-transpiler-2.0.0',
          abi: compiledContract?.abi || [],
          bytecode: compiledContract?.bytecode || '0x'
        })
      })

      const result = await response.json()

      console.log('[Auto-Verify] Result:', result)
      console.log('[Auto-Verify] Full details:', JSON.stringify(result, null, 2))

      if (result.success && result.verified) {
        addLog(`✓ Contract verified successfully!`, 'success')
        addLog(`📝 Python source saved`, 'success')
        addLog(`🎯 Read/Write functions enabled`, 'success')
      } else {
        addLog(`⚠ Verification failed: ${result.message}`, 'error')
        if (result.errors && result.errors.length > 0) {
          addLog(`Errors:`, 'error')
          result.errors.forEach((err: string, idx: number) => {
            addLog(`  ${idx + 1}. ${err}`, 'error')
          })
        }
      }

      // Always show explorer link
      addLog(`📊 View on Zerothon Explorer: ${window.location.origin}/explorer/${address}?network=${currentNetwork}`, 'info')
    } catch (error: any) {
      console.error('[Auto-Verify] Error:', error)
      addLog(`❌ Verification error: ${error.message}`, 'error')
      addLog(`📊 Explorer: ${window.location.origin}/explorer/${address}?network=${currentNetwork}`, 'info')
    }
  }

  const callContractFunction = async (functionName: string, isView: boolean) => {
    if (!deployedContract || !account) {
      addLog('Contract not deployed or wallet not connected', 'error')
      return
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()

      const contract = new ethers.Contract(
        deployedContract.address,
        deployedContract.abi,
        isView ? provider : signer
      )

      // Get function from ABI
      const funcAbi = deployedContract.abi.find((f: any) => f.type === 'function' && f.name === functionName)
      if (!funcAbi) {
        addLog(`Function ${functionName} not found`, 'error')
        return
      }

      // Parse arguments
      const args = funcAbi.inputs.map((input: any) => {
        const key = `${functionName}-${input.name}`
        const value = functionArgs[key] || ''
        if (input.type.includes('int')) {
          return value || '0'
        }
        return value
      })

      if (isView) {
        // Call view function
        addLog(`Calling ${functionName}...`, 'info')
        const result = await contract[functionName](...args)
        addLog(`✓ Result: ${result.toString()}`, 'success')
      } else {
        // Send transaction
        addLog(`Sending transaction to ${functionName}...`, 'info')
        const tx = await contract[functionName](...args)
        addLog(`Transaction sent: ${tx.hash}`, 'info')
        addLog('Waiting for confirmation...', 'info')
        const receipt = await tx.wait()
        addLog(`✓ Transaction confirmed in block ${receipt.blockNumber}`, 'success')
        addLog(`Gas used: ${receipt.gasUsed.toString()}`, 'info')
      }
    } catch (error: any) {
      addLog(`Error: ${error.message}`, 'error')
    }
  }

  const currentCode = language === 'python' ? pythonCode : solidityCode
  const setCurrentCode = language === 'python' ? setPythonCode : setSolidityCode

  return (
    <>
      <div className="h-full flex flex-col bg-[#0D1117] overflow-hidden">
        {/* Header */}
        <div className="relative shrink-0 z-40">
          <div className="relative flex items-center justify-between px-3 py-1.5 bg-[#18181b] border-b border-[#27272a]">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded flex items-center justify-center">
                  <img src="/zerothon-logo.svg" alt="Logo" className="w-full h-full object-contain" />
                </div>
                <h2 className="text-xs font-bold text-white tracking-wide">ZEROTHON IDE</h2>
              </div>

              <div className="h-3.5 w-px bg-[#27272a] mx-1" />

              {/* Language Selector */}
              <div className="flex gap-1 bg-[#27272a] rounded p-0.5">
                <Button
                  size="sm"
                  onClick={() => setLanguage('python')}
                  className={`h-5 px-2 rounded text-[10px] font-medium transition-all ${language === 'python'
                    ? 'bg-[#3f3f46] text-white shadow-sm'
                    : 'bg-transparent text-gray-400 hover:text-white'
                    }`}
                >
                  Python
                </Button>
                <Button
                  size="sm"
                  onClick={() => setLanguage('solidity')}
                  className={`h-5 px-2 rounded text-[10px] font-medium transition-all ${language === 'solidity'
                    ? 'bg-[#3f3f46] text-white shadow-sm'
                    : 'bg-transparent text-gray-400 hover:text-white'
                    }`}
                >
                  Solidity
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Compiler Mode Selector (for Python) */}
              {language === 'python' && (
                <>
                  <div className="flex items-center gap-2">
                    <Select value={compilerMode} onValueChange={(value) => setCompilerMode(value as CompilerMode)}>
                      <SelectTrigger className="w-[100px] h-6 text-[10px] bg-[#27272a] border-none text-gray-300">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="native">Native</SelectItem>
                        <SelectItem value="browser">Browser</SelectItem>
                        <SelectItem value="transpile">Transpile</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}

              {/* Network Selector */}
              <div className="flex items-center gap-2">
                <NetworkSelector
                  currentNetwork={network}
                  savedNetworks={availableNetworks}
                  onNetworkSelect={async (net: NetworkConfig) => {
                    if (net.chainId === network?.chainId) return;

                    try {
                      if (!window.ethereum) {
                        addLog('MetaMask not found', 'error')
                        return
                      }

                      const hexChainId = `0x${net.chainId.toString(16)}`

                      try {
                        await window.ethereum.request({
                          method: 'wallet_switchEthereumChain',
                          params: [{ chainId: hexChainId }],
                        })
                        setNetwork(net)
                        addLog(`Switched to ${net.name}`, 'success')
                      } catch (switchError: any) {
                        // This error code indicates that the chain has not been added to MetaMask.
                        if (switchError.code === 4902) {
                          try {
                            await window.ethereum.request({
                              method: 'wallet_addEthereumChain',
                              params: [{
                                chainId: hexChainId,
                                chainName: net.name,
                                nativeCurrency: net.nativeCurrency,
                                rpcUrls: [net.rpcUrl],
                                blockExplorerUrls: [net.explorer]
                              }]
                            })
                            setNetwork(net)
                            addLog(`Added and switched to ${net.name}`, 'success')
                          } catch (addError: any) {
                            addLog(`Failed to add network: ${addError.message}`, 'error')
                          }
                        } else {
                          addLog(`Failed to switch network: ${switchError.message}`, 'error')
                        }
                      }
                    } catch (error: any) {
                      console.error(error)
                      addLog(`Network error: ${error.message}`, 'error')
                    }
                  }}
                  onAddNetwork={async (net: NetworkConfig) => {
                    // 1. Add to local list if new
                    if (!availableNetworks.find(n => n.chainId === net.chainId)) {
                      setAvailableNetworks(prev => [...prev, net])
                    }

                    // 2. Trigger the exact same switch logic
                    // We duplicate the logic here or we can just manually trigger the switch
                    try {
                      if (!window.ethereum) return

                      const hexChainId = `0x${net.chainId.toString(16)}`

                      try {
                        await window.ethereum.request({
                          method: 'wallet_switchEthereumChain',
                          params: [{ chainId: hexChainId }],
                        })
                        setNetwork(net)
                        addLog(`Switched to ${net.name}`, 'success')
                      } catch (switchError: any) {
                        if (switchError.code === 4902) {
                          await window.ethereum.request({
                            method: 'wallet_addEthereumChain',
                            params: [{
                              chainId: hexChainId,
                              chainName: net.name,
                              nativeCurrency: net.nativeCurrency,
                              rpcUrls: [net.rpcUrl],
                              blockExplorerUrls: [net.explorer]
                            }]
                          })
                          setNetwork(net)
                          addLog(`Added and switched to ${net.name}`, 'success')
                        } else {
                          throw switchError
                        }
                      }
                    } catch (error: any) {
                      addLog(`Failed to switch to new network: ${error.message}`, 'error')
                    }
                  }}
                />
              </div>

              {/* Wallet Status */}
              {account ? (
                <div className="flex items-center gap-2 px-2 py-0.5 bg-[#27272a] rounded cursor-pointer hover:bg-[#3f3f46] transition-colors border border-[#3f3f46]">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                  <span className="text-[10px] text-gray-300 font-mono">
                    {account.slice(0, 6)}...{account.slice(-4)}
                  </span>
                </div>
              ) : (
                <Button
                  size="sm"
                  onClick={connectWallet}
                  className="h-6 text-[10px] bg-blue-600 hover:bg-blue-700"
                >
                  Connect
                </Button>
              )}

              <Button
                size="sm"
                className="h-6 w-6 p-0 bg-[#27272a] hover:bg-[#3f3f46] text-gray-400 hover:text-white"
                onClick={saveToIndexedDB}
                title="Save All"
              >
                <Save className="w-3.5 h-3.5" />
              </Button>

              <div className="h-3.5 w-px bg-[#27272a] mx-1" />

              {language === 'python' && (
                <Button
                  size="sm"
                  onClick={compilePythonContract}
                  disabled={isTranspiling || isCompiling}
                  className="h-6 px-2 text-[10px] bg-green-600 hover:bg-green-700 text-white"
                >
                  {(isTranspiling || isCompiling) ? (
                    <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                  ) : (
                    <Play className="w-3 h-3 mr-1 fill-white" />
                  )}
                  Run
                </Button>
              )}

              {language === 'solidity' && (
                <Button
                  size="sm"
                  onClick={compileContract}
                  disabled={isCompiling}
                  className="h-6 px-2 text-[10px] bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {isCompiling ? (
                    <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                  ) : (
                    <Zap className="w-3 h-3 mr-1" />
                  )}
                  Compile
                </Button>
              )}

              <Button
                size="sm"
                onClick={deployContract}
                disabled={isDeploying || !compiledContract}
                className="h-6 px-2 text-[10px] bg-purple-600 hover:bg-purple-700 text-white"
              >
                {isDeploying ? (
                  <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                ) : (
                  <Upload className="w-3 h-3 mr-1" />
                )}
                Deploy
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex overflow-hidden">

          {/* Activity Bar (Far Left Rail) */}
          <ActivityBar activeView={activeView} onViewChange={setActiveView} />

          {/* Sidebar Panel (Collapsible) */}
          <div className="flex flex-col border-r border-[#27272a] bg-[#18181b]">
            {activeView === 'explorer' && (
              <FileExplorerSidebar
                files={files}
                selectedFile={selectedFile}
                onSelectFile={handleSelectFile}
                onCreateFile={handleCreateFile}
                onDeleteFile={handleDeleteFile}
              />
            )}
            {activeView === 'search' && (
              <SearchSidebar
                files={files}
                onSelectFile={handleSelectFile}
              />
            )}
            {activeView === 'deploy' && (
              <DeploySidebar
                account={account}
                compiledContract={compiledContract}
                deployedContract={deployedContract}
                isDeploying={isDeploying}
                onDeploy={deployContract}
                onConnect={connectWallet}
              />
            )}
            {(activeView === 'settings' || activeView === 'extensions') && (
              <div className="w-52 p-4 text-gray-400 text-xs">feature coming soon.</div>
            )}
          </div>

          {/* Editor Area (Center) */}
          <div className="flex-1 flex flex-col min-w-0 bg-[#0D1117]">
            {/* Tabs */}
            <EditorTabs
              files={openFiles}
              activeFile={selectedFile}
              onSelect={handleSelectFile}
              onClose={handleCloseFile}
            />

            {/* Monaco Editor */}
            <div className="flex-1 relative">
              <Editor
                height="100%"
                language={language === 'python' ? 'python' : 'sol'}
                value={currentCode}
                onChange={(value) => setCurrentCode(value || '')}
                theme="vs-dark"
                options={{
                  minimap: { enabled: false },
                  fontSize: 13,
                  fontFamily: "'JetBrains Mono', 'Fira Code', Consolas, monospace",
                  lineNumbers: 'on',
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  tabSize: 4,
                  wordWrap: 'on',
                  padding: { top: 12 }
                }}
              />
            </div>

            {/* Bottom Terminal Panel */}
            <div className="h-40 border-t border-[#27272a] flex flex-col bg-[#131316]">
              <div className="flex items-center justify-between px-2 py-1 bg-[#18181b] border-b border-[#27272a]">
                <div className="flex items-center gap-3">
                  <button className="text-[10px] text-white border-b-2 border-blue-500 pb-0.5 px-1 uppercase tracking-wider font-bold">Terminal</button>
                  <button className="text-[10px] text-gray-500 hover:text-gray-300 pb-0.5 px-1 uppercase tracking-wider font-bold">Output</button>
                  <button className="text-[10px] text-gray-500 hover:text-gray-300 pb-0.5 px-1 uppercase tracking-wider font-bold">Problems</button>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setConsoleOutput([])}
                    className="h-4 text-[10px] text-gray-400 hover:text-white"
                  >
                    Clear
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setIsConsoleCollapsed(!isConsoleCollapsed)}
                    className="h-4 w-4 p-0 text-gray-400 hover:text-white"
                  >
                    <ChevronDown className={`w-3 h-3 transition-transform ${isConsoleCollapsed ? 'rotate-180' : ''}`} />
                  </Button>
                </div>
              </div>

              {!isConsoleCollapsed && (
                <div className="flex-1 overflow-auto p-2 font-mono text-[11px] text-gray-300 space-y-0.5">
                  {consoleOutput.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-gray-600 space-y-2">
                      <Terminal className="w-6 h-6 opacity-20" />
                      <p>Ready to compile and deploy</p>
                    </div>
                  ) : (
                    consoleOutput.map((log, i) => (
                      <div
                        key={i}
                        className={`flex gap-2 ${log.includes('✓') ? 'text-green-400' :
                          log.includes('✗') ? 'text-red-400' :
                            log.includes('⚠') ? 'text-amber-400' :
                              'text-gray-300'
                          }`}
                      >
                        <span className="text-gray-600 select-none">❯</span>
                        <span>{log}</span>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {deployedContract && (
          <div className="absolute bottom-4 right-4 w-96 bg-[#18181b] border border-[#27272a] rounded-lg shadow-2xl overflow-hidden z-50 flex flex-col max-h-[600px] flex-1">
            <div className="p-3 bg-[#202023] border-b border-[#27272a] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-xs font-bold text-gray-200">Deployed Contract</span>
              </div>
              <Button size="sm" variant="ghost" onClick={() => setDeployedContract(null)} className="h-6 w-6 p-0 hover:bg-[#2a2d2e] rounded">
                <X className="w-4 h-4 text-gray-400" />
              </Button>
            </div>

            <div className="p-4 overflow-y-auto custom-scrollbar">
              <div className="mb-4 p-2 bg-[#131316] rounded border border-[#27272a] flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">Address</p>
                  <code className="text-xs text-green-400 font-mono">{deployedContract.address.slice(0, 6)}...{deployedContract.address.slice(-4)}</code>
                </div>
                <Button size="sm" variant="ghost" className="h-6 text-[10px]" onClick={() => {
                  const explorerBase = network?.explorer || 'https://eth.blockscout.com'
                  window.open(`${explorerBase}/address/${deployedContract.address}`, '_blank')
                }}><ExternalLink className="w-3 h-3" /></Button>
              </div>

              <div className="space-y-6">
                {/* Write Functions */}
                <div>
                  <h3 className="text-[10px] font-bold text-gray-500 uppercase mb-3 flex items-center gap-2">
                    <Zap className="w-3 h-3" /> Write Functions
                  </h3>
                  <div className="space-y-3">
                    {deployedContract.abi
                      .filter((f: any) => f.type === 'function' && f.stateMutability !== 'view' && f.stateMutability !== 'pure')
                      .map((f: any, i: number) => (
                        <div key={i} className="p-3 rounded bg-[#202023] border border-[#27272a] space-y-3">
                          <div className="font-mono text-xs text-orange-400 font-bold">{f.name}</div>
                          {f.inputs.length > 0 && (
                            <div className="space-y-2">
                              {f.inputs.map((input: any, j: number) => (
                                <div key={j}>
                                  <Input
                                    placeholder={`${input.name} (${input.type})`}
                                    className="h-7 text-xs bg-[#131316] border-[#27272a]"
                                    value={functionArgs[`${f.name}-${input.name}`] || ''}
                                    onChange={(e) => setFunctionArgs(prev => ({ ...prev, [`${f.name}-${input.name}`]: e.target.value }))}
                                  />
                                </div>
                              ))}
                            </div>
                          )}
                          <Button
                            size="sm"
                            className="w-full h-7 text-xs bg-orange-500/10 text-orange-500 hover:bg-orange-500/20 border border-orange-500/20"
                            onClick={() => callContractFunction(f.name, false)}
                          >
                            Transact
                          </Button>
                        </div>
                      ))}
                    {deployedContract.abi.filter((f: any) => f.type === 'function' && f.stateMutability !== 'view' && f.stateMutability !== 'pure').length === 0 && (
                      <div className="text-xs text-gray-600 italic px-2">No write functions</div>
                    )}
                  </div>
                </div>

                {/* Read Functions */}
                <div>
                  <h3 className="text-[10px] font-bold text-gray-500 uppercase mb-3 flex items-center gap-2">
                    <Search className="w-3 h-3" /> Read Functions
                  </h3>
                  <div className="space-y-3">
                    {deployedContract.abi
                      .filter((f: any) => f.type === 'function' && (f.stateMutability === 'view' || f.stateMutability === 'pure'))
                      .map((f: any, i: number) => (
                        <div key={i} className="p-3 rounded bg-[#202023] border border-[#27272a] space-y-3">
                          <div className="font-mono text-xs text-blue-400 font-bold">{f.name}</div>
                          {f.inputs.length > 0 && (
                            <div className="space-y-2">
                              {f.inputs.map((input: any, j: number) => (
                                <div key={j}>
                                  <Input
                                    placeholder={`${input.name} (${input.type})`}
                                    className="h-7 text-xs bg-[#131316] border-[#27272a]"
                                    value={functionArgs[`${f.name}-${input.name}`] || ''}
                                    onChange={(e) => setFunctionArgs(prev => ({ ...prev, [`${f.name}-${input.name}`]: e.target.value }))}
                                  />
                                </div>
                              ))}
                            </div>
                          )}
                          <Button
                            size="sm"
                            className="w-full h-7 text-xs bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 border border-blue-500/20"
                            onClick={() => callContractFunction(f.name, true)}
                          >
                            Query
                          </Button>
                        </div>
                      ))}
                    {deployedContract.abi.filter((f: any) => f.type === 'function' && (f.stateMutability === 'view' || f.stateMutability === 'pure')).length === 0 && (
                      <div className="text-xs text-gray-600 italic px-2">No read functions</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Network Selector Dialog */}
        <Dialog open={isNetworkDialogOpen} onOpenChange={setIsNetworkDialogOpen}>
          <DialogContent className="sm:max-w-2xl bg-[#18181b] border-[#27272a] text-white">
            <DialogHeader>
              <DialogTitle>Select Network</DialogTitle>
            </DialogHeader>
            <Command className="bg-transparent text-gray-300">
              <CommandInput placeholder="Search networks..." className="text-white" />
              <CommandList>
                <CommandEmpty>No network found.</CommandEmpty>
                <CommandGroup heading="Available Networks">
                  {isLoadingNetworks ? (
                    <div className="flex items-center justify-center py-4">
                      <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
                    </div>
                  ) : (
                    allChainlistNetworks.map((network) => (
                      <CommandItem
                        key={network.chainId}
                        value={`${network.name} ${network.chainId}`}
                        onSelect={async () => {
                          // Add to available networks if not exists
                          if (!availableNetworks.find(n => n.chainId === network.chainId)) {
                            setAvailableNetworks([...availableNetworks, network])
                          }

                          // Switch/Add to chain
                          if (window.ethereum) {
                            try {
                              await window.ethereum.request({
                                method: 'wallet_switchEthereumChain',
                                params: [{ chainId: '0x' + network.chainId.toString(16) }],
                              })
                            } catch (switchError: any) {
                              if (switchError.code === 4902) {
                                try {
                                  await window.ethereum.request({
                                    method: 'wallet_addEthereumChain',
                                    params: [{
                                      chainId: '0x' + network.chainId.toString(16),
                                      chainName: network.name,
                                      rpcUrls: [network.rpcUrl],
                                      blockExplorerUrls: [network.explorer],
                                      nativeCurrency: network.nativeCurrency
                                    }]
                                  })
                                } catch (addError) {
                                  addLog('Failed to add network', 'error')
                                }
                              }
                            }
                          }

                          setIsNetworkDialogOpen(false)
                          setTimeout(checkWalletConnection, 1000)
                        }}
                        className="cursor-pointer hover:bg-slate-800"
                      >
                        <div className="flex items-center justify-between w-full">
                          <div className="flex flex-col">
                            <span className="font-medium text-white">{network.name}</span>
                            <span className="text-xs text-slate-400">ID: {network.chainId}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs bg-slate-800 px-2 py-1 rounded text-slate-300">{network.nativeCurrency.symbol}</span>
                            {network.chainId === 1 || network.chainId === 56 || network.chainId === 137 || network.chainId === 43114 ? (
                              <Badge variant="secondary" className="text-[10px] h-5">Mainnet</Badge>
                            ) : null}
                          </div>
                        </div>
                      </CommandItem>
                    ))
                  )}
                </CommandGroup>
              </CommandList>
            </Command>
          </DialogContent>
        </Dialog>
      </div>
      <Toaster position="top-center" theme="dark" />

      {/* Chatbase AI Assistant */}
      <iframe
        src="https://www.chatbase.co/chatbot-iframe/NvAPH2KZUE58uo14cOsIj"
        width="100%"
        style={{ height: '100%', minHeight: '700px', border: 'none' }}
        title="Smart Contract Assistant"
      />
    </>
  )
}
