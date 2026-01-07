import { BasePlugin, PluginConfig } from '../plugin-engine/BasePlugin'
import { db, FileEntry, WorkspaceEntry } from '../storage/database'
import EventEmitter from 'events'

export class FileManagerPlugin extends BasePlugin {
  private currentWorkspaceId: string = ''

  constructor(eventBus: EventEmitter) {
    super(
      {
        name: 'fileManager',
        displayName: 'File Manager',
        description: 'Manages files and workspaces',
        version: '1.0.0'
      },
      eventBus
    )
  }

  async activate(): Promise<void> {
    // Load or create default workspace
    this.currentWorkspaceId = await db.initializeDefaultWorkspace()
    
    this.isActive = true
    this.emit('activated', { workspaceId: this.currentWorkspaceId })
    
    console.log('[FileManager] Activated with workspace:', this.currentWorkspaceId)
  }

  deactivate(): void {
    this.isActive = false
    this.emit('deactivated', {})
  }

  // Public API methods
  async createFile(path: string, content: string = '', language: string = 'solidity'): Promise<number> {
    const fileId = await db.files.add({
      workspaceId: this.currentWorkspaceId,
      path,
      name: path.split('/').pop() || 'untitled',
      content,
      language: language as any,
      lastModified: Date.now(),
      createdAt: Date.now()
    })

    this.emit('fileCreated', { fileId, path })
    console.log('[FileManager] Created file:', path)
    
    return fileId
  }

  async saveFile(path: string, content: string): Promise<void> {
    const file = await db.files
      .where({ workspaceId: this.currentWorkspaceId, path })
      .first()

    if (file?.id) {
      await db.files.update(file.id, {
        content,
        lastModified: Date.now()
      })
      this.emit('fileSaved', { path, content })
      console.log('[FileManager] Saved file:', path)
    } else {
      throw new Error(`File not found: ${path}`)
    }
  }

  async loadFile(path: string): Promise<FileEntry | undefined> {
    const file = await db.files
      .where({ workspaceId: this.currentWorkspaceId, path })
      .first()
    
    if (file) {
      this.emit('fileLoaded', { path, file })
    }
    
    return file
  }

  async deleteFile(path: string): Promise<void> {
    const file = await db.files
      .where({ workspaceId: this.currentWorkspaceId, path })
      .first()

    if (file?.id) {
      await db.files.delete(file.id)
      this.emit('fileDeleted', { path })
      console.log('[FileManager] Deleted file:', path)
    }
  }

  async getAllFiles(): Promise<FileEntry[]> {
    const files = await db.files
      .where({ workspaceId: this.currentWorkspaceId })
      .toArray()
    
    return files.sort((a, b) => a.path.localeCompare(b.path))
  }

  async renameFile(oldPath: string, newPath: string): Promise<void> {
    const file = await db.files
      .where({ workspaceId: this.currentWorkspaceId, path: oldPath })
      .first()

    if (file?.id) {
      await db.files.update(file.id, {
        path: newPath,
        name: newPath.split('/').pop() || 'untitled',
        lastModified: Date.now()
      })
      this.emit('fileRenamed', { oldPath, newPath })
      console.log('[FileManager] Renamed file:', oldPath, '->', newPath)
    }
  }

  async getFileContent(path: string): Promise<string> {
    const file = await this.loadFile(path)
    return file?.content || ''
  }

  getCurrentWorkspaceId(): string {
    return this.currentWorkspaceId
  }

  async switchWorkspace(workspaceId: string): Promise<void> {
    // Deactivate current workspace
    await db.workspaces
      .where({ id: parseInt(this.currentWorkspaceId) })
      .modify({ isActive: false })

    // Activate new workspace
    await db.workspaces
      .where({ id: parseInt(workspaceId) })
      .modify({ isActive: true, lastAccessed: Date.now() })

    this.currentWorkspaceId = workspaceId
    this.emit('workspaceSwitched', { workspaceId })
    console.log('[FileManager] Switched to workspace:', workspaceId)
  }

  async createWorkspace(name: string): Promise<number> {
    const id = await db.workspaces.add({
      name,
      isActive: false,
      createdAt: Date.now(),
      lastAccessed: Date.now()
    })

    this.emit('workspaceCreated', { id, name })
    return id
  }

  async getAllWorkspaces(): Promise<WorkspaceEntry[]> {
    return await db.workspaces.toArray()
  }
}
