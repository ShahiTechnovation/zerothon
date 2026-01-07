"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Play,
  Save,
  Download,
  FileText,
  Folder,
  FolderOpen,
  Plus,
  Terminal,
  Zap,
  Code,
  Rocket,
  Crown,
} from "lucide-react"
import { PremiumPricingPopup } from "./premium-pricing-popup"

interface FileNode {
  name: string
  type: "file" | "folder"
  content?: string
  children?: FileNode[]
  isOpen?: boolean
}

export function RemixIDE() {
  const [files, setFiles] = useState<FileNode[]>([
    {
      name: "contracts",
      type: "folder",
      isOpen: true,
      children: [
        {
          name: "SimpleToken.py",
          type: "file",
          content: `from avax_cli.py_contracts import PySmartContract

@PySmartContract
class SimpleToken:
    def __init__(self, name: str, symbol: str, initial_supply: uint256):
        self.name = name
        self.symbol = symbol
        self.total_supply = initial_supply
        self.balances = {}
        self.balances[msg.sender] = initial_supply
    
    @public_function
    def transfer(self, to: address, amount: uint256) -> bool:
        require(self.balances[msg.sender] >= amount, "Insufficient balance")
        self.balances[msg.sender] -= amount
        self.balances[to] += amount
        return True
    
    @view_function
    def balance_of(self, account: address) -> uint256:
        return self.balances.get(account, 0)`,
        },
        {
          name: "NFTCollection.py",
          type: "file",
          content: `from avax_cli.py_contracts import PySmartContract

@PySmartContract
class NFTCollection:
    def __init__(self, name: str, symbol: str):
        self.name = name
        self.symbol = symbol
        self.token_counter = 0
        self.owners = {}
        self.token_uris = {}
    
    @public_function
    def mint(self, to: address, token_uri: str) -> uint256:
        token_id = self.token_counter
        self.owners[token_id] = to
        self.token_uris[token_id] = token_uri
        self.token_counter += 1
        return token_id`,
        },
      ],
    },
    {
      name: "scripts",
      type: "folder",
      isOpen: false,
      children: [
        {
          name: "deploy.py",
          type: "file",
          content: `from pyvax import deploy_contract

def main():
    # Deploy SimpleToken contract
    token = deploy_contract(
        "SimpleToken",
        args=["PyVax Token", "PVX", 1000000]
    )
    print(f"Token deployed at: {token.address}")

if __name__ == "__main__":
    main()`,
        },
      ],
    },
  ])

  const [activeFile, setActiveFile] = useState<string>("SimpleToken.py")
  const [activeContent, setActiveContent] = useState<string>("")
  const [compilationOutput, setCompilationOutput] = useState<string>("")
  const [isCompiling, setIsCompiling] = useState(false)
  const [activeTab, setActiveTab] = useState<"editor" | "compiler" | "deploy" | "debugger">("editor")
  const [showPremiumPopup, setShowPremiumPopup] = useState(false)
  const [deploymentStatus, setDeploymentStatus] = useState<"idle" | "deploying" | "success" | "error">("idle")

  useEffect(() => {
    // Find and set active file content
    const findFileContent = (nodes: FileNode[], fileName: string): string => {
      for (const node of nodes) {
        if (node.type === "file" && node.name === fileName) {
          return node.content || ""
        }
        if (node.children) {
          const content = findFileContent(node.children, fileName)
          if (content) return content
        }
      }
      return ""
    }

    setActiveContent(findFileContent(files, activeFile))
  }, [activeFile, files])

  const toggleFolder = (folderName: string) => {
    const updateFolder = (nodes: FileNode[]): FileNode[] => {
      return nodes.map((node) => {
        if (node.name === folderName && node.type === "folder") {
          return { ...node, isOpen: !node.isOpen }
        }
        if (node.children) {
          return { ...node, children: updateFolder(node.children) }
        }
        return node
      })
    }
    setFiles(updateFolder(files))
  }

  const handleCompile = async () => {
    setIsCompiling(true)
    setActiveTab("compiler")

    // Simulate compilation
    setTimeout(() => {
      setCompilationOutput(`Compiling ${activeFile}...
✓ Syntax check passed
✓ Type checking passed
✓ Security analysis passed
✓ Gas optimization applied

Compilation successful!
Contract size: 2.4 KB
Gas estimate: 1,234,567

Generated files:
- ${activeFile.replace(".py", ".sol")}
- ${activeFile.replace(".py", ".json")}
- ${activeFile.replace(".py", ".bin")}`)
      setIsCompiling(false)
    }, 2000)
  }

  const handleDeploy = async () => {
    setShowPremiumPopup(true)
  }

  const handlePremiumDeploy = async () => {
    setDeploymentStatus("deploying")
    setActiveTab("deploy")

    // Simulate deployment process
    setTimeout(() => {
      setDeploymentStatus("success")
    }, 3000)
  }

  const renderFileTree = (nodes: FileNode[], depth = 0) => {
    return nodes.map((node, index) => (
      <div key={index} style={{ marginLeft: `${depth * 16}px` }}>
        <div
          className={`flex items-center gap-2 px-2 py-1 hover:bg-slate-700 cursor-pointer rounded text-sm ${
            node.type === "file" && node.name === activeFile ? "bg-slate-700 text-blue-400" : "text-slate-300"
          }`}
          onClick={() => {
            if (node.type === "folder") {
              toggleFolder(node.name)
            } else {
              setActiveFile(node.name)
            }
          }}
        >
          {node.type === "folder" ? (
            node.isOpen ? (
              <FolderOpen className="w-4 h-4" />
            ) : (
              <Folder className="w-4 h-4" />
            )
          ) : (
            <FileText className="w-4 h-4" />
          )}
          <span>{node.name}</span>
        </div>
        {node.type === "folder" && node.isOpen && node.children && (
          <div>{renderFileTree(node.children, depth + 1)}</div>
        )}
      </div>
    ))
  }

  return (
    <div className="flex h-full bg-slate-900">
      {/* Sidebar */}
      <div className="w-64 bg-slate-800 border-r border-slate-700 flex flex-col">
        {/* Sidebar Header */}
        <div className="p-4 border-b border-slate-700">
          <h2 className="text-white font-mono font-semibold">PyVax IDE</h2>
        </div>

        {/* File Explorer */}
        <div className="flex-1 p-2">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 uppercase tracking-wide">Explorer</span>
            <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
              <Plus className="w-3 h-3" />
            </Button>
          </div>
          <div className="space-y-1">{renderFileTree(files)}</div>
        </div>

        {/* Sidebar Tabs */}
        <div className="border-t border-slate-700 p-2">
          <div className="grid grid-cols-2 gap-1">
            <Button
              size="sm"
              variant={activeTab === "compiler" ? "default" : "ghost"}
              onClick={() => setActiveTab("compiler")}
              className="text-xs"
            >
              <Code className="w-3 h-3 mr-1" />
              Compile
            </Button>
            <Button
              size="sm"
              variant={activeTab === "deploy" ? "default" : "ghost"}
              onClick={() => setActiveTab("deploy")}
              className="text-xs"
            >
              <Zap className="w-3 h-3 mr-1" />
              Deploy
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Toolbar */}
        <div className="bg-slate-800 border-b border-slate-700 p-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-300 font-mono">{activeFile}</span>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" onClick={handleCompile} disabled={isCompiling}>
              <Play className="w-4 h-4 mr-1" />
              {isCompiling ? "Compiling..." : "Compile"}
            </Button>
            <Button
              size="sm"
              onClick={handleDeploy}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
              disabled={deploymentStatus === "deploying"}
            >
              <Rocket className="w-4 h-4 mr-1" />
              {deploymentStatus === "deploying" ? "Deploying..." : "Deploy"}
              <Crown className="w-3 h-3 ml-1" />
            </Button>
            <Button size="sm" variant="outline">
              <Save className="w-4 h-4 mr-1" />
              Save
            </Button>
            <Button size="sm" variant="outline">
              <Download className="w-4 h-4 mr-1" />
              Export
            </Button>
          </div>
        </div>

        {/* Editor Area */}
        <div className="flex-1 flex">
          {/* Code Editor */}
          <div className="flex-1 flex flex-col">
            <div className="flex-1 bg-slate-950">
              <textarea
                value={activeContent}
                onChange={(e) => setActiveContent(e.target.value)}
                className="w-full h-full p-4 bg-transparent text-slate-300 font-mono text-sm resize-none outline-none"
                placeholder="Start coding your smart contract..."
                spellCheck={false}
              />
            </div>
          </div>

          {/* Right Panel */}
          <div className="w-80 bg-slate-800 border-l border-slate-700 flex flex-col">
            {/* Panel Tabs */}
            <div className="border-b border-slate-700 p-2">
              <div className="flex gap-1">
                <Button
                  size="sm"
                  variant={activeTab === "compiler" ? "default" : "ghost"}
                  onClick={() => setActiveTab("compiler")}
                  className="text-xs"
                >
                  Compiler
                </Button>
                <Button
                  size="sm"
                  variant={activeTab === "deploy" ? "default" : "ghost"}
                  onClick={() => setActiveTab("deploy")}
                  className="text-xs"
                >
                  Deploy
                </Button>
                <Button
                  size="sm"
                  variant={activeTab === "debugger" ? "default" : "ghost"}
                  onClick={() => setActiveTab("debugger")}
                  className="text-xs"
                >
                  Debug
                </Button>
              </div>
            </div>

            {/* Panel Content */}
            <div className="flex-1 p-4">
              {activeTab === "compiler" && (
                <div>
                  <h3 className="text-white font-semibold mb-3">Compilation Output</h3>
                  <div className="bg-slate-950 rounded p-3 h-64 overflow-y-auto">
                    <pre className="text-xs text-slate-300 font-mono whitespace-pre-wrap">
                      {compilationOutput || 'Click "Compile" to see output...'}
                    </pre>
                  </div>
                </div>
              )}

              {activeTab === "deploy" && (
                <div>
                  <h3 className="text-white font-semibold mb-3 flex items-center">
                    Deploy Contract
                    <Crown className="w-4 h-4 ml-2 text-yellow-500" />
                  </h3>

                  {deploymentStatus === "idle" && (
                    <div className="space-y-4">
                      <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Crown className="w-5 h-5 text-yellow-500" />
                          <span className="text-sm font-medium text-white">Premium Feature</span>
                        </div>
                        <p className="text-xs text-slate-300 mb-3">
                          Deploy your Python smart contracts natively to any EVM network with our advanced deployment
                          engine.
                        </p>
                        <Button
                          onClick={handleDeploy}
                          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                        >
                          <Rocket className="w-4 h-4 mr-2" />
                          Unlock Deployment
                        </Button>
                      </div>

                      <div className="space-y-3 opacity-50">
                        <div>
                          <label className="block text-xs text-slate-400 mb-1">Network</label>
                          <select
                            className="w-full bg-slate-950 border border-slate-600 rounded px-3 py-2 text-sm text-slate-300"
                            disabled
                          >
                            <option>Fuji Testnet</option>
                            <option>Avalanche Mainnet</option>
                            <option>Ethereum Mainnet</option>
                            <option>Polygon</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs text-slate-400 mb-1">Gas Strategy</label>
                          <select
                            className="w-full bg-slate-950 border border-slate-600 rounded px-3 py-2 text-sm text-slate-300"
                            disabled
                          >
                            <option>Auto (Recommended)</option>
                            <option>Fast</option>
                            <option>Standard</option>
                            <option>Slow</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs text-slate-400 mb-1">Constructor Arguments</label>
                          <textarea
                            className="w-full bg-slate-950 border border-slate-600 rounded px-3 py-2 text-sm text-slate-300 h-20"
                            placeholder="Enter constructor arguments..."
                            disabled
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {deploymentStatus === "deploying" && (
                    <div className="space-y-4">
                      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                          <span className="text-sm font-medium text-white">Deploying Contract...</span>
                        </div>
                        <div className="space-y-2 text-xs text-slate-300">
                          <div>✓ Compiling Python to EVM bytecode</div>
                          <div>✓ Optimizing gas usage</div>
                          <div>✓ Estimating deployment cost</div>
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 border border-blue-500 border-t-transparent rounded-full animate-spin" />
                            Broadcasting transaction...
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {deploymentStatus === "success" && (
                    <div className="space-y-4">
                      <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full" />
                          </div>
                          <span className="text-sm font-medium text-white">Deployment Successful!</span>
                        </div>
                        <div className="space-y-2 text-xs text-slate-300">
                          <div>
                            Contract Address:{" "}
                            <span className="text-green-400 font-mono">0x742d35Cc6634C0532925a3b8D</span>
                          </div>
                          <div>
                            Transaction Hash: <span className="text-blue-400 font-mono">0x8f2a7b9c...</span>
                          </div>
                          <div>
                            Gas Used: <span className="text-yellow-400">1,234,567</span>
                          </div>
                          <div>
                            Network: <span className="text-purple-400">Fuji Testnet</span>
                          </div>
                        </div>
                        <Button size="sm" className="w-full mt-3 bg-transparent" variant="outline">
                          View on Explorer
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "debugger" && (
                <div>
                  <h3 className="text-white font-semibold mb-3">Debugger</h3>
                  <div className="text-sm text-slate-400">
                    <p>Debug tools will appear here when running transactions.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Terminal */}
        <div className="h-32 bg-slate-950 border-t border-slate-700 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Terminal className="w-4 h-4 text-slate-400" />
            <span className="text-sm text-slate-400">Terminal</span>
          </div>
          <div className="text-xs text-slate-300 font-mono">
            PyVax IDE v1.0.0 - Ready for development
            <br />
            Type 'help' for available commands
          </div>
        </div>
      </div>

      <PremiumPricingPopup isOpen={showPremiumPopup} onClose={() => setShowPremiumPopup(false)} feature="deployment" />
    </div>
  )
}
