/**
 * Manual Verification Endpoint
 * Use this to verify contracts that were deployed before auto-verification was fixed
 */

import { NextRequest, NextResponse } from 'next/server'
import { verifyPythonContract } from '@/lib/verification/verifier'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      address, 
      network = 'fuji',
      pythonSource,
      contractName,
      abi,
      bytecode
    } = body

    // Validate required fields
    if (!address || !pythonSource || !contractName) {
      return NextResponse.json({
        success: false,
        message: 'Missing required fields: address, pythonSource, contractName'
      }, { status: 400 })
    }

    // If ABI not provided, return error with helpful message
    if (!abi || abi.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'ABI is required for manual verification. Please provide the ABI from your compilation.',
        hint: 'Copy the ABI from the IDE console after compiling your contract'
      }, { status: 400 })
    }

    console.log(`[Manual Verify] Verifying ${address} on ${network}`)
    console.log(`[Manual Verify] Contract: ${contractName}`)
    console.log(`[Manual Verify] ABI functions: ${abi.length}`)

    // Call verification with all data
    const result = await verifyPythonContract({
      address,
      network,
      pythonSource,
      contractName,
      compilerVersion: 'pyvax-transpiler-2.0.0',
      abi,
      bytecode: bytecode || '0x'
    })

    return NextResponse.json(result)

  } catch (error: any) {
    console.error('[Manual Verify] Error:', error)
    return NextResponse.json({
      success: false,
      message: 'Manual verification failed',
      error: error.message
    }, { status: 500 })
  }
}

// GET endpoint to check verification status
export async function GET(request: NextRequest) {
  const address = request.nextUrl.searchParams.get('address')
  const network = request.nextUrl.searchParams.get('network') || 'fuji'

  if (!address) {
    return NextResponse.json({
      success: false,
      message: 'Missing address parameter'
    }, { status: 400 })
  }

  try {
    const { getVerifiedContract } = await import('@/lib/verification/verifier')
    const contract = await getVerifiedContract(address, network)

    if (!contract) {
      return NextResponse.json({
        success: false,
        verified: false,
        message: 'Contract not found or not verified'
      })
    }

    return NextResponse.json({
      success: true,
      verified: contract.verified,
      contract: {
        address: contract.address,
        network: contract.network,
        contractName: contract.contractName,
        verified: contract.verified,
        verifiedAt: contract.verifiedAt,
        hasAbi: contract.abi && contract.abi.length > 0,
        abiLength: contract.abi?.length || 0
      }
    })

  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: 'Error checking verification status',
      error: error.message
    }, { status: 500 })
  }
}
