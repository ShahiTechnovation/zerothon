/**
 * IndexedDB Database for Verified Python Smart Contracts
 */

import Dexie, { Table } from 'dexie'
import { VerifiedContract, ContractSearchParams } from './types'

class VerificationDatabase extends Dexie {
  contracts!: Table<VerifiedContract>

  constructor() {
    super('PyVaxVerification')
    
    this.version(1).stores({
      contracts: '++id, address, network, creator, verified, verifiedAt, deployedAt, [address+network]'
    })
  }

  /**
   * Add a verified contract
   */
  async addContract(contract: Omit<VerifiedContract, 'id'>): Promise<string> {
    const id = await this.contracts.add(contract as VerifiedContract)
    return id.toString()
  }

  /**
   * Get contract by address and network
   */
  async getContract(address: string, network: string): Promise<VerifiedContract | undefined> {
    return await this.contracts
      .where('[address+network]')
      .equals([address.toLowerCase(), network])
      .first()
  }

  /**
   * Get all contracts
   */
  async getAllContracts(): Promise<VerifiedContract[]> {
    return await this.contracts.toArray()
  }

  /**
   * Search contracts
   */
  async searchContracts(params: ContractSearchParams): Promise<VerifiedContract[]> {
    let query = this.contracts.toCollection()

    if (params.address) {
      query = this.contracts.where('address').equals(params.address.toLowerCase())
    }
    
    if (params.network) {
      query = query.and(c => c.network === params.network)
    }
    
    if (params.creator) {
      query = query.and(c => c.creator.toLowerCase() === params.creator!.toLowerCase())
    }
    
    if (params.verified !== undefined) {
      query = query.and(c => c.verified === params.verified)
    }

    const results = await query
      .reverse()
      .offset(params.offset || 0)
      .limit(params.limit || 20)
      .toArray()

    return results
  }

  /**
   * Get all verified contracts
   */
  async getAllVerified(): Promise<VerifiedContract[]> {
    return await this.contracts
      .where('verified')
      .equals(1)
      .reverse()
      .sortBy('verifiedAt')
  }

  /**
   * Get contracts by creator
   */
  async getByCreator(creator: string): Promise<VerifiedContract[]> {
    return await this.contracts
      .where('creator')
      .equalsIgnoreCase(creator)
      .reverse()
      .sortBy('deployedAt')
  }

  /**
   * Get contracts by network
   */
  async getByNetwork(network: string): Promise<VerifiedContract[]> {
    return await this.contracts
      .where('network')
      .equals(network)
      .reverse()
      .sortBy('deployedAt')
  }

  /**
   * Update contract verification status
   */
  async updateVerification(
    address: string,
    network: string,
    updates: Partial<VerifiedContract>
  ): Promise<void> {
    const contract = await this.getContract(address, network)
    if (contract) {
      await this.contracts.update(contract.id, updates)
    }
  }

  /**
   * Delete contract by ID
   */
  async deleteContract(id: string): Promise<void> {
    await this.contracts.delete(parseInt(id))
  }

  /**
   * Delete contract by address
   */
  async deleteContractByAddress(address: string, network: string): Promise<void> {
    const contract = await this.getContract(address, network)
    if (contract) {
      await this.contracts.delete(contract.id)
    }
  }

  /**
   * Get statistics
   */
  async getStats() {
    const all = await this.contracts.toArray()
    const verified = all.filter(c => c.verified)
    
    const byNetwork: Record<string, number> = {}
    all.forEach(c => {
      byNetwork[c.network] = (byNetwork[c.network] || 0) + 1
    })

    const recent = await this.contracts
      .where('verified')
      .equals(1)
      .reverse()
      .sortBy('verifiedAt')
      .then(contracts => contracts.slice(0, 10))

    return {
      totalContracts: all.length,
      verifiedCount: verified.length,
      unverifiedCount: all.length - verified.length,
      byNetwork,
      recentVerifications: recent
    }
  }

  /**
   * Clear all data
   */
  async clearAll(): Promise<void> {
    await this.contracts.clear()
  }
}

// Export singleton instance
export const verificationDB = new VerificationDatabase()
