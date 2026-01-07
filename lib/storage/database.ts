import Dexie, { Table } from 'dexie'

export interface FileEntry {
  id?: number
  workspaceId: string
  path: string
  name: string
  content: string
  language: 'python' | 'solidity' | 'javascript' | 'json' | 'typescript'
  lastModified: number
  createdAt: number
}

export interface WorkspaceEntry {
  id?: number
  name: string
  isActive: boolean
  createdAt: number
  lastAccessed: number
}

export interface DeploymentEntry {
  id?: number
  workspaceId: string
  contractName: string
  address: string
  network: string
  chainId: number
  abi: any[]
  bytecode: string
  deployedBytecode: string
  transactionHash: string
  deployer: string
  timestamp: number
  constructorArgs?: any[]
}

export interface SettingsEntry {
  key: string
  value: any
}

export interface CompilationResult {
  id?: number
  workspaceId: string
  fileName: string
  language: 'python' | 'solidity'
  success: boolean
  contracts?: any[]
  errors?: any[]
  warnings?: any[]
  timestamp: number
}

class PyVaxDatabase extends Dexie {
  files!: Table<FileEntry, number>
  workspaces!: Table<WorkspaceEntry, number>
  deployments!: Table<DeploymentEntry, number>
  settings!: Table<SettingsEntry, string>
  compilations!: Table<CompilationResult, number>

  constructor() {
    super('PyVaxIDE')

    this.version(1).stores({
      files: '++id, workspaceId, path, name, language, lastModified',
      workspaces: '++id, name, isActive, lastAccessed',
      deployments: '++id, workspaceId, address, network, timestamp',
      settings: 'key',
      compilations: '++id, workspaceId, fileName, timestamp'
    })
  }

  async initializeDefaultWorkspace(): Promise<string> {
    const workspaces = await this.workspaces.toArray()
    
    if (workspaces.length === 0) {
      const id = await this.workspaces.add({
        name: 'default',
        isActive: true,
        createdAt: Date.now(),
        lastAccessed: Date.now()
      })
      
      // Create sample files
      await this.files.add({
        workspaceId: id.toString(),
        path: 'contracts/HelloWorld.sol',
        name: 'HelloWorld.sol',
        content: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract HelloWorld {
    string public message;
    
    constructor(string memory _message) {
        message = _message;
    }
    
    function setMessage(string memory _message) public {
        message = _message;
    }
    
    function getMessage() public view returns (string memory) {
        return message;
    }
}`,
        language: 'solidity',
        lastModified: Date.now(),
        createdAt: Date.now()
      })
      
      await this.files.add({
        workspaceId: id.toString(),
        path: 'contracts/Counter.py',
        name: 'Counter.py',
        content: `# PyVax Smart Contract Example
# This Python code will be transpiled to Solidity

class Counter(PySmartContract):
    def __init__(self, initial_value: int):
        self.count = initial_value
        self.owner = msg.sender
    
    @public_function
    def increment(self):
        self.count += 1
    
    @public_function
    def decrement(self):
        self.count -= 1
    
    @view_function
    def get_count(self) -> int:
        return self.count
    
    @public_function
    @only_owner
    def reset(self):
        self.count = 0`,
        language: 'python',
        lastModified: Date.now(),
        createdAt: Date.now()
      })
      
      return id.toString()
    }
    
    const active = workspaces.find(w => w.isActive)
    return active?.id?.toString() || workspaces[0].id!.toString()
  }
}

export const db = new PyVaxDatabase()
