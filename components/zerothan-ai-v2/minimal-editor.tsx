'use client'

import { useState } from 'react'
import Editor from '@monaco-editor/react'
import { Copy, Check, FileCode } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface MinimalEditorProps {
  code: string
  onChange: (code: string) => void
  isGenerating: boolean
}

export function MinimalEditor({ code, onChange, isGenerating }: MinimalEditorProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Toolbar */}
      <div className="h-10 border-b flex items-center justify-between px-3 bg-gray-50">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <FileCode className="w-4 h-4" />
          <span className="font-mono">contract.py</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCopy}
          disabled={!code}
          className="h-7 text-xs"
        >
          {copied ? (
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

      {/* Editor */}
      <div className="flex-1">
        {!code && !isGenerating ? (
          <div className="flex items-center justify-center h-full text-gray-400">
            <div className="text-center">
              <FileCode className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p className="text-sm">Generated code will appear here</p>
            </div>
          </div>
        ) : (
          <Editor
            height="100%"
            defaultLanguage="python"
            value={code}
            onChange={(value) => onChange(value || '')}
            theme="light"
            options={{
              minimap: { enabled: false },
              fontSize: 13,
              lineNumbers: 'on',
              scrollBeyondLastLine: false,
              automaticLayout: true,
              tabSize: 2,
              wordWrap: 'on',
              readOnly: isGenerating,
            }}
          />
        )}
      </div>
    </div>
  )
}
