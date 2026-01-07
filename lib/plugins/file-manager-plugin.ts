// File Manager Plugin - handles file operations

import type { Plugin, PluginEvent } from "@/lib/plugin-engine"
import { pluginEngine } from "@/lib/plugin-engine"
import { saveFile, loadAllFiles, deleteFile, loadFile } from "@/lib/file-system"
import type { FileEntry } from "@/lib/types"

export class FileManagerPlugin implements Plugin {
  id = "file-manager"
  name = "File Manager"
  version = "1.0.0"

  async activate(): Promise<void> {
    console.log("[v0] FileManagerPlugin activated")
  }

  async deactivate(): Promise<void> {
    console.log("[v0] FileManagerPlugin deactivated")
  }

  async onEvent(event: PluginEvent): Promise<void> {
    if (event.type === "file:created" || event.type === "file:updated") {
      const file = event.payload as FileEntry
      await saveFile(file)
    } else if (event.type === "file:deleted") {
      const path = event.payload.path as string
      await deleteFile(path)
    }
  }

  async createFile(file: FileEntry): Promise<void> {
    await pluginEngine.emit("file:created", file, this.id)
  }

  async updateFile(file: FileEntry): Promise<void> {
    await pluginEngine.emit("file:updated", file, this.id)
  }

  async deleteFileByPath(path: string): Promise<void> {
    await pluginEngine.emit("file:deleted", { path }, this.id)
  }

  async getAllFiles(): Promise<FileEntry[]> {
    return await loadAllFiles()
  }

  async getFile(path: string): Promise<FileEntry | undefined> {
    return await loadFile(path)
  }
}
