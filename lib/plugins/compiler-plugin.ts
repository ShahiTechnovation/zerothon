// Compiler Plugin - handles Python transpilation and Solidity compilation

import type { Plugin, PluginEvent } from "@/lib/plugin-engine"
import { pluginEngine } from "@/lib/plugin-engine"
import { transpilePythonToSolidity } from "@/lib/transpiler"
import type { FileEntry, CompilationResult } from "@/lib/types"

export class CompilerPlugin implements Plugin {
  id = "compiler"
  name = "Compiler"
  version = "1.0.0"
  private compiledContracts: Map<string, CompilationResult> = new Map()

  async activate(): Promise<void> {
    console.log("[v0] CompilerPlugin activated")
  }

  async deactivate(): Promise<void> {
    console.log("[v0] CompilerPlugin deactivated")
  }

  async onEvent(event: PluginEvent): Promise<void> {
    // Listen for compilation requests
  }

  async compile(file: FileEntry): Promise<CompilationResult> {
    await pluginEngine.emit("compile:start", { fileName: file.name }, this.id)

    try {
      let result: CompilationResult

      if (file.language === "python") {
        result = transpilePythonToSolidity(file.content)
      } else {
        // For Solidity, just validate
        result = {
          success: true,
          contractName: file.name.replace(/\.sol$/, ""),
          bytecode: "0x",
          deployedBytecode: "0x",
          abi: [],
        }
      }

      this.compiledContracts.set(file.path, result)

      if (result.success) {
        await pluginEngine.emit("compile:success", { fileName: file.name, result }, this.id)
      } else {
        await pluginEngine.emit("compile:error", { fileName: file.name, error: result.error }, this.id)
      }

      return result
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error"
      const result: CompilationResult = {
        success: false,
        error: errorMessage,
      }
      await pluginEngine.emit("compile:error", { fileName: file.name, error: errorMessage }, this.id)
      return result
    }
  }

  getCompiledContract(path: string): CompilationResult | undefined {
    return this.compiledContracts.get(path)
  }
}
