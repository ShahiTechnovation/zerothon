/**
 * Python Native Compilation API Route
 * Compiles Python smart contracts directly to EVM bytecode using the Python microservice
 */

import { NextRequest, NextResponse } from 'next/server'

interface PythonCompileRequest {
  source: string
  contractName?: string
  optimize?: boolean
}

interface PythonCompileResponse {
  success: boolean
  bytecode: string
  abi: any[]
  metadata: {
    compiler: string
    version: string
    gas_estimate: number
    state_variables: Record<string, number>
    functions: string[]
  }
  compiler: string
  version: string
}

const PYTHON_COMPILER_URL = process.env.PYTHON_COMPILER_URL || 'https://zerocli.vercel.app';

export async function POST(request: NextRequest) {
  try {
    const body: PythonCompileRequest = await request.json()
    const { source, contractName = 'Contract', optimize = true } = body

    if (!source) {
      return NextResponse.json(
        {
          success: false,
          errors: ['No source code provided']
        },
        { status: 400 }
      )
    }

    // Call Python compiler microservice
    console.log('[Python Compiler] Calling zerocli API:', PYTHON_COMPILER_URL)
    console.log('[Python Compiler] Request body:', { code: source.substring(0, 100) + '...', contractName, optimize })

    const compilerResponse = await fetch(`${PYTHON_COMPILER_URL}/compile`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        code: source,
        contractName,
        optimize,
      }),
    })

    console.log('[Python Compiler] Response status:', compilerResponse.status)

    if (!compilerResponse.ok) {
      const errorText = await compilerResponse.text()
      console.error('[Python Compiler] Error response:', errorText)

      let errorDetail = 'Compilation failed'
      try {
        const errorJson = JSON.parse(errorText)
        errorDetail = errorJson.detail || errorJson.message || errorText
      } catch {
        errorDetail = errorText
      }

      return NextResponse.json(
        {
          success: false,
          errors: [errorDetail],
        },
        { status: compilerResponse.status }
      )
    }

    const result: PythonCompileResponse = await compilerResponse.json()
    console.log('[Python Compiler] Success! Bytecode length:', result.bytecode?.length)

    return NextResponse.json({
      success: true,
      bytecode: result.bytecode,
      abi: result.abi,
      metadata: result.metadata,
      compiler: 'python-native',
      compilerVersion: result.version,
      native: true,
    })

  } catch (error) {
    console.error('Python compilation error:', error)

    // Check if Python service is unreachable
    if (error instanceof TypeError && error.message.includes('fetch')) {
      return NextResponse.json(
        {
          success: false,
          errors: [
            'Python compiler service is not available. Please ensure the Python microservice is running.',
            `Expected URL: ${PYTHON_COMPILER_URL}`,
            'Run: cd python-compiler-service && python main.py'
          ],
        },
        { status: 503 }
      )
    }

    return NextResponse.json(
      {
        success: false,
        errors: [error instanceof Error ? error.message : 'Unknown compilation error'],
      },
      { status: 500 }
    )
  }
}

// Health check endpoint
export async function GET() {
  try {
    const healthResponse = await fetch(`${PYTHON_COMPILER_URL}/health`, {
      method: 'GET',
    })

    const isHealthy = healthResponse.ok

    return NextResponse.json({
      service: 'python-native-compile',
      compilerUrl: PYTHON_COMPILER_URL,
      compilerStatus: isHealthy ? 'healthy' : 'unhealthy',
      available: isHealthy,
    })
  } catch (error) {
    return NextResponse.json({
      service: 'python-native-compile',
      compilerUrl: PYTHON_COMPILER_URL,
      compilerStatus: 'unreachable',
      available: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    })
  }
}
