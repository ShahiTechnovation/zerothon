/**
 * API Endpoint: Search Verified Contracts
 * GET /api/verify/search?network=fuji&creator=0x...
 */

import { NextRequest, NextResponse } from 'next/server'
import { verificationDB } from '@/lib/verification/database'
import { ContractSearchParams } from '@/lib/verification/types'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    
    const params: ContractSearchParams = {
      address: searchParams.get('address') || undefined,
      network: searchParams.get('network') || undefined,
      creator: searchParams.get('creator') || undefined,
      verified: searchParams.get('verified') === 'true' ? true : undefined,
      limit: parseInt(searchParams.get('limit') || '20'),
      offset: parseInt(searchParams.get('offset') || '0')
    }

    const contracts = await verificationDB.searchContracts(params)
    const stats = await verificationDB.getStats()

    return NextResponse.json({
      success: true,
      contracts,
      stats,
      count: contracts.length
    })

  } catch (error: any) {
    console.error('Search error:', error)
    
    return NextResponse.json({
      success: false,
      message: 'Search failed',
      error: error.message
    }, { status: 500 })
  }
}
