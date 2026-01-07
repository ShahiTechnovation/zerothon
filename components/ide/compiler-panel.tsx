"use client"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Zap, AlertCircle, CheckCircle } from "lucide-react"
import type { CompilationResult, Language } from "@/lib/types"

interface CompilerPanelProps {
  language: Language
  onCompile: () => void
  compilationResult: CompilationResult | null
  isCompiling: boolean
}

export function CompilerPanel({ language, onCompile, compilationResult, isCompiling }: CompilerPanelProps) {
  return (
    <div className="flex flex-col h-full bg-card border-l border-border">
      <div className="p-4 border-b border-border">
        <h2 className="text-sm font-semibold mb-3">Compiler</h2>
        <div className="space-y-3">
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Language</label>
            <Select value={language} disabled>
              <SelectTrigger className="text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="python">Python</SelectItem>
                <SelectItem value="solidity">Solidity</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={onCompile} disabled={isCompiling} className="w-full" size="sm">
            <Zap className="w-4 h-4 mr-2" />
            {isCompiling ? "Compiling..." : "Compile Contract"}
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {compilationResult ? (
          <div className="space-y-3">
            {compilationResult.success ? (
              <div className="flex items-start gap-2 p-3 bg-green-500/10 border border-green-500/30 rounded">
                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                <div className="text-xs">
                  <p className="font-semibold text-green-500">Compiled Successfully</p>
                  <p className="text-muted-foreground mt-1">Contract: {compilationResult.contractName}</p>
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded">
                <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                <div className="text-xs">
                  <p className="font-semibold text-red-500">Compilation Error</p>
                  <p className="text-muted-foreground mt-1">{compilationResult.error}</p>
                </div>
              </div>
            )}

            {compilationResult.warnings && compilationResult.warnings.length > 0 && (
              <div className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded">
                <p className="text-xs font-semibold text-yellow-500 mb-2">Warnings</p>
                <div className="space-y-1">
                  {compilationResult.warnings.map((warning, i) => (
                    <p key={i} className="text-xs text-muted-foreground">
                      {warning.message}
                    </p>
                  ))}
                </div>
              </div>
            )}

            {compilationResult.abi && (
              <div className="p-3 bg-muted rounded">
                <p className="text-xs font-semibold mb-2">ABI</p>
                <pre className="text-xs overflow-auto max-h-32 bg-background p-2 rounded">
                  {JSON.stringify(compilationResult.abi, null, 2)}
                </pre>
              </div>
            )}
          </div>
        ) : (
          <p className="text-xs text-muted-foreground">Compile a contract to see results</p>
        )}
      </div>
    </div>
  )
}
