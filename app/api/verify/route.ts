/**
 * API Endpoint: Verify Python Smart Contract
 * POST /api/verify
 */

import { NextRequest, NextResponse } from 'next/server'
import { verifyPythonContract } from '@/lib/verification/verifier'
import { VerificationRequest } from '@/lib/verification/types'

export async function POST(request: NextRequest) {
  try {
    const body: VerificationRequest = await request.json()

    console.log('[Verify API] Request received:', {
      address: body.address,
      network: body.network,
      contractName: body.contractName,
      hasSource: !!body.pythonSource,
      hasAbi: !!(body.abi && body.abi.length > 0),
      abiLength: body.abi?.length || 0,
      hasBytecode: !!body.bytecode
    })

    // Validate request
    if (!body.address || !body.network || !body.pythonSource || !body.contractName) {
      console.error('[Verify API] Missing required fields')
      return NextResponse.json({
        success: false,
        verified: false,
        message: 'Missing required fields',
        errors: ['address, network, pythonSource, and contractName are required']
      }, { status: 400 })
    }

    // Verify contract
    console.log('[Verify API] Calling verifyPythonContract...')
    const result = await verifyPythonContract(body)
    
    console.log('[Verify API] Verification result:', {
      success: result.success,
      verified: result.verified,
      message: result.message,
      hasErrors: !!(result.errors && result.errors.length > 0),
      errors: result.errors
    })

    return NextResponse.json(result, { 
      status: result.success ? 200 : 400 
    })

  } catch (error: any) {
    console.error('[Verify API] Caught error:', error)
    
    return NextResponse.json({
      success: false,
      verified: false,
      message: 'Server error during verification',
      errors: [error.message, error.stack]
    }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    service: 'PyVax Contract Verification API',
    version: '1.0.0',
    endpoints: {
      verify: 'POST /api/verify',
      contract: 'GET /api/verify/[address]',
      search: 'GET /api/verify/search'
    }
  })
}
