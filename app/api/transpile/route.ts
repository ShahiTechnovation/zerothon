import { NextRequest, NextResponse } from 'next/server'
import { advancedTranspiler } from '@/lib/transpiler/advanced-transpiler'
import solc from 'solc'

interface TranspileRequest {
  source: string
  contractName?: string
  compile?: boolean
}

export async function POST(request: NextRequest) {
  try {
    const body: TranspileRequest = await request.json()
    const { source, contractName = 'Contract', compile = true } = body

    if (!source) {
      return NextResponse.json(
        { 
          success: false, 
          errors: ['No source code provided'] 
        },
        { status: 400 }
      )
    }

    // Transpile Python to Solidity
    const transpileResult = advancedTranspiler.transpile(source)

    if (!transpileResult.success || !transpileResult.solidity) {
      return NextResponse.json(transpileResult, { status: 400 })
    }

    // Compile Solidity if requested
    if (compile) {
      try {
        const input = {
          language: 'Solidity',
          sources: {
            'Contract.sol': {
              content: transpileResult.solidity
            }
          },
          settings: {
            outputSelection: {
              '*': {
                '*': ['abi', 'evm.bytecode', 'evm.deployedBytecode']
              }
            },
            optimizer: {
              enabled: true,
              runs: 200
            }
          }
        }

        const output = JSON.parse(solc.compile(JSON.stringify(input)))

        if (output.errors) {
          const errors = output.errors.filter((e: any) => e.severity === 'error')
          if (errors.length > 0) {
            return NextResponse.json({
              success: false,
              solidity: transpileResult.solidity,
              errors: errors.map((e: any) => e.formattedMessage),
              warnings: transpileResult.warnings
            }, { status: 400 })
          }
        }

        const contractOutput = output.contracts['Contract.sol'][transpileResult.metadata?.contractName || 'Contract']

        return NextResponse.json({
          success: true,
          solidity: transpileResult.solidity,
          bytecode: contractOutput.evm.bytecode.object,
          abi: contractOutput.abi,
          metadata: transpileResult.metadata,
          warnings: transpileResult.warnings
        })

      } catch (compileError) {
        return NextResponse.json({
          success: true,
          solidity: transpileResult.solidity,
          metadata: transpileResult.metadata,
          warnings: [...(transpileResult.warnings || []), 'Compilation skipped: ' + (compileError instanceof Error ? compileError.message : 'Unknown error')]
        })
      }
    }

    return NextResponse.json(transpileResult)

  } catch (error) {
    console.error('Transpilation error:', error)
    return NextResponse.json(
      {
        success: false,
        errors: [error instanceof Error ? error.message : 'Transpilation failed']
      },
      { status: 500 }
    )
  }
}
