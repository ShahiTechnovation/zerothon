/**
 * Blockscout API Proxy
 * Fetches blockchain data from Snowtrace/Blockscout API
 */

import { NextRequest, NextResponse } from 'next/server'
import { getBlockscoutClient } from '@/lib/blockscout/client'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const action = searchParams.get('action')
    const address = searchParams.get('address')
    const network = searchParams.get('network') || 'fuji'

    if (!action || !address) {
      return NextResponse.json({
        success: false,
        error: 'Missing required parameters: action, address'
      }, { status: 400 })
    }

    const client = getBlockscoutClient(network)

    let result
    switch (action) {
      case 'transactions':
        const page = parseInt(searchParams.get('page') || '1')
        const limit = parseInt(searchParams.get('limit') || '10')
        result = await client.getTransactions(address, 0, 99999999, page, limit)
        break

      case 'balance':
        result = await client.getBalance(address)
        break

      case 'tokens':
        result = await client.getTokenBalances(address)
        break

      case 'token-transfers':
        const tokenPage = parseInt(searchParams.get('page') || '1')
        const tokenLimit = parseInt(searchParams.get('limit') || '20')
        result = await client.getTokenTransfers(address, undefined, tokenPage, tokenLimit)
        break

      case 'nfts':
        result = await client.getNFTTransfers(address)
        break

      case 'internal-txs':
        result = await client.getInternalTransactions(address)
        break

      default:
        return NextResponse.json({
          success: false,
          error: `Unknown action: ${action}`
        }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      data: result,
      source: 'blockscout'
    })

  } catch (error: any) {
    console.error('[Blockscout API] Error:', error)
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 })
  }
}
