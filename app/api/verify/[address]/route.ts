/**
 * API Endpoint: Get Verified Contract
 * GET /api/verify/[address]?network=fuji
 */

import { NextRequest, NextResponse } from 'next/server'
import { getVerifiedContract } from '@/lib/verification/verifier'

export async function GET(
  request: NextRequest,
  { params }: { params: { address: string } }
) {
  try {
    const { address } = params
    const network = request.nextUrl.searchParams.get('network') || 'fuji'

    const contract = await getVerifiedContract(address, network)

    if (!contract) {
      return NextResponse.json({
        success: false,
        message: 'Contract not found or not verified',
        contract: null
      }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: 'Contract found',
      contract
    })

  } catch (error: any) {
    console.error('Error fetching contract:', error)
    
    return NextResponse.json({
      success: false,
      message: 'Error fetching contract',
      error: error.message
    }, { status: 500 })
  }
}
