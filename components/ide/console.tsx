"use client"

import { useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Trash2, AlertCircle, CheckCircle, AlertTriangle, Info } from "lucide-react"
import type { ConsoleLog } from "@/lib/types"

interface ConsoleProps {
  logs: ConsoleLog[]
  onClear: () => void
}

export function Console({ logs, onClear }: ConsoleProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [logs])

  const getIcon = (type: ConsoleLog["type"]) => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case "error":
        return <AlertCircle className="w-4 h-4 text-red-500" />
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />
      default:
        return <Info className="w-4 h-4 text-blue-500" />
    }
  }

  return (
    <div className="flex flex-col h-full bg-card border-t border-border">
      <div className="flex items-center justify-between p-3 border-b border-border">
        <h2 className="text-sm font-semibold">Console</h2>
        <Button onClick={onClear} variant="ghost" size="sm" className="h-6 w-6 p-0">
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 space-y-1 font-mono text-xs">
        {logs.length === 0 ? (
          <p className="text-muted-foreground">Ready...</p>
        ) : (
          logs.map((log) => (
            <div key={log.id} className="flex items-start gap-2">
              {getIcon(log.type)}
              <span className="text-muted-foreground">{log.message}</span>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
