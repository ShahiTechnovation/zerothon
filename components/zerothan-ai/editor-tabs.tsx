
import { X, FileCode, FileText } from 'lucide-react'
import { cn } from '@/lib/utils'
import { FileEntry } from '@/lib/indexeddb-filesystem'

interface EditorTabsProps {
    files: FileEntry[]
    activeFile: FileEntry | null
    onSelect: (file: FileEntry) => void
    onClose: (fileId: number | string) => void
}

export function EditorTabs({ files, activeFile, onSelect, onClose }: EditorTabsProps) {
    if (files.length === 0) return null

    const getFileIcon = (language: string) => {
        switch (language) {
            case 'python':
                return <FileCode className="w-3 h-3 text-blue-400" />
            case 'solidity':
                return <FileCode className="w-3 h-3 text-purple-400" />
            case 'javascript':
            case 'typescript':
                return <FileCode className="w-3 h-3 text-yellow-400" />
            case 'json':
                return <FileText className="w-3 h-3 text-green-400" />
            default:
                return <FileText className="w-3 h-3 text-gray-400" />
        }
    }

    return (
        <div className="flex h-8 bg-[#18181b] border-b border-[#27272a] overflow-x-auto scrollbar-hide">
            {files.map((file) => {
                const isActive = activeFile?.path === file.path
                return (
                    <div
                        key={file.path}
                        onClick={() => onSelect(file)}
                        className={cn(
                            "group flex items-center gap-2 px-3 py-1 min-w-[100px] max-w-[180px] text-xs cursor-pointer border-r border-[#27272a] select-none transition-colors",
                            isActive
                                ? "bg-[#1e1e1e] text-white border-t-2 border-t-blue-500"
                                : "bg-[#131316] text-gray-400 hover:bg-[#1e1e1e] hover:text-gray-300 border-t-2 border-t-transparent"
                        )}
                    >
                        {getFileIcon(file.language)}
                        <span className="truncate flex-1">{file.name}</span>
                        <button
                            onClick={(e) => {
                                e.stopPropagation()
                                // Use path as ID if no numeric ID
                                onClose(file.id || file.path)
                            }}
                            className={cn(
                                "p-0.5 rounded-md opacity-0 group-hover:opacity-100 hover:bg-[#2a2d2e] transition-all",
                                isActive && "opacity-100"
                            )}
                        >
                            <X className="w-3 h-3" />
                        </button>
                    </div>
                )
            })}
        </div>
    )
}
