'use client'

import { useState, useEffect } from 'react'
import { FileCode, FolderOpen, Folder, Plus, Trash2, Edit2, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useIDEStore } from '@/lib/stores/ideStore'
import { FileEntry } from '@/lib/storage/database'

interface FileExplorerProps {
  files: FileEntry[]
  onFileSelect: (file: FileEntry) => void
  onFileCreate: (path: string, language: string) => void
  onFileDelete: (path: string) => void
}

export function FileExplorer({ files, onFileSelect, onFileCreate, onFileDelete }: FileExplorerProps) {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['contracts']))
  const selectedFile = useIDEStore(state => state.selectedFile)

  const getFileIcon = (language: string) => {
    switch (language) {
      case 'python':
        return <FileCode className="w-4 h-4 text-blue-400" />
      case 'solidity':
        return <FileCode className="w-4 h-4 text-purple-400" />
      case 'javascript':
      case 'typescript':
        return <FileCode className="w-4 h-4 text-yellow-400" />
      case 'json':
        return <FileText className="w-4 h-4 text-green-400" />
      default:
        return <FileText className="w-4 h-4 text-gray-400" />
    }
  }

  const organizeFiles = () => {
    const tree: Record<string, FileEntry[]> = {}
    
    files.forEach(file => {
      const parts = file.path.split('/')
      const folder = parts.length > 1 ? parts[0] : 'root'
      
      if (!tree[folder]) {
        tree[folder] = []
      }
      tree[folder].push(file)
    })
    
    return tree
  }

  const toggleFolder = (folder: string) => {
    const newExpanded = new Set(expandedFolders)
    if (newExpanded.has(folder)) {
      newExpanded.delete(folder)
    } else {
      newExpanded.add(folder)
    }
    setExpandedFolders(newExpanded)
  }

  const fileTree = organizeFiles()

  return (
    <div className="h-full bg-[#252526] text-white flex flex-col">
      {/* Header */}
      <div className="p-3 border-b border-[#3e3e42] flex items-center justify-between">
        <span className="text-sm font-semibold uppercase text-gray-400">Explorer</span>
        <div className="flex gap-1">
          <Button
            size="sm"
            variant="ghost"
            className="h-6 w-6 p-0 hover:bg-[#3e3e42]"
            onClick={() => onFileCreate('contracts/NewContract.sol', 'solidity')}
          >
            <Plus className="w-3 h-3" />
          </Button>
        </div>
      </div>

      {/* File Tree */}
      <div className="flex-1 overflow-y-auto p-2">
        {Object.entries(fileTree).map(([folder, folderFiles]) => (
          <div key={folder} className="mb-2">
            {/* Folder */}
            <button
              onClick={() => toggleFolder(folder)}
              className="flex items-center gap-2 w-full px-2 py-1 hover:bg-[#2a2d2e] rounded text-sm"
            >
              {expandedFolders.has(folder) ? (
                <FolderOpen className="w-4 h-4 text-blue-400" />
              ) : (
                <Folder className="w-4 h-4 text-blue-400" />
              )}
              <span>{folder}</span>
            </button>

            {/* Files in folder */}
            {expandedFolders.has(folder) && (
              <div className="ml-4 mt-1">
                {folderFiles.map(file => (
                  <div
                    key={file.id}
                    className={`flex items-center justify-between gap-2 px-2 py-1 hover:bg-[#2a2d2e] rounded cursor-pointer group ${
                      selectedFile?.id === file.id ? 'bg-[#37373d]' : ''
                    }`}
                    onClick={() => onFileSelect(file)}
                  >
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      {getFileIcon(file.language)}
                      <span className="text-sm truncate">{file.name}</span>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-5 w-5 p-0 opacity-0 group-hover:opacity-100 hover:bg-[#3e3e42]"
                      onClick={(e) => {
                        e.stopPropagation()
                        onFileDelete(file.path)
                      }}
                    >
                      <Trash2 className="w-3 h-3 text-red-400" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="p-2 border-t border-[#3e3e42] text-xs text-gray-500">
        {files.length} files
      </div>
    </div>
  )
}
