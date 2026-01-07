
import { useState } from 'react'
import { FileEntry } from '@/lib/indexeddb-filesystem'
import { Search, FileCode } from 'lucide-react'
import { Input } from '@/components/ui/input'

interface SearchSidebarProps {
    files: FileEntry[]
    onSelectFile: (file: FileEntry) => void
}

export function SearchSidebar({ files, onSelectFile }: SearchSidebarProps) {
    const [query, setQuery] = useState('')

    const results = files.filter(f =>
        f.name.toLowerCase().includes(query.toLowerCase()) ||
        f.content.toLowerCase().includes(query.toLowerCase())
    )

    return (
        <div className="h-full flex flex-col w-52 bg-[#1e1e1e] border-r border-[#3e3e42]">
            <div className="p-3 border-b border-[#3e3e42]">
                <span className="text-[10px] font-bold uppercase text-gray-400 tracking-wider">Search</span>
            </div>
            <div className="p-2">
                <div className="relative">
                    <Search className="absolute left-2 top-2 h-3.5 w-3.5 text-gray-500" />
                    <Input
                        className="h-7 text-xs bg-[#252526] border-[#3e3e42] pl-7"
                        placeholder="Search files..."
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                    />
                </div>
            </div>
            <div className="flex-1 overflow-y-auto p-2">
                {query && results.map(file => (
                    <div
                        key={file.path}
                        onClick={() => onSelectFile(file)}
                        className="flex items-center gap-2 p-2 hover:bg-[#2a2d2e] rounded cursor-pointer group"
                    >
                        <FileCode className="w-4 h-4 text-blue-400" />
                        <div className="flex flex-col overflow-hidden">
                            <span className="text-xs text-gray-300 truncate">{file.name}</span>
                            <span className="text-[10px] text-gray-500 truncate">{file.path}</span>
                        </div>
                    </div>
                ))}
                {query && results.length === 0 && (
                    <div className="text-center text-xs text-gray-500 mt-4">No results found</div>
                )}
            </div>
        </div>
    )
}
