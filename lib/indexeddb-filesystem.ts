// IndexedDB File System for PyVax IDE
import Dexie, { Table } from 'dexie'

export interface FileEntry {
  id?: number
  name: string
  path: string
  content: string
  language: 'python' | 'solidity' | 'javascript' | 'typescript' | 'json' | 'markdown'
  createdAt: Date
  updatedAt: Date
  size: number
}

export interface ProjectEntry {
  id?: number
  name: string
  description: string
  files: string[]
  createdAt: Date
  updatedAt: Date
}

class PyVaxDatabase extends Dexie {
  files!: Table<FileEntry, number>
  projects!: Table<ProjectEntry, number>

  constructor() {
    super('PyVaxIDE')
    
    this.version(1).stores({
      files: '++id, name, path, language, createdAt, updatedAt',
      projects: '++id, name, createdAt, updatedAt'
    })
  }
}

const db = new PyVaxDatabase()

export class FileSystem {
  static async saveFile(file: Omit<FileEntry, 'id' | 'createdAt' | 'updatedAt' | 'size'>): Promise<number> {
    const now = new Date()
    const size = new Blob([file.content]).size

    const existing = await db.files.where('path').equals(file.path).first()

    if (existing) {
      await db.files.update(existing.id!, {
        ...file,
        updatedAt: now,
        size
      })
      return existing.id!
    } else {
      return await db.files.add({
        ...file,
        createdAt: now,
        updatedAt: now,
        size
      })
    }
  }

  static async getFile(path: string): Promise<FileEntry | undefined> {
    return await db.files.where('path').equals(path).first()
  }

  static async getAllFiles(): Promise<FileEntry[]> {
    return await db.files.toArray()
  }

  static async deleteFile(path: string): Promise<void> {
    const file = await db.files.where('path').equals(path).first()
    if (file) {
      await db.files.delete(file.id!)
    }
  }

  static async saveProject(project: Omit<ProjectEntry, 'id' | 'createdAt' | 'updatedAt'>): Promise<number> {
    const now = new Date()
    return await db.projects.add({
      ...project,
      createdAt: now,
      updatedAt: now
    })
  }

  static async getAllProjects(): Promise<ProjectEntry[]> {
    return await db.projects.toArray()
  }

  static async clearAll(): Promise<void> {
    await db.files.clear()
    await db.projects.clear()
  }
}

export default db
