
import { useState } from 'react'
import { FileCode, FolderOpen, Folder, Plus, Trash2, FileText, ChevronRight, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuTrigger,
} from "@/components/ui/context-menu"

import { FileEntry } from '@/lib/indexeddb-filesystem'

interface FileExplorerSidebarProps {
    files: FileEntry[]
    selectedFile: FileEntry | null
    onSelectFile: (file: FileEntry) => void
    onCreateFile: (name: string, language: 'python' | 'solidity') => void
    onDeleteFile: (path: string) => void
}

export function FileExplorerSidebar({
    files,
    selectedFile,
    onSelectFile,
    onCreateFile,
    onDeleteFile
}: FileExplorerSidebarProps) {
    const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['contracts']))
    const [isCreating, setIsCreating] = useState(false)
    const [newFileName, setNewFileName] = useState('')
    const [newFileType, setNewFileType] = useState<'python' | 'solidity'>('python')

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

        // Ensure contracts folder exists
        if (!tree['contracts']) tree['contracts'] = []

        files.forEach(file => {
            // Very simple folder logic: contracts/Feature.sol -> folder: contracts
            // If root file -> folder: root
            const parts = file.path.split('/').filter(p => p !== '')
            // Assume structure /contracts/Name.sol -> parts: [contracts, Name.sol]

            let folder = 'root'
            if (parts.length > 1) {
                folder = parts[0]
            }

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

    const handleCreateSubmit = () => {
        if (!newFileName) return
        const ext = newFileType === 'python' ? '.py' : '.sol'
        const finalName = newFileName.endsWith(ext) ? newFileName : newFileName + ext
        onCreateFile(finalName, newFileType)
        setIsCreating(false)
        setNewFileName('')
    }

    const fileTree = organizeFiles()

    return (
        <div className="w-52 bg-[#1e1e1e] border-r border-[#3e3e42] flex flex-col h-full select-none">
            {/* Header */}
            <div className="p-2 border-b border-[#3e3e42] flex items-center justify-between bg-[#252526]">
                <span className="text-[10px] font-bold uppercase text-gray-400 tracking-wider">Explorer</span>
                <div className="flex gap-1">
                    <Button
                        size="sm"
                        variant="ghost"
                        title="New File"
                        className="h-5 w-5 p-0 hover:bg-[#3e3e42] text-gray-400 hover:text-white"
                        onClick={() => setIsCreating(true)}
                    >
                        <Plus className="w-3.5 h-3.5" />
                    </Button>
                </div>
            </div>

            {/* Creation Helper */}
            {isCreating && (
                <div className="p-2 bg-[#2a2d2e] border-b border-[#3e3e42]">
                    <div className="flex gap-1.5 mb-2">
                        <Button
                            size="sm"
                            variant={newFileType === 'python' ? 'secondary' : 'ghost'}
                            className="h-5 text-[10px] px-2"
                            onClick={() => setNewFileType('python')}
                        >
                            PY
                        </Button>
                        <Button
                            size="sm"
                            variant={newFileType === 'solidity' ? 'secondary' : 'ghost'}
                            className="h-5 text-[10px] px-2"
                            onClick={() => setNewFileType('solidity')}
                        >
                            SOL
                        </Button>
                    </div>
                    <div className="flex gap-1.5">
                        <Input
                            autoFocus
                            placeholder="Name..."
                            value={newFileName}
                            onChange={e => setNewFileName(e.target.value)}
                            className="h-6 text-[11px] bg-[#1e1e1e] border-[#3e3e42]"
                            onKeyDown={e => e.key === 'Enter' && handleCreateSubmit()}
                        />
                        <Button size="sm" className="h-6 text-[10px] px-2" onClick={handleCreateSubmit}>OK</Button>
                    </div>
                </div>
            )}

            {/* File Tree */}
            <div className="flex-1 overflow-y-auto p-1">
                {Object.entries(fileTree).map(([folder, folderFiles]) => (
                    <div key={folder} className="mb-0.5">
                        {/* Folder Header */}
                        <div
                            onClick={() => toggleFolder(folder)}
                            className="flex items-center gap-1 w-full px-2 py-0.5 hover:bg-[#2a2d2e] cursor-pointer text-[#cccccc]"
                        >
                            {expandedFolders.has(folder) ? (
                                <ChevronDown className="w-3 h-3 text-gray-500" />
                            ) : (
                                <ChevronRight className="w-3 h-3 text-gray-500" />
                            )}
                            {expandedFolders.has(folder) ? (
                                <FolderOpen className="w-3.5 h-3.5 text-blue-400" />
                            ) : (
                                <Folder className="w-3.5 h-3.5 text-blue-400" />
                            )}
                            <span className="text-xs font-medium ml-1">{folder}</span>
                        </div>

                        {/* Files */}
                        {expandedFolders.has(folder) && (
                            <div className="ml-3 pl-2 border-l border-[#3e3e42]/50">
                                {folderFiles.map(file => (
                                    <ContextMenu key={file.id || file.path}>
                                        <ContextMenuTrigger>
                                            <div
                                                className={`flex items-center gap-1.5 px-2 py-1 rounded-sm cursor-pointer border-l-2 ${selectedFile?.path === file.path
                                                    ? 'bg-[#37373d] border-blue-500 text-white'
                                                    : 'border-transparent text-[#cccccc] hover:bg-[#2a2d2e]'
                                                    }`}
                                                onClick={() => onSelectFile(file)}
                                            >
                                                {getFileIcon(file.language)}
                                                <span className="text-xs truncate">{file.name}</span>
                                            </div>
                                        </ContextMenuTrigger>
                                        <ContextMenuContent className="w-40 bg-[#252526] border-[#454545] text-gray-300">
                                            <ContextMenuItem
                                                className="hover:bg-[#094771] focus:bg-[#094771] cursor-pointer text-xs"
                                                onClick={() => onDeleteFile(file.path)}
                                            >
                                                <Trash2 className="w-3 h-3 mr-2" />
                                                Delete
                                            </ContextMenuItem>
                                        </ContextMenuContent>
                                    </ContextMenu>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}
