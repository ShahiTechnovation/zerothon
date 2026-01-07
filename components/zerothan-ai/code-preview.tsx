'use client'

import { useState } from 'react'
import { Copy, Download, Check, FileCode, Play, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface FileContent {
  name: string
  content: string
  language: string
}

interface CodePreviewProps {
  files: FileContent[]
  projectName: string
  onDownload: () => void
}

export function CodePreview({ files, projectName, onDownload }: CodePreviewProps) {
  const [selectedFile, setSelectedFile] = useState(files[0]?.name || '')
  const [copiedFile, setCopiedFile] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'code' | 'preview'>('code')

  const currentFile = files.find(f => f.name === selectedFile)

  const copyToClipboard = (content: string, fileName: string) => {
    navigator.clipboard.writeText(content)
    setCopiedFile(fileName)
    setTimeout(() => setCopiedFile(null), 2000)
  }

  const getLanguageColor = (language: string) => {
    const colors: Record<string, string> = {
      solidity: 'text-purple-400',
      typescript: 'text-blue-400',
      javascript: 'text-yellow-400',
      python: 'text-green-400',
      json: 'text-orange-400'
    }
    return colors[language] || 'text-slate-400'
  }

  const getFileIcon = (fileName: string) => {
    if (fileName.endsWith('.sol')) return '📜'
    if (fileName.endsWith('.tsx') || fileName.endsWith('.ts')) return '⚛️'
    if (fileName.endsWith('.js')) return '📦'
    if (fileName.endsWith('.py')) return '🐍'
    if (fileName.endsWith('.json')) return '📋'
    return '📄'
  }

  return (
    <div className="flex flex-col min-h-[600px] max-h-[800px] bg-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-700/50">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
            <FileCode className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">{projectName}</h2>
            <p className="text-xs text-slate-400">{files.length} files generated</p>
          </div>
        </div>
        <Button
          onClick={onDownload}
          className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
        >
          <Download className="w-4 h-4 mr-2" />
          Download Project
        </Button>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'code' | 'preview')} className="flex-1 flex flex-col min-h-0 overflow-hidden">
        <div className="px-6 pt-4 flex-shrink-0">
          <TabsList className="bg-slate-800 border border-slate-700">
            <TabsTrigger value="code" className="data-[state=active]:bg-slate-700">
              <FileCode className="w-4 h-4 mr-2" />
              Code
            </TabsTrigger>
            <TabsTrigger value="preview" className="data-[state=active]:bg-slate-700">
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="code" className="flex-1 flex gap-4 px-6 pb-6 mt-4 overflow-hidden">
          {/* File Explorer */}
          <div className="w-64 bg-slate-800/50 rounded-lg border border-slate-700/50 p-4 overflow-y-auto flex-shrink-0">
            <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
              <FileCode className="w-4 h-4" />
              Files
            </h3>
            <div className="space-y-1">
              {files.map((file) => (
                <button
                  key={file.name}
                  onClick={() => setSelectedFile(file.name)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                    selectedFile === file.name
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                      : 'text-slate-300 hover:bg-slate-700/50'
                  }`}
                >
                  <span className="mr-2">{getFileIcon(file.name)}</span>
                  {file.name}
                </button>
              ))}
            </div>
          </div>

          {/* Code Editor */}
          <div className="flex-1 flex flex-col bg-slate-800/50 rounded-lg border border-slate-700/50 min-w-0 overflow-hidden">
            {/* Editor Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700/50 flex-shrink-0">
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-sm font-mono text-white truncate">{selectedFile}</span>
                {currentFile && (
                  <span className={`text-xs font-mono ${getLanguageColor(currentFile.language)} flex-shrink-0`}>
                    {currentFile.language}
                  </span>
                )}
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => currentFile && copyToClipboard(currentFile.content, currentFile.name)}
                  className="h-8 text-slate-300 hover:text-white"
                >
                  {copiedFile === currentFile?.name ? (
                    <>
                      <Check className="w-3 h-3 mr-1" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3 mr-1" />
                      Copy
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Code Content */}
            <div className="flex-1 overflow-auto p-4 min-h-0">
              <pre className="text-sm font-mono text-slate-300 leading-relaxed whitespace-pre-wrap break-words max-w-full">
                <code className="block">{currentFile?.content}</code>
              </pre>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="preview" className="flex-1 px-6 pb-6 mt-4">
          <div className="h-full bg-slate-800/50 rounded-lg border border-slate-700/50 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mx-auto mb-4">
                <Play className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Live Preview Coming Soon</h3>
              <p className="text-slate-400 max-w-md">
                Deploy your smart contract to a testnet and interact with it in real-time.
              </p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
