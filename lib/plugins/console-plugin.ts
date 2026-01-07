// Console Plugin - handles logging and console output

import type { Plugin, PluginEvent } from "@/lib/plugin-engine"
import { pluginEngine } from "@/lib/plugin-engine"
import type { ConsoleLog } from "@/lib/types"

export class ConsolePlugin implements Plugin {
  id = "console"
  name = "Console"
  version = "1.0.0"
  private logs: ConsoleLog[] = []

  async activate(): Promise<void> {
    console.log("[v0] ConsolePlugin activated")
  }

  async deactivate(): Promise<void> {
    console.log("[v0] ConsolePlugin deactivated")
  }

  async onEvent(event: PluginEvent): Promise<void> {
    // Auto-log important events
    if (
      event.type === "compile:success" ||
      event.type === "compile:error" ||
      event.type === "deploy:success" ||
      event.type === "deploy:error" ||
      event.type === "wallet:connected"
    ) {
      const type = event.type.includes("error") ? "error" : event.type.includes("success") ? "success" : "log"
      this.addLog(event.payload.error || event.payload.message || JSON.stringify(event.payload), type)
    }
  }

  addLog(message: string, type: "log" | "error" | "warning" | "success" = "log"): void {
    const log: ConsoleLog = {
      id: `log-${Date.now()}-${Math.random()}`,
      type,
      message,
      timestamp: Date.now(),
    }
    this.logs.push(log)
    pluginEngine.emit("console:log", log, this.id)
  }

  getLogs(): ConsoleLog[] {
    return this.logs
  }

  clearLogs(): void {
    this.logs = []
    pluginEngine.emit("console:clear", {}, this.id)
  }
}
