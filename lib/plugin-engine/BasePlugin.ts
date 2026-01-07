import EventEmitter from 'events'

export interface PluginConfig {
  name: string
  displayName: string
  description: string
  version: string
}

export interface PluginCallRequest {
  target: string
  method: string
  args: any[]
  resolve: (value: any) => void
  reject: (error: any) => void
}

export abstract class BasePlugin {
  public name: string
  public displayName: string
  public description: string
  public version: string
  protected eventBus: EventEmitter
  protected isActive: boolean = false

  constructor(config: PluginConfig, eventBus: EventEmitter) {
    this.name = config.name
    this.displayName = config.displayName
    this.description = config.description
    this.version = config.version
    this.eventBus = eventBus
  }

  abstract activate(): Promise<void>
  abstract deactivate(): void

  // Plugin communication methods
  protected call(pluginName: string, method: string, ...args: any[]): Promise<any> {
    return new Promise((resolve, reject) => {
      this.eventBus.emit('plugin:call', {
        target: pluginName,
        method,
        args,
        resolve,
        reject
      } as PluginCallRequest)
    })
  }

  protected emit(event: string, data: any): void {
    this.eventBus.emit(`${this.name}:${event}`, data)
  }

  protected on(event: string, callback: (...args: any[]) => void): void {
    this.eventBus.on(event, callback)
  }

  protected off(event: string, callback: (...args: any[]) => void): void {
    this.eventBus.off(event, callback)
  }

  public getStatus(): { name: string; isActive: boolean } {
    return {
      name: this.name,
      isActive: this.isActive
    }
  }
}
