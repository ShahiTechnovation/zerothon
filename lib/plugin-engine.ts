// Plugin-based architecture inspired by Remix IDE
// Central event bus for plugin communication

export type PluginEventType =
  | "file:created"
  | "file:updated"
  | "file:deleted"
  | "file:selected"
  | "compile:start"
  | "compile:success"
  | "compile:error"
  | "deploy:start"
  | "deploy:success"
  | "deploy:error"
  | "wallet:connected"
  | "wallet:disconnected"
  | "console:log"
  | "console:clear"
  | "plugin:loaded"
  | "plugin:unloaded"

export interface PluginEvent {
  type: PluginEventType
  payload: any
  timestamp: number
  source: string
}

export interface Plugin {
  id: string
  name: string
  version: string
  activate(): Promise<void>
  deactivate(): Promise<void>
  onEvent?(event: PluginEvent): Promise<void>
}

export class PluginEngine {
  private plugins: Map<string, Plugin> = new Map()
  private listeners: Map<PluginEventType, Set<(event: PluginEvent) => Promise<void>>> = new Map()
  private eventHistory: PluginEvent[] = []

  async registerPlugin(plugin: Plugin): Promise<void> {
    if (this.plugins.has(plugin.id)) {
      throw new Error(`Plugin ${plugin.id} already registered`)
    }
    this.plugins.set(plugin.id, plugin)
    await plugin.activate()
    await this.emit("plugin:loaded", { pluginId: plugin.id, pluginName: plugin.name }, "engine")
  }

  async unregisterPlugin(pluginId: string): Promise<void> {
    const plugin = this.plugins.get(pluginId)
    if (!plugin) throw new Error(`Plugin ${pluginId} not found`)
    await plugin.deactivate()
    this.plugins.delete(pluginId)
    await this.emit("plugin:unloaded", { pluginId }, "engine")
  }

  async emit(type: PluginEventType, payload: any, source: string): Promise<void> {
    const event: PluginEvent = {
      type,
      payload,
      timestamp: Date.now(),
      source,
    }
    this.eventHistory.push(event)

    // Notify all listeners
    const listeners = this.listeners.get(type) || new Set()
    for (const listener of listeners) {
      try {
        await listener(event)
      } catch (error) {
        console.error(`[v0] Plugin listener error:`, error)
      }
    }

    // Notify plugins
    for (const plugin of this.plugins.values()) {
      if (plugin.onEvent) {
        try {
          await plugin.onEvent(event)
        } catch (error) {
          console.error(`[v0] Plugin ${plugin.id} error:`, error)
        }
      }
    }
  }

  on(type: PluginEventType, listener: (event: PluginEvent) => Promise<void>): () => void {
    if (!this.listeners.has(type)) {
      this.listeners.set(type, new Set())
    }
    this.listeners.get(type)!.add(listener)

    // Return unsubscribe function
    return () => {
      this.listeners.get(type)?.delete(listener)
    }
  }

  getPlugin(pluginId: string): Plugin | undefined {
    return this.plugins.get(pluginId)
  }

  getAllPlugins(): Plugin[] {
    return Array.from(this.plugins.values())
  }

  getEventHistory(type?: PluginEventType): PluginEvent[] {
    if (type) {
      return this.eventHistory.filter((e) => e.type === type)
    }
    return this.eventHistory
  }
}

export const pluginEngine = new PluginEngine()
