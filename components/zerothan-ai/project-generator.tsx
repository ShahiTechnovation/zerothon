'use client'

import { useState } from 'react'
import { ChatInterface } from './chat-interface'
import { CodePreview } from './code-preview'
import { APISettings, APIConfig } from './api-settings'
import JSZip from 'jszip'

interface FileContent {
  name: string
  content: string
  language: string
}

interface Project {
  name: string
  description: string
  files: FileContent[]
}

export function ProjectGenerator() {
  const [project, setProject] = useState<Project | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [apiConfig, setApiConfig] = useState<APIConfig | null>(null)
  const [error, setError] = useState<string | null>(null)

  const generateSmartContract = (prompt: string): string => {
    return `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title ${prompt.split(' ').slice(0, 3).join('')}
 * @dev ${prompt}
 */
contract GeneratedContract {
    address public owner;
    mapping(address => uint256) public balances;
    
    event Transfer(address indexed from, address indexed to, uint256 amount);
    event Deposit(address indexed user, uint256 amount);
    
    constructor() {
        owner = msg.sender;
    }
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Not authorized");
        _;
    }
    
    function deposit() public payable {
        require(msg.value > 0, "Must send ETH");
        balances[msg.sender] += msg.value;
        emit Deposit(msg.sender, msg.value);
    }
    
    function transfer(address to, uint256 amount) public {
        require(balances[msg.sender] >= amount, "Insufficient balance");
        balances[msg.sender] -= amount;
        balances[to] += amount;
        emit Transfer(msg.sender, to, amount);
    }
    
    function getBalance(address user) public view returns (uint256) {
        return balances[user];
    }
    
    function withdraw(uint256 amount) public {
        require(balances[msg.sender] >= amount, "Insufficient balance");
        balances[msg.sender] -= amount;
        payable(msg.sender).transfer(amount);
    }
}
`
  }

  const generateReactApp = (prompt: string): string => {
    return `import { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import './App.css'

// Contract ABI (simplified)
const CONTRACT_ABI = [
  "function deposit() public payable",
  "function transfer(address to, uint256 amount) public",
  "function getBalance(address user) public view returns (uint256)",
  "function withdraw(uint256 amount) public",
  "event Transfer(address indexed from, address indexed to, uint256 amount)"
]

const CONTRACT_ADDRESS = "YOUR_CONTRACT_ADDRESS_HERE"

export default function App() {
  const [account, setAccount] = useState<string>('')
  const [balance, setBalance] = useState<string>('0')
  const [contract, setContract] = useState<ethers.Contract | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    initializeWeb3()
  }, [])

  const initializeWeb3 = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum)
        const signer = await provider.getSigner()
        const address = await signer.getAddress()
        
        const contractInstance = new ethers.Contract(
          CONTRACT_ADDRESS,
          CONTRACT_ABI,
          signer
        )
        
        setAccount(address)
        setContract(contractInstance)
        await updateBalance(contractInstance, address)
      } catch (error) {
        console.error('Error initializing Web3:', error)
      }
    } else {
      alert('Please install MetaMask!')
    }
  }

  const updateBalance = async (contractInstance: ethers.Contract, address: string) => {
    try {
      const bal = await contractInstance.getBalance(address)
      setBalance(ethers.formatEther(bal))
    } catch (error) {
      console.error('Error fetching balance:', error)
    }
  }

  const handleDeposit = async () => {
    if (!contract) return
    setLoading(true)
    try {
      const tx = await contract.deposit({ value: ethers.parseEther('0.1') })
      await tx.wait()
      await updateBalance(contract, account)
      alert('Deposit successful!')
    } catch (error) {
      console.error('Deposit error:', error)
      alert('Deposit failed')
    }
    setLoading(false)
  }

  const handleWithdraw = async () => {
    if (!contract) return
    setLoading(true)
    try {
      const tx = await contract.withdraw(ethers.parseEther('0.05'))
      await tx.wait()
      await updateBalance(contract, account)
      alert('Withdrawal successful!')
    } catch (error) {
      console.error('Withdrawal error:', error)
      alert('Withdrawal failed')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
        <h1 className="text-4xl font-bold text-white mb-2">
          ${prompt.split(' ').slice(0, 3).join(' ')}
        </h1>
        <p className="text-slate-300 mb-8">${prompt}</p>
        
        <div className="space-y-6">
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <p className="text-sm text-slate-400 mb-1">Connected Account</p>
            <p className="text-white font-mono text-sm break-all">
              {account || 'Not connected'}
            </p>
          </div>
          
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <p className="text-sm text-slate-400 mb-1">Your Balance</p>
            <p className="text-3xl font-bold text-white">{balance} ETH</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={handleDeposit}
              disabled={loading || !contract}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Processing...' : 'Deposit 0.1 ETH'}
            </button>
            
            <button
              onClick={handleWithdraw}
              disabled={loading || !contract}
              className="bg-white/10 hover:bg-white/20 text-white font-semibold py-3 px-6 rounded-xl border border-white/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Processing...' : 'Withdraw 0.05 ETH'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
`
  }

  const generatePackageJson = (projectName: string): string => {
    return `{
  "name": "${projectName.toLowerCase().replace(/\s+/g, '-')}",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "deploy": "hardhat run scripts/deploy.ts --network sepolia"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "ethers": "^6.9.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "@vitejs/plugin-react": "^4.2.0",
    "hardhat": "^2.19.0",
    "@nomicfoundation/hardhat-toolbox": "^4.0.0",
    "typescript": "^5.3.0",
    "vite": "^5.0.0"
  }
}
`
  }

  const generateDeployScript = (): string => {
    return `import { ethers } from "hardhat"

async function main() {
  console.log("Deploying contract...")
  
  const Contract = await ethers.getContractFactory("GeneratedContract")
  const contract = await Contract.deploy()
  
  await contract.waitForDeployment()
  
  const address = await contract.getAddress()
  console.log(\`Contract deployed to: \${address}\`)
  console.log("Save this address in your frontend!")
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exitCode = 1
  })
`
  }

  const generateHardhatConfig = (): string => {
    return `import { HardhatUserConfig } from "hardhat/config"
import "@nomicfoundation/hardhat-toolbox"

const config: HardhatUserConfig = {
  solidity: "0.8.20",
  networks: {
    sepolia: {
      url: process.env.SEPOLIA_RPC_URL || "",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : []
    },
    avalancheFuji: {
      url: "https://api.avax-test.network/ext/bc/C/rpc",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : []
    }
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY
  }
}

export default config
`
  }

  const generateReadme = (prompt: string): string => {
    return `# ${prompt.split(' ').slice(0, 3).join(' ')}

${prompt}

## 🚀 Quick Start

### Prerequisites
- Node.js v18+
- MetaMask or another Web3 wallet

### Installation

\`\`\`bash
npm install
\`\`\`

### Deploy Smart Contract

1. Create a \`.env\` file:
\`\`\`
PRIVATE_KEY=your_private_key_here
SEPOLIA_RPC_URL=your_rpc_url_here
ETHERSCAN_API_KEY=your_api_key_here
\`\`\`

2. Deploy to Sepolia testnet:
\`\`\`bash
npm run deploy
\`\`\`

3. Copy the deployed contract address and update it in \`src/App.tsx\`

### Run Frontend

\`\`\`bash
npm run dev
\`\`\`

## 📝 Features

- ✅ Smart contract with deposit/withdraw functionality
- ✅ React frontend with ethers.js integration
- ✅ MetaMask wallet connection
- ✅ Real-time balance updates
- ✅ Transaction handling

## 🛠️ Tech Stack

- **Smart Contract**: Solidity ^0.8.20
- **Frontend**: React + TypeScript + Vite
- **Web3**: ethers.js v6
- **Development**: Hardhat

## 📄 License

MIT

---

Built with ❤️ using zerothon AI
`
  }

  // Parse multiple files from AI response
  const parseGeneratedFiles = (generatedCode: string): FileContent[] => {
    const files: FileContent[] = []

    // Match code blocks with file paths
    const codeBlockRegex = /```(\w+)\s*\n(?:\/\/|#)\s*(.+?)\n([\s\S]*?)```/g
    let match

    while ((match = codeBlockRegex.exec(generatedCode)) !== null) {
      const language = match[1].toLowerCase()
      const filePath = match[2].trim()
      const content = match[3].trim()

      // Extract filename from path
      const fileName = filePath.split('/').pop() || filePath

      files.push({
        name: filePath,
        content: content,
        language: language === 'typescript' || language === 'tsx' ? 'typescript' :
          language === 'javascript' || language === 'jsx' ? 'javascript' :
            language === 'solidity' || language === 'sol' ? 'solidity' :
              language === 'json' ? 'json' :
                language === 'markdown' || language === 'md' ? 'markdown' :
                  language
      })
    }

    // If no code blocks found, treat entire response as single file
    if (files.length === 0) {
      const language = generatedCode.includes('pragma solidity') ? 'solidity' :
        generatedCode.includes('import React') ? 'typescript' :
          generatedCode.includes('from zerothon') ? 'python' : 'solidity'

      files.push({
        name: language === 'solidity' ? 'contracts/Contract.sol' :
          language === 'typescript' ? 'src/App.tsx' : 'contract.py',
        content: generatedCode,
        language: language
      })
    }

    return files
  }

  const handleGenerate = async (prompt: string, agentId: string) => {
    if (!apiConfig) {
      setError('Please configure your API settings first')
      return
    }

    setIsGenerating(true)
    setError(null)

    try {
      // Call the API to generate code
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          agentId,
          model: apiConfig.model,
          apiKey: apiConfig.apiKey,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to generate code')
      }

      const data = await response.json()
      const generatedCode = data.code

      const projectName = prompt.split(' ').slice(0, 3).join(' ') || 'Web3 DApp'

      // Parse all files from the AI response
      const parsedFiles = parseGeneratedFiles(generatedCode)

      // Add additional supporting files
      const allFiles: FileContent[] = [...parsedFiles]

      // Only add template files if they weren't generated by AI
      const hasPackageJson = parsedFiles.some(f => f.name.includes('package.json'))
      const hasReadme = parsedFiles.some(f => f.name.includes('README'))
      const hasDeployScript = parsedFiles.some(f => f.name.includes('deploy'))
      const hasHardhatConfig = parsedFiles.some(f => f.name.includes('hardhat.config'))

      if (!hasPackageJson) {
        allFiles.push({
          name: 'package.json',
          content: generatePackageJson(projectName),
          language: 'json'
        })
      }

      if (!hasReadme) {
        allFiles.push({
          name: 'README.md',
          content: generateReadme(prompt),
          language: 'markdown'
        })
      }

      if (!hasDeployScript) {
        allFiles.push({
          name: 'scripts/deploy.ts',
          content: generateDeployScript(),
          language: 'typescript'
        })
      }

      if (!hasHardhatConfig) {
        allFiles.push({
          name: 'hardhat.config.ts',
          content: generateHardhatConfig(),
          language: 'typescript'
        })
      }

      const newProject: Project = {
        name: projectName,
        description: prompt,
        files: allFiles
      }

      setProject(newProject)
    } catch (error) {
      console.error('Generation error:', error)
      setError(error instanceof Error ? error.message : 'Failed to generate project')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleDownload = () => {
    if (!project) return

    const zip = new JSZip()

    project.files.forEach((file) => {
      zip.file(file.name, file.content)
    })

    zip.generateAsync({ type: 'blob' }).then((blob) => {
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${project.name.toLowerCase().replace(/\s+/g, '-')}.zip`
      a.click()
      URL.revokeObjectURL(url)
    })
  }

  return (
    <div className="h-full flex flex-col gap-4">
      {/* API Settings Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {apiConfig && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500/10 border border-green-500/30 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-sm text-green-300">
                {apiConfig.model === 'openai'
                  ? 'OpenAI GPT-4'
                  : apiConfig.model === 'gemini'
                    ? 'Google Gemini 1.5 Flash'
                    : apiConfig.model === 'openrouter'
                      ? 'OpenRouter (Claude 3.5)'
                      : 'Anthropic Claude'}
              </span>
            </div>
          )}
          {error && (
            <div className="px-3 py-1.5 bg-red-500/10 border border-red-500/30 rounded-lg">
              <span className="text-sm text-red-300">{error}</span>
            </div>
          )}
        </div>
        <APISettings onConfigChange={setApiConfig} />
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chat Interface */}
        <div className="h-full">
          <ChatInterface onGenerate={handleGenerate} isGenerating={isGenerating} />
        </div>

        {/* Code Preview */}
        <div className="h-full">
          {project ? (
            <CodePreview
              files={project.files}
              projectName={project.name}
              onDownload={handleDownload}
            />
          ) : (
            <div className="h-full bg-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-700/50 flex items-center justify-center">
              <div className="text-center px-8">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mx-auto mb-6">
                  <FileContent className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">
                  Start Building with AI
                </h3>
                <p className="text-slate-400 max-w-md">
                  Describe your smart contract or dApp in the chat, and I'll generate a complete, production-ready project for you.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function FileContent({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 18V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 15L12 12L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
