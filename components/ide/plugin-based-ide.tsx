"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Play, Save, FileText, Terminal, Code, Rocket, Copy, Check } from "lucide-react"
import { MonacoEditor } from "./monaco-editor"
import { FileExplorer } from "./file-explorer"
import { PYTHON_TEMPLATES, SOLIDITY_TEMPLATES } from "@/lib/templates"
import { pluginEngine } from "@/lib/plugin-engine"
import { FileManagerPlugin } from "@/lib/plugins/file-manager-plugin"
import { CompilerPlugin } from "@/lib/plugins/compiler-plugin"
import { DeployPlugin } from "@/lib/plugins/deploy-plugin"
import { ConsolePlugin } from "@/lib/plugins/console-plugin"
import type { FileEntry, DeploymentEntry, ConsoleLog } from "@/lib/types"

export function PluginBasedIDE() {
  const [files, setFiles] = useState<FileEntry[]>([])
  const [currentFileId, setCurrentFileId] = useState<string | null>(null)
  const [compilationOutput, setCompilationOutput] = useState<string>("")
  const [isCompiling, setIsCompiling] = useState(false)
  const [activeTab, setActiveTab] = useState<"compiler" | "deploy" | "console">("compiler")
  const [consoleLogs, setConsoleLogs] = useState<ConsoleLog[]>([])
  const [walletAddress, setWalletAddress] = useState<string | null>(null)
  const [selectedNetwork, setSelectedNetwork] = useState("fuji")
  const [deployedContracts, setDeployedContracts] = useState<DeploymentEntry[]>([])
  const [isDeploying, setIsDeploying] = useState(false)
  const [constructorArgs, setConstructorArgs] = useState<string>("")
  const [copied, setCopied] = useState(false)

  // Plugin instances
  const pluginsRef = useRef<{
    fileManager: FileManagerPlugin
    compiler: CompilerPlugin
    deploy: DeployPlugin
    console: ConsolePlugin
  } | null>(null)

  // Initialize plugins
  useEffect(() => {
    const initializePlugins = async () => {
      const fileManager = new FileManagerPlugin()
      const compiler = new CompilerPlugin()
      const deploy = new DeployPlugin()
      const consolePlugin = new ConsolePlugin()

      pluginsRef.current = { fileManager, compiler, deploy, console: consolePlugin }

      // Register plugins
      await pluginEngine.registerPlugin(fileManager)
      await pluginEngine.registerPlugin(compiler)
      await pluginEngine.registerPlugin(deploy)
      await pluginEngine.registerPlugin(consolePlugin)

      // Subscribe to console logs
      pluginEngine.on("console:log", async (event) => {
        setConsoleLogs((prev) => [...prev, event.payload])
      })

      // Load files
      const loadedFiles = await fileManager.getAllFiles()
      if (loadedFiles.length === 0) {
        const defaultFile: FileEntry = {
          id: "default-1",
          path: "SimpleToken.py",
          name: "SimpleToken.py",
          content: PYTHON_TEMPLATES.token.code,
          language: "python",
          lastModified: Date.now(),
        }
        setFiles([defaultFile])
        setCurrentFileId("default-1")
        await fileManager.createFile(defaultFile)
      } else {
        setFiles(loadedFiles)
        setCurrentFileId(loadedFiles[0].id)
      }
    }

    initializePlugins()
  }, [])

  const currentFile = files.find((f) => f.id === currentFileId)

  const handleCreateFile = async (name: string, language: "python" | "solidity") => {
    const newFile: FileEntry = {
      id: `file-${Date.now()}`,
      path: name,
      name,
      content: language === "python" ? PYTHON_TEMPLATES.storage.code : SOLIDITY_TEMPLATES.storage.code,
      language,
      lastModified: Date.now(),
    }
    setFiles([...files, newFile])
    setCurrentFileId(newFile.id)
    await pluginsRef.current?.fileManager.createFile(newFile)
    pluginsRef.current?.console.addLog(`Created new ${language} file: ${name}`, "success")
  }

  const handleDeleteFile = async (path: string) => {
    await pluginsRef.current?.fileManager.deleteFileByPath(path)
    setFiles(files.filter((f) => f.path !== path))
    if (currentFileId === files.find((f) => f.path === path)?.id) {
      setCurrentFileId(files[0]?.id || null)
    }
    pluginsRef.current?.console.addLog(`Deleted file: ${path}`, "success")
  }

  const handleSaveFile = async () => {
    if (currentFile) {
      const updated = { ...currentFile, lastModified: Date.now() }
      await pluginsRef.current?.fileManager.updateFile(updated)
      setFiles(files.map((f) => (f.id === currentFileId ? updated : f)))
      pluginsRef.current?.console.addLog(`Saved: ${currentFile.name}`, "success")
    }
  }

  const handleCompile = async () => {
    if (!currentFile || !pluginsRef.current) return

    setIsCompiling(true)
    setActiveTab("compiler")
    setCompilationOutput("")
    pluginsRef.current.console.addLog(`Compiling ${currentFile.name}...`)

    try {
      const result = await pluginsRef.current.compiler.compile(currentFile)
      if (result.success) {
        setCompilationOutput(result.bytecode || "Compilation successful")
      } else {
        setCompilationOutput(`Error: ${result.error}`)
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error"
      setCompilationOutput(`Error: ${message}`)
    } finally {
      setIsCompiling(false)
    }
  }

  const handleConnectWallet = async () => {
    try {
      pluginsRef.current?.console.addLog("Connecting wallet...")
      const { address, balance } = await pluginsRef.current?.deploy.connectWallet()!
      setWalletAddress(address)
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to connect wallet"
      pluginsRef.current?.console.addLog(message, "error")
    }
  }

  const handleDeploy = async () => {
    if (!currentFile || !walletAddress || !pluginsRef.current) {
      pluginsRef.current?.console.addLog("Please connect wallet first", "error")
      return
    }

    setIsDeploying(true)
    setActiveTab("console")

    try {
      const compiledContract = pluginsRef.current.compiler.getCompiledContract(currentFile.path)
      if (!compiledContract) {
        pluginsRef.current.console.addLog("Please compile first", "error")
        return
      }

      const deployment = await pluginsRef.current.deploy.deploy(
        currentFile.name.replace(/\.(py|sol)$/, ""),
        compiledContract,
        selectedNetwork,
        constructorArgs,
      )

      setDeployedContracts([deployment, ...deployedContracts])
    } catch (error) {
      const message = error instanceof Error ? error.message : "Deployment failed"
      pluginsRef.current?.console.addLog(message, "error")
    } finally {
      setIsDeploying(false)
    }
  }

  const handleCopyAddress = (address: string) => {
    navigator.clipboard.writeText(address)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex h-full bg-slate-900 text-slate-100">
      <div className="w-64 bg-slate-800 border-r border-slate-700 flex flex-col">
        <div className="p-4 border-b border-slate-700">
          <h2 className="text-white font-mono font-semibold text-sm">PyVax IDE</h2>
        </div>

        <FileExplorer
          files={files}
          currentFileId={currentFileId}
          onSelectFile={setCurrentFileId}
          onCreateFile={handleCreateFile}
          onDeleteFile={handleDeleteFile}
        />
      </div>

      <div className="flex-1 flex flex-col">
        <div className="bg-slate-800 border-b border-slate-700 p-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-slate-400" />
            <span className="text-sm text-slate-300 font-mono">{currentFile?.name || "No file selected"}</span>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" onClick={handleSaveFile} variant="outline">
              <Save className="w-4 h-4 mr-1" />
              Save
            </Button>
            <Button size="sm" onClick={handleCompile} disabled={isCompiling || !currentFile}>
              <Play className="w-4 h-4 mr-1" />
              {isCompiling ? "Compiling..." : "Compile"}
            </Button>
            <Button size="sm" onClick={handleConnectWallet} variant={walletAddress ? "default" : "outline"}>
              {walletAddress ? `${walletAddress.slice(0, 6)}...` : "Connect Wallet"}
            </Button>
            <Button
              size="sm"
              onClick={handleDeploy}
              disabled={isDeploying || !walletAddress || !currentFile}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              <Rocket className="w-4 h-4 mr-1" />
              {isDeploying ? "Deploying..." : "Deploy"}
            </Button>
          </div>
        </div>

        <div className="flex-1 flex gap-4 p-4">
          <div className="flex-1 flex flex-col bg-slate-950 rounded border border-slate-700">
            {currentFile ? (
              <MonacoEditor
                value={currentFile.content}
                language={currentFile.language}
                onChange={(content) => {
                  setFiles(files.map((f) => (f.id === currentFileId ? { ...f, content } : f)))
                }}
                onSave={handleSaveFile}
              />
            ) : (
              <div className="flex items-center justify-center h-full text-slate-400">
                <p>No file selected. Create or select a file to start coding.</p>
              </div>
            )}
          </div>

          <div className="w-96 flex flex-col gap-4">
            <div className="flex-1 bg-slate-950 rounded border border-slate-700 flex flex-col">
              <div className="p-3 border-b border-slate-700">
                <h3 className="text-sm font-semibold flex items-center gap-2">
                  <Code className="w-4 h-4" />
                  Compiler Output
                </h3>
              </div>
              <div className="flex-1 overflow-y-auto p-3">
                <pre className="text-xs text-slate-300 font-mono whitespace-pre-wrap break-words">
                  {compilationOutput || "Click Compile to see output..."}
                </pre>
              </div>
            </div>

            <div className="flex-1 bg-slate-950 rounded border border-slate-700 flex flex-col">
              <div className="p-3 border-b border-slate-700">
                <h3 className="text-sm font-semibold flex items-center gap-2">
                  <Rocket className="w-4 h-4" />
                  Deployment
                </h3>
              </div>
              <div className="flex-1 overflow-y-auto p-3 space-y-3">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Network</label>
                  <select
                    value={selectedNetwork}
                    onChange={(e) => setSelectedNetwork(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-600 rounded px-2 py-1 text-xs text-slate-300"
                  >
                    <option value="fuji">Avalanche Fuji Testnet</option>
                    <option value="mainnet">Avalanche Mainnet</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-slate-400 block mb-1">Constructor Args (JSON)</label>
                  <textarea
                    value={constructorArgs}
                    onChange={(e) => setConstructorArgs(e.target.value)}
                    placeholder='["arg1", "arg2"]'
                    className="w-full bg-slate-800 border border-slate-600 rounded px-2 py-1 text-xs text-slate-300 h-16 resize-none"
                  />
                </div>

                {deployedContracts.length > 0 && (
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Deployed Contracts</label>
                    <div className="space-y-1 max-h-32 overflow-y-auto">
                      {deployedContracts.map((contract) => (
                        <div key={contract.id} className="bg-slate-800 rounded p-2 text-xs">
                          <div className="flex items-center justify-between">
                            <span className="text-slate-300">{contract.contractName}</span>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleCopyAddress(contract.address)}
                              className="h-5 w-5 p-0"
                            >
                              {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                            </Button>
                          </div>
                          <div className="text-slate-500 truncate">{contract.address}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="h-32 bg-slate-950 border-t border-slate-700 p-3 flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-slate-400" />
              <span className="text-xs text-slate-400 font-semibold">Console</span>
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                setConsoleLogs([])
                pluginsRef.current?.console.clearLogs()
              }}
              className="h-6 text-xs"
            >
              Clear
            </Button>
          </div>
          <div className="flex-1 overflow-y-auto text-xs font-mono text-slate-300 space-y-1">
            {consoleLogs.length === 0 ? (
              <div className="text-slate-500">Ready...</div>
            ) : (
              consoleLogs.map((log) => (
                <div key={log.id} className="text-slate-300">
                  [{new Date(log.timestamp).toLocaleTimeString()}] {log.message}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
