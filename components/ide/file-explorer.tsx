"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FileText, Plus, Trash2 } from "lucide-react"
import type { FileEntry } from "@/lib/types"

interface FileExplorerProps {
  files: FileEntry[]
  currentFileId: string | null
  onSelectFile: (fileId: string) => void
  onCreateFile: (name: string, language: "python" | "solidity") => void
  onDeleteFile: (path: string) => void
}

export function FileExplorer({ files, currentFileId, onSelectFile, onCreateFile, onDeleteFile }: FileExplorerProps) {
  const [newFileName, setNewFileName] = useState("")
  const [showNewFile, setShowNewFile] = useState(false)

  const handleCreateFile = (language: "python" | "solidity") => {
    if (newFileName.trim()) {
      const ext = language === "python" ? ".py" : ".sol"
      onCreateFile(newFileName + ext, language)
      setNewFileName("")
      setShowNewFile(false)
    }
  }

  return (
    <div className="flex flex-col h-full bg-card border-r border-border">
      <div className="p-4 border-b border-border">
        <h2 className="text-sm font-semibold mb-3">Files</h2>
        <Button size="sm" variant="outline" onClick={() => setShowNewFile(!showNewFile)} className="w-full">
          <Plus className="w-4 h-4 mr-2" />
          New File
        </Button>
      </div>

      {showNewFile && (
        <div className="p-3 border-b border-border space-y-2">
          <Input
            placeholder="filename"
            value={newFileName}
            onChange={(e) => setNewFileName(e.target.value)}
            className="text-xs"
          />
          <div className="flex gap-2">
            <Button size="sm" variant="default" onClick={() => handleCreateFile("python")} className="flex-1 text-xs">
              Python
            </Button>
            <Button size="sm" variant="default" onClick={() => handleCreateFile("solidity")} className="flex-1 text-xs">
              Solidity
            </Button>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-2">
        {files.length === 0 ? (
          <p className="text-xs text-muted-foreground p-2">No files yet</p>
        ) : (
          <div className="space-y-1">
            {files.map((file) => (
              <div
                key={file.id}
                className={`flex items-center justify-between p-2 rounded cursor-pointer text-xs group ${
                  currentFileId === file.id ? "bg-primary/20" : "hover:bg-muted"
                }`}
                onClick={() => onSelectFile(file.id)}
              >
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <FileText className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate">{file.name}</span>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation()
                    onDeleteFile(file.path)
                  }}
                  className="opacity-0 group-hover:opacity-100 h-6 w-6 p-0"
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
