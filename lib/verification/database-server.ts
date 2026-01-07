/**
 * Server-Side Verification Database
 * Uses file system instead of IndexedDB for server compatibility
 */

import fs from 'fs'
import path from 'path'
import { VerifiedContract, ContractSearchParams } from './types'

const DB_FILE = path.join(process.cwd(), 'data', 'verified-contracts.json')

interface Database {
  contracts: VerifiedContract[]
  version: number
}

class ServerVerificationDatabase {
  private db: Database | null = null

  constructor() {
    this.ensureDataDir()
    this.loadDatabase()
  }

  private ensureDataDir() {
    const dataDir = path.join(process.cwd(), 'data')
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true })
    }
  }

  private loadDatabase() {
    try {
      if (fs.existsSync(DB_FILE)) {
        const data = fs.readFileSync(DB_FILE, 'utf8')
        this.db = JSON.parse(data)
      } else {
        this.db = { contracts: [], version: 1 }
        this.saveDatabase()
      }
    } catch (error) {
      console.error('[DB] Error loading database:', error)
      this.db = { contracts: [], version: 1 }
    }
  }

  private saveDatabase() {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(this.db, null, 2), 'utf8')
    } catch (error) {
      console.error('[DB] Error saving database:', error)
    }
  }

  async addContract(contract: Omit<VerifiedContract, 'id'>): Promise<string> {
    if (!this.db) this.loadDatabase()
    
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9)
    const newContract: VerifiedContract = {
      ...contract,
      id
    }
    
    this.db!.contracts.push(newContract)
    this.saveDatabase()
    
    console.log(`[DB] Added contract: ${contract.address} on ${contract.network}`)
    return id
  }

  async getContract(address: string, network: string): Promise<VerifiedContract | undefined> {
    if (!this.db) this.loadDatabase()
    
    return this.db!.contracts.find(
      c => c.address.toLowerCase() === address.toLowerCase() && c.network === network
    )
  }

  async getAllContracts(): Promise<VerifiedContract[]> {
    if (!this.db) this.loadDatabase()
    return this.db!.contracts
  }

  async searchContracts(params: ContractSearchParams): Promise<VerifiedContract[]> {
    if (!this.db) this.loadDatabase()
    
    let results = [...this.db!.contracts]

    if (params.address) {
      results = results.filter(c => 
        c.address.toLowerCase() === params.address!.toLowerCase()
      )
    }
    
    if (params.network) {
      results = results.filter(c => c.network === params.network)
    }
    
    if (params.creator) {
      results = results.filter(c => 
        c.creator.toLowerCase() === params.creator!.toLowerCase()
      )
    }
    
    if (params.verified !== undefined) {
      results = results.filter(c => c.verified === params.verified)
    }

    // Sort by verified date (newest first)
    results.sort((a, b) => (b.verifiedAt || 0) - (a.verifiedAt || 0))

    // Apply pagination
    const offset = params.offset || 0
    const limit = params.limit || 20
    return results.slice(offset, offset + limit)
  }

  async getAllVerified(): Promise<VerifiedContract[]> {
    if (!this.db) this.loadDatabase()
    
    return this.db!.contracts
      .filter(c => c.verified)
      .sort((a, b) => (b.verifiedAt || 0) - (a.verifiedAt || 0))
  }

  async getByCreator(creator: string): Promise<VerifiedContract[]> {
    if (!this.db) this.loadDatabase()
    
    return this.db!.contracts
      .filter(c => c.creator.toLowerCase() === creator.toLowerCase())
      .sort((a, b) => (b.deployedAt || 0) - (a.deployedAt || 0))
  }

  async getByNetwork(network: string): Promise<VerifiedContract[]> {
    if (!this.db) this.loadDatabase()
    
    return this.db!.contracts
      .filter(c => c.network === network)
      .sort((a, b) => (b.deployedAt || 0) - (a.deployedAt || 0))
  }

  async updateVerification(
    address: string,
    network: string,
    updates: Partial<VerifiedContract>
  ): Promise<void> {
    if (!this.db) this.loadDatabase()
    
    const index = this.db!.contracts.findIndex(
      c => c.address.toLowerCase() === address.toLowerCase() && c.network === network
    )
    
    if (index !== -1) {
      this.db!.contracts[index] = {
        ...this.db!.contracts[index],
        ...updates
      }
      this.saveDatabase()
    }
  }

  async deleteContract(id: string): Promise<void> {
    if (!this.db) this.loadDatabase()
    
    this.db!.contracts = this.db!.contracts.filter(c => c.id !== id)
    this.saveDatabase()
  }

  async deleteContractByAddress(address: string, network: string): Promise<void> {
    if (!this.db) this.loadDatabase()
    
    this.db!.contracts = this.db!.contracts.filter(
      c => !(c.address.toLowerCase() === address.toLowerCase() && c.network === network)
    )
    this.saveDatabase()
  }

  async getStats() {
    if (!this.db) this.loadDatabase()
    
    const all = this.db!.contracts
    const verified = all.filter(c => c.verified)
    
    const byNetwork: Record<string, number> = {}
    all.forEach(c => {
      byNetwork[c.network] = (byNetwork[c.network] || 0) + 1
    })

    const recent = verified
      .sort((a, b) => (b.verifiedAt || 0) - (a.verifiedAt || 0))
      .slice(0, 10)

    return {
      totalContracts: all.length,
      verifiedCount: verified.length,
      unverifiedCount: all.length - verified.length,
      byNetwork,
      recentVerifications: recent
    }
  }

  async clearAll(): Promise<void> {
    this.db = { contracts: [], version: 1 }
    this.saveDatabase()
  }
}

// Export singleton instance
export const verificationDB = new ServerVerificationDatabase()
