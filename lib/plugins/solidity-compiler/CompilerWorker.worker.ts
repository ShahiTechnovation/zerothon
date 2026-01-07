// Solidity Compiler Web Worker
// @ts-ignore
import * as solc from 'solc'

// Cache for loaded compiler versions
const compilerCache = new Map<string, any>()

self.addEventListener('message', async (e: MessageEvent) => {
  const { type, data } = e.data

  switch (type) {
    case 'COMPILE':
      await compileSolidity(data)
      break
    case 'LOAD_VERSION':
      await loadCompilerVersion(data.version)
      break
  }
})

async function loadCompilerVersion(version: string): Promise<void> {
  if (compilerCache.has(version)) {
    self.postMessage({
      type: 'VERSION_LOADED',
      version
    })
    return
  }

  try {
    self.postMessage({
      type: 'VERSION_LOADING',
      version
    })

    // Use the built-in solc compiler
    const compiler = solc
    compilerCache.set(version, compiler)

    self.postMessage({
      type: 'VERSION_LOADED',
      version
    })
  } catch (error: any) {
    self.postMessage({
      type: 'VERSION_LOAD_ERROR',
      error: error.message
    })
  }
}

async function compileSolidity(data: { source: string; fileName: string; version: string }): Promise<void> {
  try {
    let compiler = compilerCache.get(data.version)

    if (!compiler) {
      await loadCompilerVersion(data.version)
      compiler = compilerCache.get(data.version)
    }

    if (!compiler) {
      throw new Error('Compiler not loaded')
    }

    self.postMessage({
      type: 'COMPILE_PROGRESS',
      message: 'Resolving imports...'
    })

    // Resolve all imports recursively
    const sources: Record<string, { content: string }> = {}
    try {
      // Start with the main file. No base URL for the root file.
      await resolveImports(data.fileName, data.source, sources, '')
    } catch (err: any) {
      console.error('Import resolution error:', err)
      throw new Error(`Failed to resolve imports: ${err.message}`)
    }

    self.postMessage({
      type: 'COMPILE_PROGRESS',
      message: 'Compiling...'
    })

    const input = {
      language: 'Solidity',
      sources,
      settings: {
        optimizer: {
          enabled: true,
          runs: 200
        },
        outputSelection: {
          '*': {
            '*': [
              'abi',
              'evm.bytecode',
              'evm.deployedBytecode',
              'evm.gasEstimates',
              'metadata'
            ],
            '': ['ast']
          }
        }
      }
    }

    const output = JSON.parse(compiler.compile(JSON.stringify(input)))

    if (output.errors) {
      const errors = output.errors.filter((e: any) => e.severity === 'error')
      const warnings = output.errors.filter((e: any) => e.severity === 'warning')

      if (errors.length > 0) {
        self.postMessage({
          type: 'COMPILE_ERROR',
          errors,
          warnings
        })
        return
      }
    }

    // Extract compiled contracts
    const contracts = []
    for (const file in output.contracts) {
      for (const contractName in output.contracts[file]) {
        const contract = output.contracts[file][contractName]
        contracts.push({
          name: contractName,
          abi: contract.abi,
          bytecode: contract.evm.bytecode.object,
          deployedBytecode: contract.evm.deployedBytecode.object,
          gasEstimates: contract.evm.gasEstimates,
          metadata: contract.metadata
        })
      }
    }

    self.postMessage({
      type: 'COMPILE_SUCCESS',
      contracts,
      warnings: output.errors || []
    })

  } catch (error: any) {
    self.postMessage({
      type: 'COMPILE_ERROR',
      error: error.message
    })
  }
}

// Regex to find import statements
// Supports:
// import "path";
// import { symbol } from "path";
// import * as name from "path";
// import "path" as name;
const IMPORT_REGEX = /import\s+(?:(?:{[^}]+}|(?:\*|[\w]+)(?:\s+as\s+[\w]+)?)\s+from\s+)?["']([^"']+)["'];?/g

async function resolveImports(
  logicalPath: string,
  content: string,
  sources: Record<string, { content: string }>,
  currentUrl: string
) {
  // Store the content at the logical path used by solc
  sources[logicalPath] = { content }

  const matches = []
  let match
  IMPORT_REGEX.lastIndex = 0

  while ((match = IMPORT_REGEX.exec(content)) !== null) {
    matches.push(match[1])
  }

  for (const importPath of matches) {
    let resolvedLogicalPath = importPath
    let resolvedUrl = ''

    if (importPath.startsWith('.')) {
      // Relative import (e.g. "./IBEP20.sol", "../Utils.sol")
      if (!currentUrl) {
        console.warn(`[Resolve] Relative import '${importPath}' found in '${logicalPath}' but no base URL context. Skipping.`)
        continue
      }

      // Resolve absolute URL for fetching by resolving relative to parent directory
      // URL constructor handles ../ and ./ correctly if base ends with /
      const parentDir = currentUrl.substring(0, currentUrl.lastIndexOf('/') + 1)
      try {
        resolvedUrl = new URL(importPath, parentDir).href
      } catch (e) {
        console.error(`[Resolve] Invalid URL resolution: ${importPath} relative to ${parentDir}`)
        continue
      }

      // Resolve logical path for solc keys
      // e.g. parent "contracts/token/Token.sol", import "./IERC20.sol" -> "contracts/token/IERC20.sol"
      const parentLogicalDir = logicalPath.substring(0, logicalPath.lastIndexOf('/') + 1)
      resolvedLogicalPath = simplePathJoin(parentLogicalDir, importPath)

    } else {
      // Absolute / Package import (e.g. "@openzeppelin/contracts/...")
      if (importPath.startsWith('http')) {
        resolvedUrl = importPath
        resolvedLogicalPath = importPath
      } else {
        // Map package to CDN (unpkg)
        // e.g. @openzeppelin/contracts/access/Ownable.sol
        resolvedUrl = `https://unpkg.com/${importPath}`
        resolvedLogicalPath = importPath
      }
    }

    // Check if already resolved to avoid infinite loops
    if (sources[resolvedLogicalPath]) continue

    try {
      const fetchedContent = await fetchUrlContent(resolvedUrl)
      await resolveImports(resolvedLogicalPath, fetchedContent, sources, resolvedUrl)
    } catch (e) {
      console.warn(`[Resolve] Failed to resolve import '${importPath}' (Url: ${resolvedUrl}):`, e)
    }
  }
}

async function fetchUrlContent(url: string): Promise<string> {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Fetch failed: ${response.status} ${response.statusText}`)
  }
  return await response.text()
}

function simplePathJoin(baseDir: string, relativePath: string): string {
  // split baseDir by /
  const parts = baseDir.split('/')
  // remove empty trailing part if exists (e.g. "a/b/" -> ["a", "b", ""])
  if (parts.length > 0 && parts[parts.length - 1] === '') parts.pop()

  const relParts = relativePath.split('/')
  for (const p of relParts) {
    if (p === '.' || p === '') continue
    if (p === '..') {
      if (parts.length > 0) parts.pop()
    } else {
      parts.push(p)
    }
  }
  return parts.join('/')
}

export { }
