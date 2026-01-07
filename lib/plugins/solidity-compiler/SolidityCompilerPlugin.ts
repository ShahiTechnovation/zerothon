import { BasePlugin } from '../../plugin-engine/BasePlugin'
import EventEmitter from 'events'

export interface CompilationResult {
  contracts: Array<{
    name: string
    abi: any[]
    bytecode: string
    deployedBytecode: string
    gasEstimates: any
    metadata: string
  }>
  warnings?: any[]
}

export class SolidityCompilerPlugin extends BasePlugin {
  private worker: Worker | null = null
  private currentVersion: string = 'v0.8.23+commit.f704f362'
  private isCompiling: boolean = false

  constructor(eventBus: EventEmitter) {
    super(
      {
        name: 'solidityCompiler',
        displayName: 'Solidity Compiler',
        description: 'Compiles Solidity smart contracts',
        version: '1.0.0'
      },
      eventBus
    )
  }

  async activate(): Promise<void> {
    try {
      // Initialize Web Worker
      this.worker = new Worker(
        new URL('./CompilerWorker.worker.ts', import.meta.url),
        { type: 'module' }
      )

      this.worker.onmessage = this.handleWorkerMessage.bind(this)
      this.worker.onerror = (error) => {
        console.error('[SolidityCompiler] Worker error:', error)
        this.emit('error', { error: error.message })
      }

      // Load default compiler version
      this.worker.postMessage({
        type: 'LOAD_VERSION',
        data: { version: this.currentVersion }
      })

      this.isActive = true
      this.emit('activated', {})
      console.log('[SolidityCompiler] Activated')
    } catch (error) {
      console.error('[SolidityCompiler] Activation failed:', error)
      throw error
    }
  }

  deactivate(): void {
    this.worker?.terminate()
    this.worker = null
    this.isActive = false
    this.emit('deactivated', {})
  }

  private handleWorkerMessage(e: MessageEvent): void {
    const { type, ...data } = e.data

    switch (type) {
      case 'COMPILE_SUCCESS':
        this.isCompiling = false
        this.emit('compiled', data)
        console.log('[SolidityCompiler] Compilation successful:', data.contracts.length, 'contracts')
        break
      case 'COMPILE_ERROR':
        this.isCompiling = false
        this.emit('compilationError', data)
        console.error('[SolidityCompiler] Compilation error:', data)
        break
      case 'VERSION_LOADING':
        this.emit('versionLoading', data)
        console.log('[SolidityCompiler] Loading version:', data.version)
        break
      case 'VERSION_LOADED':
        this.emit('versionLoaded', data)
        console.log('[SolidityCompiler] Version loaded:', data.version)
        break
      case 'VERSION_LOAD_ERROR':
        this.emit('versionLoadError', data)
        console.error('[SolidityCompiler] Version load error:', data)
        break
    }
  }

  // Public API
  async compile(source: string, fileName: string): Promise<void> {
    if (!this.worker) {
      throw new Error('Compiler not initialized')
    }

    if (this.isCompiling) {
      console.warn('[SolidityCompiler] Already compiling, please wait')
      return
    }

    this.isCompiling = true
    this.emit('compilationStarted', { fileName })
    console.log('[SolidityCompiler] Starting compilation:', fileName)

    this.worker.postMessage({
      type: 'COMPILE',
      data: {
        source,
        fileName,
        version: this.currentVersion
      }
    })
  }

  async setCompilerVersion(version: string): Promise<void> {
    this.currentVersion = version
    if (this.worker) {
      this.worker.postMessage({
        type: 'LOAD_VERSION',
        data: { version }
      })
    }
  }

  getCurrentVersion(): string {
    return this.currentVersion
  }

  isCurrentlyCompiling(): boolean {
    return this.isCompiling
  }
}
