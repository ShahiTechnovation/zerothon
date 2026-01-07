/**
 * Smart Compiler - Automatically chooses best compilation method
 * Supports: Browser (Pyodide), Transpiler, or API
 * 
 * IMPORTANT: Uses dynamic imports to avoid SSR issues with Pyodide
 */

import { transpilePythonToSolidity } from './simple-python-transpiler'
import { compilePythonNative } from './python-native-compiler'

export type CompilerMode = 'browser' | 'transpiler' | 'api' | 'auto'

export interface SmartCompileResult {
  success: boolean
  bytecode?: string
  abi?: any[]
  solidity?: string
  compiler?: string
  mode?: CompilerMode
  errors?: string[]
  metadata?: any
}

/**
 * Analyze Python code complexity
 */
function analyzeComplexity(code: string): 'simple' | 'complex' {
  // Check for complex features
  const hasInheritance = /class\s+\w+\([^)]+\)/.test(code)
  const hasDecorators = code.includes('@')
  const hasComplexTypes = /List\[|Dict\[|Tuple\[|Optional\[/.test(code)
  const hasImports = code.includes('import ') || code.includes('from ')
  const hasMultipleClasses = (code.match(/class\s+\w+/g) || []).length > 1

  return (hasInheritance || hasComplexTypes || hasImports || hasMultipleClasses)
    ? 'complex'
    : 'simple'
}

/**
 * Smart compile - automatically chooses best method
 */
export async function smartCompile(
  pythonCode: string,
  preferredMode: CompilerMode = 'auto'
): Promise<SmartCompileResult> {
  const complexity = analyzeComplexity(pythonCode)

  // Auto mode - choose based on availability and complexity
  if (preferredMode === 'auto') {
    // Prioritize API compiler (most reliable) if Python service is running
    // Try API first, then browser, then transpiler
    preferredMode = 'api'  // Always try API first for best results
  }

  // Try preferred mode
  try {
    switch (preferredMode) {
      case 'browser':
        return await compileBrowser(pythonCode)

      case 'transpiler':
        return await compileTranspiler(pythonCode)

      case 'api':
        return await compileAPI(pythonCode)

      default:
        throw new Error('Invalid compiler mode')
    }
  } catch (error: any) {
    // Fallback logic
    console.error(`[Smart Compiler] ${preferredMode} failed:`, error)

    // Check if we should stop here
    if (preferredMode === 'api' && error.message.includes('API compiler unavailable')) {
      // Try checking browser compiler
    }

    console.warn(`[Smart Compiler] Attempting fallback from ${preferredMode}...`)

    if (preferredMode === 'api') {
      // API failed, try browser
      try {
        const browserCompiler = await import('./browser-python-compiler')
        if (await browserCompiler.isPyodideReady()) {
          return await compileBrowser(pythonCode)
        } else {
          // Try initializing Pyodide on the fly
          await browserCompiler.initPyodide()
          return await compileBrowser(pythonCode)
        }
      } catch (browserError) {
        console.error('[Smart Compiler] Browser fallback failed:', browserError)
        return await compileTranspiler(pythonCode)
      }
    } else if (preferredMode === 'browser') {
      // Browser failed, try transpiler
      return await compileTranspiler(pythonCode)
    } else {
      // Transpiler failed (last resort)
      throw error
    }
  }
}

/**
 * Compile using browser (Pyodide)
 */
async function compileBrowser(pythonCode: string): Promise<SmartCompileResult> {
  console.log('[Smart Compiler] Using browser compiler (Pyodide)')

  const browserCompiler = await import('./browser-python-compiler')
  const result = await browserCompiler.compilePythonInBrowser(pythonCode)

  return {
    ...result,
    compiler: 'pyodide-browser',
    mode: 'browser',
  }
}

/**
 * Compile using transpiler
 */
async function compileTranspiler(pythonCode: string): Promise<SmartCompileResult> {
  console.log('[Smart Compiler] Using transpiler')

  const result = await transpilePythonToSolidity(pythonCode)

  return {
    success: !!result.bytecode,
    bytecode: result.bytecode,
    abi: result.abi,
    solidity: result.solidity,
    compiler: 'js-transpiler',
    mode: 'transpiler',
    errors: result.errors,
  }
}

/**
 * Compile using API
 */
async function compileAPI(pythonCode: string): Promise<SmartCompileResult> {
  console.log('[Smart Compiler] Using API compiler')

  try {
    const result = await compilePythonNative(pythonCode)

    return {
      success: result.success,
      bytecode: result.bytecode,
      abi: result.abi,
      compiler: 'python-native-api',
      mode: 'api',
      errors: result.errors,
      metadata: result.metadata,
    }
  } catch (error: any) {
    // API unavailable - Throw to trigger fallback in smartCompile
    throw new Error('API compiler unavailable');
  }
}

/**
 * Initialize Pyodide in background (call on app start)
 */
export async function warmupBrowserCompiler(): Promise<void> {
  try {
    const browserCompiler = await import('./browser-python-compiler')
    if (!browserCompiler.isPyodideReady()) {
      console.log('[Smart Compiler] Warming up browser compiler...')
      await browserCompiler.initPyodide()
      console.log('[Smart Compiler] Browser compiler ready!')
    }
  } catch (error) {
    console.warn('[Smart Compiler] Browser compiler warmup failed:', error)
  }
}

/**
 * Get recommended compiler mode
 */
export async function getRecommendedMode(pythonCode: string): Promise<CompilerMode> {
  const complexity = analyzeComplexity(pythonCode)

  try {
    const browserCompiler = await import('./browser-python-compiler')
    if (browserCompiler.isPyodideReady()) {
      return 'browser' // Pyodide ready, use it
    }
  } catch {
    // Browser compiler not available
  }

  if (complexity === 'simple') {
    return 'transpiler' // Simple code, transpiler is fast
  } else {
    return 'api' // Complex code, need full compiler
  }
}

/**
 * Get compiler status
 */
export async function getCompilerStatus() {
  let browserAvailable = false

  try {
    const browserCompiler = await import('./browser-python-compiler')
    browserAvailable = browserCompiler.isPyodideReady()
  } catch {
    // Browser compiler not available
  }

  return {
    browser: {
      available: browserAvailable,
      name: 'Pyodide (Browser)',
      description: 'Full Python in WebAssembly',
    },
    transpiler: {
      available: true,
      name: 'JS Transpiler',
      description: 'Fast, lightweight',
    },
    api: {
      available: true, // Check will happen on use
      name: 'API Compiler',
      description: 'Server-side Python',
    },
  }
}
