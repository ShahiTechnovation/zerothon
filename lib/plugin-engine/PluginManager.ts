import EventEmitter from 'events'
import { BasePlugin, PluginCallRequest } from './BasePlugin'

export class PluginManager {
  private plugins: Map<string, BasePlugin> = new Map()
  private eventBus: EventEmitter = new EventEmitter()
  private methodRegistry: Map<string, Map<string, Function>> = new Map()

  constructor() {
    // Set up plugin call handler
    this.eventBus.on('plugin:call', this.handlePluginCall.bind(this))
    
    // Increase max listeners to prevent warnings
    this.eventBus.setMaxListeners(50)
  }

  register(plugin: BasePlugin): void {
    if (this.plugins.has(plugin.name)) {
      throw new Error(`Plugin ${plugin.name} is already registered`)
    }

    this.plugins.set(plugin.name, plugin)
    this.methodRegistry.set(plugin.name, new Map())
    
    console.log(`[PluginManager] Registered plugin: ${plugin.displayName}`)
  }

  async activate(pluginName: string): Promise<void> {
    const plugin = this.plugins.get(pluginName)
    
    if (!plugin) {
      throw new Error(`Plugin ${pluginName} not found`)
    }

    try {
      await plugin.activate()
      console.log(`[PluginManager] Activated plugin: ${plugin.displayName}`)
    } catch (error) {
      console.error(`[PluginManager] Failed to activate ${pluginName}:`, error)
      throw error
    }
  }

  async activateAll(): Promise<void> {
    const activationPromises = Array.from(this.plugins.keys()).map(name => 
      this.activate(name).catch(error => {
        console.error(`Failed to activate ${name}:`, error)
      })
    )
    
    await Promise.all(activationPromises)
  }

  deactivate(pluginName: string): void {
    const plugin = this.plugins.get(pluginName)
    
    if (!plugin) {
      throw new Error(`Plugin ${pluginName} not found`)
    }

    plugin.deactivate()
    console.log(`[PluginManager] Deactivated plugin: ${plugin.displayName}`)
  }

  deactivateAll(): void {
    this.plugins.forEach(plugin => {
      try {
        plugin.deactivate()
      } catch (error) {
        console.error(`Failed to deactivate ${plugin.name}:`, error)
      }
    })
  }

  registerMethod(pluginName: string, methodName: string, method: Function): void {
    const methods = this.methodRegistry.get(pluginName)
    
    if (!methods) {
      throw new Error(`Plugin ${pluginName} not registered`)
    }

    methods.set(methodName, method)
  }

  async call(pluginName: string, method: string, ...args: any[]): Promise<any> {
    const plugin = this.plugins.get(pluginName)
    
    if (!plugin) {
      throw new Error(`Plugin ${pluginName} not found`)
    }

    const methods = this.methodRegistry.get(pluginName)
    const methodFn = methods?.get(method)

    if (!methodFn) {
      // Try to call method directly on plugin
      if (typeof (plugin as any)[method] === 'function') {
        return await (plugin as any)[method](...args)
      }
      throw new Error(`Method ${method} not found on plugin ${pluginName}`)
    }

    return await methodFn(...args)
  }

  private handlePluginCall(request: PluginCallRequest): void {
    this.call(request.target, request.method, ...request.args)
      .then(request.resolve)
      .catch(request.reject)
  }

  emit(event: string, data: any): void {
    this.eventBus.emit(event, data)
  }

  on(event: string, callback: (...args: any[]) => void): void {
    this.eventBus.on(event, callback)
  }

  off(event: string, callback: (...args: any[]) => void): void {
    this.eventBus.off(event, callback)
  }

  getPlugin(name: string): BasePlugin | undefined {
    return this.plugins.get(name)
  }

  getAllPlugins(): BasePlugin[] {
    return Array.from(this.plugins.values())
  }

  getEventBus(): EventEmitter {
    return this.eventBus
  }
}
