'use client'

import { useEffect, useRef } from 'react'
import Editor, { Monaco } from '@monaco-editor/react'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useIDEStore, EditorTab } from '@/lib/stores/ideStore'

interface EditorPaneProps {
  onContentChange: (tabId: string, content: string) => void
  onSave: (tabId: string, content: string) => void
}

export function EditorPane({ onContentChange, onSave }: EditorPaneProps) {
  const editorRef = useRef<any>(null)
  const monacoRef = useRef<Monaco | null>(null)
  
  const editorTabs = useIDEStore(state => state.editorTabs)
  const activeTabId = useIDEStore(state => state.activeTabId)
  const setActiveTab = useIDEStore(state => state.setActiveTab)
  const removeEditorTab = useIDEStore(state => state.removeEditorTab)
  const markTabDirty = useIDEStore(state => state.markTabDirty)

  const activeTab = editorTabs.find(tab => tab.id === activeTabId)

  const handleEditorDidMount = (editor: any, monaco: Monaco) => {
    editorRef.current = editor
    monacoRef.current = monaco

    // Configure Monaco
    monaco.editor.defineTheme('pyvax-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [],
      colors: {
        'editor.background': '#1e1e1e',
        'editor.foreground': '#d4d4d4',
        'editorLineNumber.foreground': '#858585',
        'editorLineNumber.activeForeground': '#c6c6c6',
        'editor.selectionBackground': '#264f78',
        'editor.inactiveSelectionBackground': '#3a3d41'
      }
    })
    monaco.editor.setTheme('pyvax-dark')

    // Add keyboard shortcuts
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      if (activeTab) {
        onSave(activeTab.id, editor.getValue())
      }
    })
  }

  const handleEditorChange = (value: string | undefined) => {
    if (activeTab && value !== undefined) {
      onContentChange(activeTab.id, value)
      markTabDirty(activeTab.id, value !== activeTab.content)
    }
  }

  const getLanguageForMonaco = (language: string): string => {
    const languageMap: Record<string, string> = {
      'python': 'python',
      'solidity': 'sol',
      'javascript': 'javascript',
      'typescript': 'typescript',
      'json': 'json'
    }
    return languageMap[language] || 'plaintext'
  }

  return (
    <div className="h-full flex flex-col bg-[#1e1e1e]">
      {/* Tab Bar */}
      {editorTabs.length > 0 && (
        <div className="flex items-center bg-[#252526] border-b border-[#3e3e42] overflow-x-auto">
          {editorTabs.map(tab => (
            <div
              key={tab.id}
              className={`flex items-center gap-2 px-4 py-2 border-r border-[#3e3e42] cursor-pointer group ${
                tab.isActive ? 'bg-[#1e1e1e] text-white' : 'text-gray-400 hover:text-white'
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="text-sm whitespace-nowrap">
                {tab.name}
                {tab.isDirty && <span className="ml-1">•</span>}
              </span>
              <Button
                size="sm"
                variant="ghost"
                className="h-4 w-4 p-0 opacity-0 group-hover:opacity-100 hover:bg-[#3e3e42]"
                onClick={(e) => {
                  e.stopPropagation()
                  removeEditorTab(tab.id)
                }}
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Editor */}
      <div className="flex-1">
        {activeTab ? (
          <Editor
            height="100%"
            language={getLanguageForMonaco(activeTab.language)}
            value={activeTab.content}
            onChange={handleEditorChange}
            onMount={handleEditorDidMount}
            options={{
              minimap: { enabled: true },
              fontSize: 14,
              lineNumbers: 'on',
              roundedSelection: true,
              scrollBeyondLastLine: false,
              automaticLayout: true,
              tabSize: 4,
              wordWrap: 'on',
              formatOnPaste: true,
              formatOnType: true,
            }}
          />
        ) : (
          <div className="h-full flex items-center justify-center text-gray-500">
            <div className="text-center">
              <p className="text-lg mb-2">No file open</p>
              <p className="text-sm">Select a file from the explorer to start editing</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
