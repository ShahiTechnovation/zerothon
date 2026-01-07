'use client'

import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels'
import { FileExplorer } from './FileExplorer'
import { EditorPane } from './EditorPane'
import { CompilerPanel } from './CompilerPanel'
import { Terminal } from './Terminal'
import { Code2, Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useIDEStore } from '@/lib/stores/ideStore'
import { FileEntry } from '@/lib/storage/database'

interface IDELayoutProps {
  files: FileEntry[]
  onFileSelect: (file: FileEntry) => void
  onFileCreate: (path: string, language: string) => void
  onFileDelete: (path: string) => void
  onContentChange: (tabId: string, content: string) => void
  onSave: (tabId: string, content: string) => void
  onCompile: () => void
  onDeploy: (contractIndex: number) => void
  onClearTerminal: () => void
}

export function IDELayout({
  files,
  onFileSelect,
  onFileCreate,
  onFileDelete,
  onContentChange,
  onSave,
  onCompile,
  onDeploy,
  onClearTerminal
}: IDELayoutProps) {
  const leftSidebarOpen = useIDEStore(state => state.leftSidebarOpen)
  const rightSidebarOpen = useIDEStore(state => state.rightSidebarOpen)
  const terminalOpen = useIDEStore(state => state.terminalOpen)
  const toggleLeftSidebar = useIDEStore(state => state.toggleLeftSidebar)
  const toggleRightSidebar = useIDEStore(state => state.toggleRightSidebar)
  const toggleTerminal = useIDEStore(state => state.toggleTerminal)

  return (
    <div className="h-screen flex flex-col bg-[#1e1e1e]">
      {/* Header */}
      <header className="h-12 bg-[#323233] border-b border-[#3e3e42] flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Code2 className="w-6 h-6 text-blue-400" />
            <span className="text-white font-bold text-lg">PyVax IDE</span>
          </div>
          <span className="text-xs text-gray-400">Python to EVM Smart Contract Development</span>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={toggleLeftSidebar}
            className="text-gray-400 hover:text-white"
          >
            <Menu className="w-4 h-4" />
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <PanelGroup direction="horizontal">
          {/* Left Sidebar - File Explorer */}
          {leftSidebarOpen && (
            <>
              <Panel defaultSize={20} minSize={15} maxSize={30}>
                <FileExplorer
                  files={files}
                  onFileSelect={onFileSelect}
                  onFileCreate={onFileCreate}
                  onFileDelete={onFileDelete}
                />
              </Panel>
              <PanelResizeHandle className="w-1 bg-[#3e3e42] hover:bg-[#007acc] transition-colors" />
            </>
          )}

          {/* Center - Editor & Terminal */}
          <Panel defaultSize={leftSidebarOpen && rightSidebarOpen ? 55 : 70} minSize={30}>
            <PanelGroup direction="vertical">
              <Panel defaultSize={terminalOpen ? 70 : 100} minSize={40}>
                <EditorPane
                  onContentChange={onContentChange}
                  onSave={onSave}
                />
              </Panel>

              {terminalOpen && (
                <>
                  <PanelResizeHandle className="h-1 bg-[#3e3e42] hover:bg-[#007acc] transition-colors" />
                  <Panel defaultSize={30} minSize={20} maxSize={50}>
                    <Terminal onClear={onClearTerminal} />
                  </Panel>
                </>
              )}
            </PanelGroup>
          </Panel>

          {/* Right Sidebar - Compiler & Deploy */}
          {rightSidebarOpen && (
            <>
              <PanelResizeHandle className="w-1 bg-[#3e3e42] hover:bg-[#007acc] transition-colors" />
              <Panel defaultSize={25} minSize={20} maxSize={35}>
                <CompilerPanel
                  onCompile={onCompile}
                  onDeploy={onDeploy}
                />
              </Panel>
            </>
          )}
        </PanelGroup>
      </div>

      {/* Status Bar */}
      <footer className="h-6 bg-[#007acc] text-white flex items-center justify-between px-4 text-xs">
        <div className="flex items-center gap-4">
          <span>PyVax IDE v1.0.0</span>
          <span>•</span>
          <span>{files.length} files</span>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={toggleTerminal} className="hover:underline">
            {terminalOpen ? 'Hide' : 'Show'} Terminal
          </button>
          <button onClick={toggleRightSidebar} className="hover:underline">
            {rightSidebarOpen ? 'Hide' : 'Show'} Compiler
          </button>
        </div>
      </footer>
    </div>
  )
}
