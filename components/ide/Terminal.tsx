'use client'

import { useEffect, useRef } from 'react'
import { Terminal as TerminalIcon, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useIDEStore } from '@/lib/stores/ideStore'
import { TerminalMessage } from '@/lib/plugins/TerminalPlugin'

interface TerminalProps {
  onClear?: () => void
}

export function Terminal({ onClear }: TerminalProps) {
  const terminalRef = useRef<HTMLDivElement>(null)
  const terminalMessages = useIDEStore(state => state.terminalMessages)

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [terminalMessages])

  const getMessageColor = (type: TerminalMessage['type']): string => {
    switch (type) {
      case 'error':
        return 'text-red-400'
      case 'warning':
        return 'text-yellow-400'
      case 'success':
        return 'text-green-400'
      case 'command':
        return 'text-blue-400'
      default:
        return 'text-gray-300'
    }
  }

  const getMessagePrefix = (type: TerminalMessage['type']): string => {
    switch (type) {
      case 'error':
        return '[ERROR]'
      case 'warning':
        return '[WARN]'
      case 'success':
        return '[SUCCESS]'
      case 'command':
        return '>'
      default:
        return '[INFO]'
    }
  }

  const formatTimestamp = (timestamp: number): string => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString('en-US', { hour12: false })
  }

  return (
    <div className="h-full bg-[#1e1e1e] text-white flex flex-col">
      {/* Header */}
      <div className="p-2 border-b border-[#3e3e42] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TerminalIcon className="w-4 h-4" />
          <span className="text-sm font-semibold uppercase text-gray-400">Terminal</span>
        </div>
        <Button
          size="sm"
          variant="ghost"
          className="h-6 w-6 p-0 hover:bg-[#3e3e42]"
          onClick={onClear}
        >
          <Trash2 className="w-3 h-3" />
        </Button>
      </div>

      {/* Terminal Output */}
      <div
        ref={terminalRef}
        className="flex-1 overflow-y-auto p-3 font-mono text-sm"
      >
        {terminalMessages.length === 0 ? (
          <div className="text-gray-500 text-center mt-8">
            Terminal output will appear here
          </div>
        ) : (
          terminalMessages.map((msg) => (
            <div key={msg.id} className="mb-1 flex gap-2">
              <span className="text-gray-600 text-xs">{formatTimestamp(msg.timestamp)}</span>
              <span className={`${getMessageColor(msg.type)} font-semibold`}>
                {getMessagePrefix(msg.type)}
              </span>
              <span className={getMessageColor(msg.type)}>{msg.message}</span>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
