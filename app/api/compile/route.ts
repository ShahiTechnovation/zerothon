import { NextRequest, NextResponse } from 'next/server'
import solc from 'solc'
import fs from 'fs'
import path from 'path'

interface CompileRequest {
  source: string
  contractName?: string
}

export async function POST(request: NextRequest) {
  try {
    const body: CompileRequest = await request.json()
    const { source, contractName = 'Contract' } = body

    if (!source) {
      return NextResponse.json(
        { success: false, errors: ['No source code provided'] },
        { status: 400 }
      )
    }

    const input = {
      language: 'Solidity',
      sources: {
        'Contract.sol': {
          content: source,
        },
      },
      settings: {
        optimizer: {
          enabled: true,
          runs: 200,
        },
        outputSelection: {
          '*': {
            '*': ['abi', 'evm.bytecode', 'evm.deployedBytecode', 'evm.gasEstimates'],
          },
        },
      },
    }

    const findImports = (importPath: string): { contents?: string; error?: string } => {
      try {
        const resolvedPath = require.resolve(importPath, {
          paths: [process.cwd(), path.join(process.cwd(), 'node_modules')],
        })
        const contents = fs.readFileSync(resolvedPath, 'utf8')
        return { contents }
      } catch (err: any) {
        return { error: `File not found: ${importPath}` }
      }
    }

    const outputRaw = solc.compile(JSON.stringify(input), { import: findImports })
    const output = JSON.parse(outputRaw)

    const compilationErrors = (output.errors || []).filter((e: any) => e.severity === 'error')
    const compilationWarnings = (output.errors || []).filter((e: any) => e.severity === 'warning')

    if (compilationErrors.length > 0) {
      return NextResponse.json({
        success: false,
        errors: compilationErrors.map((e: any) => ({
          severity: 'error' as const,
          message: e.message,
          formattedMessage: e.formattedMessage || e.message,
        })),
      })
    }

    const contracts: any = {}
    const compiledContracts = output.contracts['Contract.sol'] || {}

    const selectedName =
      compiledContracts[contractName] != null
        ? contractName
        : Object.keys(compiledContracts)[0]

    if (!selectedName) {
      return NextResponse.json({
        success: false,
        errors: [{
          severity: 'error' as const,
          message: 'No contracts compiled',
          formattedMessage: 'No contracts compiled',
        }],
      })
    }

    const contractOutput = compiledContracts[selectedName]
    const abi = contractOutput.abi || []
    const bytecode = '0x' + (contractOutput.evm?.bytecode?.object || '')
    const deployedBytecode = '0x' + (contractOutput.evm?.deployedBytecode?.object || '')
    const gasEstimates = contractOutput.evm?.gasEstimates || {}

    contracts[selectedName] = {
      abi,
      bytecode,
      deployedBytecode,
      gasEstimates,
    }

    return NextResponse.json({
      success: true,
      contracts,
      warnings:
        compilationWarnings.length > 0
          ? compilationWarnings.map((w: any) => ({
              severity: 'warning',
              message: w.message,
              formattedMessage: w.formattedMessage || w.message,
            }))
          : undefined,
    })
  } catch (error) {
    console.error('Compilation error:', error)
    return NextResponse.json(
      {
        success: false,
        errors: [
          {
            severity: 'error' as const,
            message: error instanceof Error ? error.message : 'Compilation failed',
            formattedMessage: error instanceof Error ? error.message : 'Compilation failed',
          },
        ],
      },
      { status: 500 }
    )
  }
}

// Helper function to extract function signatures for mock ABI
function extractMockABI(source: string): any[] {
  const abi: any[] = []
  
  // Extract constructor
  if (source.includes('constructor(')) {
    abi.push({
      type: 'constructor',
      inputs: [],
      stateMutability: 'nonpayable'
    })
  }

  // Extract functions
  const functionRegex = /function\s+(\w+)\s*\((.*?)\)\s*(public|external|internal|private)?\s*(view|pure|payable)?\s*(returns\s*\((.*?)\))?/g
  let match

  while ((match = functionRegex.exec(source)) !== null) {
    const [, name, params, visibility, stateMutability, , returns] = match
    
    // Only include public and external functions
    if (visibility === 'public' || visibility === 'external' || !visibility) {
      abi.push({
        type: 'function',
        name,
        inputs: parseParams(params),
        outputs: returns ? parseParams(returns) : [],
        stateMutability: stateMutability || 'nonpayable'
      })
    }
  }

  // Extract events
  const eventRegex = /event\s+(\w+)\s*\((.*?)\)/g
  while ((match = eventRegex.exec(source)) !== null) {
    const [, name, params] = match
    abi.push({
      type: 'event',
      name,
      inputs: parseParams(params, true)
    })
  }

  return abi
}

function parseParams(paramsStr: string, isEvent: boolean = false): any[] {
  if (!paramsStr.trim()) return []
  
  return paramsStr.split(',').map(param => {
    const parts = param.trim().split(/\s+/)
    const type = parts[0]
    const name = parts[parts.length - 1]
    const indexed = isEvent && param.includes('indexed')
    
    return {
      type,
      name,
      ...(indexed && { indexed: true })
    }
  })
}

// NOTE: extractMockABI is kept for compatibility but no longer used by the
// main compilation path, which relies on solc for accurate ABI generation.
