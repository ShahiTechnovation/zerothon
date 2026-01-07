'use client'

import { Logo } from '@/components/ui/logo'
import { Settings, Play, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function MinimalHeader() {
  return (
    <div className="h-14 border-b bg-white flex items-center justify-between px-4">
      {/* Left: Logo */}
      <div className="flex items-center gap-3">
        <Logo size={32} showText={false} />
        <div>
          <h1 className="text-sm font-semibold text-gray-900">zerothon AI</h1>
          <p className="text-xs text-gray-500">Python Smart Contract Generator</p>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
        >
          <Play className="w-4 h-4 mr-1.5" />
          Compile
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
        >
          <Download className="w-4 h-4 mr-1.5" />
          Export
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
        >
          <Settings className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}
