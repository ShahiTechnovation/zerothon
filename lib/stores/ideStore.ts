import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { FileEntry } from '../storage/database'
import { TerminalMessage } from '../plugins/TerminalPlugin'

export interface EditorTab {
  id: string
  path: string
  name: string
  content: string
  language: string
  isDirty: boolean
  isActive: boolean
}

export interface CompilationOutput {
  success: boolean
  contracts?: any[]
  errors?: any[]
  warnings?: any[]
  timestamp: number
}

interface IDEState {
  // File system
  files: FileEntry[]
  selectedFile: FileEntry | null
  
  // Editor
  editorTabs: EditorTab[]
  activeTabId: string | null
  
  // Terminal
  terminalMessages: TerminalMessage[]
  
  // Compilation
  isCompiling: boolean
  compilationOutput: CompilationOutput | null
  
  // UI
  leftSidebarOpen: boolean
  rightSidebarOpen: boolean
  terminalOpen: boolean
  
  // Actions
  setFiles: (files: FileEntry[]) => void
  setSelectedFile: (file: FileEntry | null) => void
  
  addEditorTab: (tab: EditorTab) => void
  removeEditorTab: (tabId: string) => void
  setActiveTab: (tabId: string) => void
  updateTabContent: (tabId: string, content: string) => void
  markTabDirty: (tabId: string, isDirty: boolean) => void
  closeAllTabs: () => void
  
  addTerminalMessage: (message: TerminalMessage) => void
  clearTerminal: () => void
  
  setCompiling: (isCompiling: boolean) => void
  setCompilationOutput: (output: CompilationOutput) => void
  
  toggleLeftSidebar: () => void
  toggleRightSidebar: () => void
  toggleTerminal: () => void
}

export const useIDEStore = create<IDEState>()(
  immer((set) => ({
    // Initial state
    files: [],
    selectedFile: null,
    editorTabs: [],
    activeTabId: null,
    terminalMessages: [],
    isCompiling: false,
    compilationOutput: null,
    leftSidebarOpen: true,
    rightSidebarOpen: true,
    terminalOpen: true,

    // File system actions
    setFiles: (files) => set((state) => {
      state.files = files
    }),

    setSelectedFile: (file) => set((state) => {
      state.selectedFile = file
    }),

    // Editor actions
    addEditorTab: (tab) => set((state) => {
      // Check if tab already exists
      const existingTab = state.editorTabs.find(t => t.path === tab.path)
      
      if (existingTab) {
        // Just activate existing tab
        state.editorTabs.forEach(t => t.isActive = false)
        existingTab.isActive = true
        state.activeTabId = existingTab.id
      } else {
        // Deactivate all tabs
        state.editorTabs.forEach(t => t.isActive = false)
        // Add new tab
        state.editorTabs.push({ ...tab, isActive: true })
        state.activeTabId = tab.id
      }
    }),

    removeEditorTab: (tabId) => set((state) => {
      const index = state.editorTabs.findIndex(t => t.id === tabId)
      
      if (index !== -1) {
        state.editorTabs.splice(index, 1)
        
        // If removed tab was active, activate another tab
        if (state.activeTabId === tabId) {
          if (state.editorTabs.length > 0) {
            const newActiveTab = state.editorTabs[Math.max(0, index - 1)]
            newActiveTab.isActive = true
            state.activeTabId = newActiveTab.id
          } else {
            state.activeTabId = null
          }
        }
      }
    }),

    setActiveTab: (tabId) => set((state) => {
      state.editorTabs.forEach(tab => {
        tab.isActive = tab.id === tabId
      })
      state.activeTabId = tabId
    }),

    updateTabContent: (tabId, content) => set((state) => {
      const tab = state.editorTabs.find(t => t.id === tabId)
      if (tab) {
        tab.content = content
      }
    }),

    markTabDirty: (tabId, isDirty) => set((state) => {
      const tab = state.editorTabs.find(t => t.id === tabId)
      if (tab) {
        tab.isDirty = isDirty
      }
    }),

    closeAllTabs: () => set((state) => {
      state.editorTabs = []
      state.activeTabId = null
    }),

    // Terminal actions
    addTerminalMessage: (message) => set((state) => {
      state.terminalMessages.push(message)
      // Keep only last 1000 messages
      if (state.terminalMessages.length > 1000) {
        state.terminalMessages = state.terminalMessages.slice(-1000)
      }
    }),

    clearTerminal: () => set((state) => {
      state.terminalMessages = []
    }),

    // Compilation actions
    setCompiling: (isCompiling) => set((state) => {
      state.isCompiling = isCompiling
    }),

    setCompilationOutput: (output) => set((state) => {
      state.compilationOutput = output
    }),

    // UI actions
    toggleLeftSidebar: () => set((state) => {
      state.leftSidebarOpen = !state.leftSidebarOpen
    }),

    toggleRightSidebar: () => set((state) => {
      state.rightSidebarOpen = !state.rightSidebarOpen
    }),

    toggleTerminal: () => set((state) => {
      state.terminalOpen = !state.terminalOpen
    }),
  }))
)
