import { BasePlugin } from '../plugin-engine/BasePlugin'
import EventEmitter from 'events'

export interface TerminalMessage {
  id: string
  type: 'info' | 'success' | 'warning' | 'error' | 'command'
  message: string
  timestamp: number
}

export class TerminalPlugin extends BasePlugin {
  private messages: TerminalMessage[] = []
  private maxMessages: number = 1000

  constructor(eventBus: EventEmitter) {
    super(
      {
        name: 'terminal',
        displayName: 'Terminal',
        description: 'Console output and logging',
        version: '1.0.0'
      },
      eventBus
    )
  }

  async activate(): Promise<void> {
    this.isActive = true
    this.log('info', 'PyVax IDE Terminal initialized')
    this.log('info', 'Welcome to PyVax IDE - Python to EVM Smart Contract Development')
    this.emit('activated', {})
  }

  deactivate(): void {
    this.isActive = false
    this.emit('deactivated', {})
  }

  // Public API
  log(type: TerminalMessage['type'], message: string): void {
    const terminalMessage: TerminalMessage = {
      id: `${Date.now()}-${Math.random()}`,
      type,
      message,
      timestamp: Date.now()
    }

    this.messages.push(terminalMessage)

    // Keep only last N messages
    if (this.messages.length > this.maxMessages) {
      this.messages = this.messages.slice(-this.maxMessages)
    }

    this.emit('messageAdded', terminalMessage)
  }

  info(message: string): void {
    this.log('info', message)
  }

  success(message: string): void {
    this.log('success', message)
  }

  warning(message: string): void {
    this.log('warning', message)
  }

  error(message: string): void {
    this.log('error', message)
  }

  command(message: string): void {
    this.log('command', message)
  }

  clear(): void {
    this.messages = []
    this.emit('cleared', {})
  }

  getMessages(): TerminalMessage[] {
    return [...this.messages]
  }

  getRecentMessages(count: number = 100): TerminalMessage[] {
    return this.messages.slice(-count)
  }
}
