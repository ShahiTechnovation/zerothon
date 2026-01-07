// IndexedDB file system management

import Dexie, { type Table } from "dexie"
import type { FileEntry, DeploymentEntry } from "./types"

class PyVaxDatabase extends Dexie {
  files!: Table<FileEntry>
  deployments!: Table<DeploymentEntry>

  constructor() {
    super("PyVaxIDE")
    this.version(1).stores({
      files: "++id, path, language, lastModified",
      deployments: "++id, address, network, timestamp",
    })
  }
}

export const db = new PyVaxDatabase()

export async function saveFile(file: FileEntry): Promise<void> {
  const existing = await db.files.where("path").equals(file.path).first()
  if (existing) {
    await db.files.update(existing.id, {
      ...file,
      lastModified: Date.now(),
    })
  } else {
    await db.files.add({
      ...file,
      lastModified: Date.now(),
    })
  }
}

export async function loadFile(path: string): Promise<FileEntry | undefined> {
  return await db.files.where("path").equals(path).first()
}

export async function deleteFile(path: string): Promise<void> {
  const file = await db.files.where("path").equals(path).first()
  if (file) {
    await db.files.delete(file.id)
  }
}

export async function loadAllFiles(): Promise<FileEntry[]> {
  return await db.files.toArray()
}

export async function saveDeployment(deployment: DeploymentEntry): Promise<void> {
  await db.deployments.add(deployment)
}

export async function loadDeployments(): Promise<DeploymentEntry[]> {
  return await db.deployments.orderBy("timestamp").reverse().toArray()
}
