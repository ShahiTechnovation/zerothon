'use client'

import { useState } from 'react'
import { Play, Download, Copy, CheckCircle, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useIDEStore } from '@/lib/stores/ideStore'

interface CompilerPanelProps {
  onCompile: () => void
  onDeploy: (contractIndex: number) => void
}

export function CompilerPanel({ onCompile, onDeploy }: CompilerPanelProps) {
  const [selectedContract, setSelectedContract] = useState(0)
  const isCompiling = useIDEStore(state => state.isCompiling)
  const compilationOutput = useIDEStore(state => state.compilationOutput)
  const activeTab = useIDEStore(state => state.editorTabs.find(t => t.isActive))

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const downloadABI = (contract: any) => {
    const blob = new Blob([JSON.stringify(contract.abi, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${contract.name}_ABI.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="h-full bg-[#252526] text-white flex flex-col">
      {/* Header */}
      <div className="p-3 border-b border-[#3e3e42]">
        <h3 className="text-sm font-semibold uppercase text-gray-400 mb-3">Compiler</h3>
        
        {/* Compile Button */}
        <Button
          onClick={onCompile}
          disabled={isCompiling || !activeTab}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
        >
          {isCompiling ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              Compiling...
            </>
          ) : (
            <>
              <Play className="w-4 h-4 mr-2" />
              Compile {activeTab?.language === 'python' ? 'Python' : 'Solidity'}
            </>
          )}
        </Button>

        {activeTab && (
          <div className="mt-2 text-xs text-gray-400">
            Current file: {activeTab.name}
          </div>
        )}
      </div>

      {/* Compilation Output */}
      <div className="flex-1 overflow-y-auto p-3">
        {!compilationOutput ? (
          <div className="text-center text-gray-500 mt-8">
            <p className="text-sm">No compilation yet</p>
            <p className="text-xs mt-2">Click compile to start</p>
          </div>
        ) : compilationOutput.success ? (
          <div>
            {/* Success Message */}
            <div className="flex items-center gap-2 text-green-400 mb-4">
              <CheckCircle className="w-5 h-5" />
              <span className="text-sm font-semibold">Compilation Successful</span>
            </div>

            {/* Warnings */}
            {compilationOutput.warnings && compilationOutput.warnings.length > 0 && (
              <div className="mb-4">
                <div className="flex items-center gap-2 text-yellow-400 mb-2">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-xs font-semibold">{compilationOutput.warnings.length} Warnings</span>
                </div>
                <div className="text-xs text-gray-400 max-h-32 overflow-y-auto">
                  {compilationOutput.warnings.map((warning: any, i: number) => (
                    <div key={i} className="mb-1">{warning.message || warning.formattedMessage}</div>
                  ))}
                </div>
              </div>
            )}

            {/* Contracts */}
            {compilationOutput.contracts && compilationOutput.contracts.length > 0 && (
              <Tabs defaultValue="abi" className="w-full">
                <TabsList className="w-full bg-[#1e1e1e]">
                  <TabsTrigger value="abi" className="flex-1">ABI</TabsTrigger>
                  <TabsTrigger value="bytecode" className="flex-1">Bytecode</TabsTrigger>
                  <TabsTrigger value="deploy" className="flex-1">Deploy</TabsTrigger>
                </TabsList>

                <TabsContent value="abi" className="mt-3">
                  <div className="space-y-2">
                    {compilationOutput.contracts.length > 1 && (
                      <select
                        className="w-full bg-[#1e1e1e] border border-[#3e3e42] rounded px-2 py-1 text-sm"
                        value={selectedContract}
                        onChange={(e) => setSelectedContract(parseInt(e.target.value))}
                      >
                        {compilationOutput.contracts.map((contract: any, i: number) => (
                          <option key={i} value={i}>{contract.name}</option>
                        ))}
                      </select>
                    )}
                    
                    <div className="relative">
                      <pre className="bg-[#1e1e1e] p-3 rounded text-xs overflow-x-auto max-h-64">
                        {JSON.stringify(compilationOutput.contracts[selectedContract].abi, null, 2)}
                      </pre>
                      <div className="absolute top-2 right-2 flex gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-6 w-6 p-0 bg-[#252526] hover:bg-[#3e3e42]"
                          onClick={() => copyToClipboard(JSON.stringify(compilationOutput.contracts[selectedContract].abi))}
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-6 w-6 p-0 bg-[#252526] hover:bg-[#3e3e42]"
                          onClick={() => downloadABI(compilationOutput.contracts[selectedContract])}
                        >
                          <Download className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="bytecode" className="mt-3">
                  <div className="relative">
                    <pre className="bg-[#1e1e1e] p-3 rounded text-xs overflow-x-auto max-h-64 break-all">
                      {compilationOutput.contracts[selectedContract].bytecode}
                    </pre>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="absolute top-2 right-2 h-6 w-6 p-0 bg-[#252526] hover:bg-[#3e3e42]"
                      onClick={() => copyToClipboard(compilationOutput.contracts[selectedContract].bytecode)}
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="deploy" className="mt-3">
                  <div className="space-y-3">
                    <p className="text-xs text-gray-400">
                      Deploy {compilationOutput.contracts[selectedContract].name} to blockchain
                    </p>
                    <Button
                      onClick={() => onDeploy(selectedContract)}
                      className="w-full bg-green-600 hover:bg-green-700"
                    >
                      Deploy Contract
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            )}
          </div>
        ) : (
          <div>
            {/* Error Message */}
            <div className="flex items-center gap-2 text-red-400 mb-4">
              <AlertCircle className="w-5 h-5" />
              <span className="text-sm font-semibold">Compilation Failed</span>
            </div>

            {/* Errors */}
            {compilationOutput.errors && compilationOutput.errors.length > 0 && (
              <div className="space-y-2">
                {compilationOutput.errors.map((error: any, i: number) => (
                  <div key={i} className="bg-red-900/20 border border-red-900/50 rounded p-2">
                    <div className="text-xs text-red-400">
                      {error.message || error.formattedMessage || error}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
