/**
 * Advanced Python to Solidity Transpiler
 * Enhanced version with better parsing and code generation
 */

export interface TranspileResult {
  success: boolean
  solidity?: string
  bytecode?: string
  abi?: any[]
  errors?: string[]
  warnings?: string[]
  metadata?: {
    contractName: string
    compiler: string
    version: string
    optimization: boolean
  }
}

interface StateVariable {
  name: string
  type: string
  visibility: 'public' | 'private' | 'internal'
  value?: string
}

interface Function {
  name: string
  params: Parameter[]
  returns?: string
  visibility: 'public' | 'private' | 'internal' | 'external'
  modifiers: string[]
  body: string
  isView: boolean
  isPure: boolean
  isPayable: boolean
}

interface Parameter {
  name: string
  type: string
}

interface Event {
  name: string
  params: Parameter[]
}

export class AdvancedPythonTranspiler {
  private contractName: string = 'Contract'
  private stateVars: StateVariable[] = []
  private functions: Function[] = []
  private events: Event[] = []
  private imports: Set<string> = new Set()
  private errors: string[] = []
  private warnings: string[] = []

  transpile(pythonCode: string): TranspileResult {
    try {
      // Reset state
      this.reset()

      // Parse Python code
      this.parsePython(pythonCode)

      // Validate
      this.validate()

      // Generate Solidity
      const solidity = this.generateSolidity()

      return {
        success: true,
        solidity,
        errors: this.errors.length > 0 ? this.errors : undefined,
        warnings: this.warnings.length > 0 ? this.warnings : undefined,
        metadata: {
          contractName: this.contractName,
          compiler: 'pyvax-transpiler',
          version: '2.0.0',
          optimization: true,
        },
      }
    } catch (error) {
      return {
        success: false,
        errors: [error instanceof Error ? error.message : 'Transpilation failed'],
      }
    }
  }

  private reset() {
    this.contractName = 'Contract'
    this.stateVars = []
    this.functions = []
    this.events = []
    this.imports = new Set()
    this.errors = []
    this.warnings = []
  }

  private parsePython(code: string) {
    const lines = code.split('\n')
    let currentContext: 'class' | 'function' | 'none' = 'none'
    let currentFunction: Partial<Function> | null = null
    let functionBody: string[] = []
    let indentLevel = 0

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      const trimmed = line.trim()

      // Skip empty lines and comments
      if (!trimmed || trimmed.startsWith('#')) continue

      // Detect indent level
      const currentIndent = line.search(/\S/)

      // Parse imports
      if (trimmed.startsWith('from ') || trimmed.startsWith('import ')) {
        this.parseImport(trimmed)
        continue
      }

      // Parse class definition
      if (trimmed.startsWith('class ')) {
        this.parseClass(trimmed)
        currentContext = 'class'
        continue
      }

      // Parse decorators
      if (trimmed.startsWith('@')) {
        const decorator = trimmed.slice(1)
        if (decorator === 'contract') {
          // @contract decorator - next line is class definition
          continue
        }
        if (decorator === 'event') {
          // Next line should be event definition
          const nextLine = lines[i + 1]?.trim()
          if (nextLine?.startsWith('def ')) {
            this.parseEvent(nextLine)
            i++ // Skip next line
          }
        }
        continue
      }

      // Parse class-level state variables (PyVax syntax)
      if (currentContext === 'class' && currentIndent > 0 && trimmed.includes(':')) {
        // Check if this is a type annotation (state variable declaration)
        // Format: variable_name: type
        // or: variable_name: type = value
        const stateVarMatch = trimmed.match(/^(\w+)\s*:\s*(.+?)(?:\s*=\s*(.+))?$/)
        if (stateVarMatch && !trimmed.startsWith('def ') && !trimmed.startsWith('@')) {
          const [, name, typeStr, value] = stateVarMatch
          const type = this.pythonTypeToSolidity(typeStr.trim())
          this.stateVars.push({
            name,
            type,
            visibility: 'public',
            value: value?.trim(),
          })
          continue
        }
      }

      // Parse function definition
      if (trimmed.startsWith('def ')) {
        // Save previous function
        if (currentFunction) {
          currentFunction.body = this.processFunctionBody(functionBody)
          if (currentFunction.name !== '__init__') {
            this.functions.push(currentFunction as Function)
          }
          functionBody = []
        }

        currentFunction = this.parseFunction(trimmed, lines, i)
        currentContext = 'function'
        indentLevel = currentIndent
        continue
      }

      // Parse state variables (in __init__)
      if (currentContext === 'function' && currentFunction?.name === '__init__') {
        if (trimmed.startsWith('self.')) {
          const stateVar = this.parseStateVariable(trimmed)
          if (stateVar) {
            this.stateVars.push(stateVar)
          }
        }
      }

      // Collect function body
      if (currentContext === 'function' && currentIndent > indentLevel) {
        functionBody.push(line.substring(indentLevel + 4))
      }
    }

    // Save last function
    if (currentFunction && currentFunction.name !== '__init__') {
      currentFunction.body = this.processFunctionBody(functionBody)
      this.functions.push(currentFunction as Function)
    }
  }

  private parseImport(line: string) {
    // Track imports for later use
    this.imports.add(line)
  }

  private parseClass(line: string) {
    const match = line.match(/class\s+(\w+)(?:\((.*?)\))?:/)
    if (match) {
      this.contractName = match[1]
      if (match[2]) {
        // Parse inheritance
        const parents = match[2].split(',').map(p => p.trim())
        parents.forEach(parent => {
          if (parent && !['object', 'PySmartContract'].includes(parent)) {
            this.imports.add(parent)
          }
        })
      }
    }
  }

  private parseEvent(line: string): void {
    const match = line.match(/def\s+(\w+)\s*\((.*?)\)/)
    if (match) {
      const name = match[1]
      const params = this.parseParameters(match[2])
      this.events.push({ name, params })
    }
  }

  private parseFunction(line: string, lines: string[], index: number): Partial<Function> {
    const match = line.match(/def\s+(\w+)\s*\((.*?)\)(?:\s*->\s*(.+?))?:/)
    if (!match) return {}

    const name = match[1]
    const paramsStr = match[2]
    const returnType = match[3]?.trim()

    // Parse parameters
    const params = this.parseParameters(paramsStr)

    // Detect modifiers from docstring or decorators
    const modifiers: string[] = []
    let isView = false
    let isPure = false
    let isPayable = false
    let visibility: 'public' | 'private' | 'internal' | 'external' = 'public'

    // Check previous lines for decorators
    for (let i = index - 1; i >= 0; i--) {
      const prevLine = lines[i].trim()
      if (!prevLine.startsWith('@')) break
      
      const decorator = prevLine.slice(1)
      if (decorator === 'view' || decorator === 'view_function') isView = true
      if (decorator === 'pure') isPure = true
      if (decorator === 'payable') isPayable = true
      if (decorator === 'public' || decorator === 'public_function') visibility = 'public'
      if (decorator === 'private' || decorator === 'private_function') visibility = 'private'
      if (decorator === 'internal') visibility = 'internal'
      if (decorator === 'external') visibility = 'external'
      if (decorator.startsWith('modifier')) modifiers.push(decorator)
    }

    return {
      name,
      params,
      returns: returnType ? this.pythonTypeToSolidity(returnType) : undefined,
      visibility,
      modifiers,
      body: '',
      isView,
      isPure,
      isPayable,
    }
  }

  private parseParameters(paramsStr: string): Parameter[] {
    if (!paramsStr || paramsStr === 'self') return []

    return paramsStr
      .split(',')
      .map(p => p.trim())
      .filter(p => p && p !== 'self')
      .map(p => {
        if (p.includes(':')) {
          const [name, type] = p.split(':').map(s => s.trim())
          return {
            name,
            type: this.pythonTypeToSolidity(type),
          }
        }
        return { name: p, type: 'uint256' }
      })
  }

  private parseStateVariable(line: string): StateVariable | null {
    // Parse: self.varName: type = value
    const match = line.match(/self\.(\w+)\s*:\s*(\w+)(?:\s*=\s*(.+))?/)
    if (match) {
      return {
        name: match[1],
        type: this.pythonTypeToSolidity(match[2]),
        visibility: 'public',
        value: match[3]?.trim(),
      }
    }

    // Parse: self.varName = value
    const simpleMatch = line.match(/self\.(\w+)\s*=\s*(.+)/)
    if (simpleMatch) {
      return {
        name: simpleMatch[1],
        type: this.inferType(simpleMatch[2]),
        visibility: 'public',
        value: simpleMatch[2].trim(),
      }
    }

    return null
  }

  private pythonTypeToSolidity(pyType: string): string {
    const typeMap: Record<string, string> = {
      'int': 'uint256',
      'str': 'string',
      'bool': 'bool',
      'address': 'address',
      'bytes': 'bytes',
      'uint256': 'uint256',
      'uint': 'uint256',
      'uint8': 'uint8',
      'uint16': 'uint16',
      'uint32': 'uint32',
      'uint64': 'uint64',
      'uint128': 'uint128',
      'int256': 'int256',
      'bytes32': 'bytes32',
    }

    // Handle mapping types - both mapping[...] and mapping(...)
    if (pyType.startsWith('mapping[') || pyType.startsWith('dict[')) {
      const innerMatch = pyType.match(/\[(.*?),\s*(.*?)\]/)
      if (innerMatch) {
        const keyType = this.pythonTypeToSolidity(innerMatch[1].trim())
        const valueType = this.pythonTypeToSolidity(innerMatch[2].trim())
        return `mapping(${keyType} => ${valueType})`
      }
    }
    
    if (pyType.startsWith('mapping(')) {
      const innerMatch = pyType.match(/\((.*?),\s*(.*?)\)/)
      if (innerMatch) {
        const keyType = this.pythonTypeToSolidity(innerMatch[1].trim())
        const valueType = this.pythonTypeToSolidity(innerMatch[2].trim())
        return `mapping(${keyType} => ${valueType})`
      }
    }

    // Handle array types
    if (pyType.startsWith('list[') || pyType.startsWith('List[')) {
      const innerMatch = pyType.match(/\[(.*?)\]/)
      if (innerMatch) {
        const elementType = this.pythonTypeToSolidity(innerMatch[1].trim())
        return `${elementType}[]`
      }
    }

    return typeMap[pyType] || 'uint256'
  }

  private inferType(value: string): string {
    value = value.trim()
    if (value === 'True' || value === 'False') return 'bool'
    if (value.startsWith('"') || value.startsWith("'")) return 'string'
    if (value.startsWith('0x')) return 'address'
    if (!isNaN(Number(value))) return 'uint256'
    if (value === '{}') return 'mapping(address => uint256)'
    if (value === '[]') return 'uint256[]'
    return 'uint256'
  }

  private processFunctionBody(lines: string[]): string {
    return lines
      .map(line => {
        let processed = line
        // Convert self.var to var
        processed = processed.replace(/self\./g, '')
        // Convert Python operators
        processed = processed.replace(/\band\b/g, '&&')
        processed = processed.replace(/\bor\b/g, '||')
        processed = processed.replace(/\bnot\b/g, '!')
        // Convert require statements
        processed = processed.replace(/require\((.*?),\s*"(.*?)"\)/g, 'require($1, "$2")')
        return processed
      })
      .join('\n')
  }

  private validate() {
    // Check for required elements
    if (this.functions.length === 0) {
      this.warnings.push('No functions defined in contract')
    }

    // Check for security issues
    this.functions.forEach(func => {
      if (func.isPayable && !func.modifiers.includes('nonReentrant')) {
        this.warnings.push(`Function ${func.name} is payable but doesn't have reentrancy protection`)
      }
    })
  }

  private generateSolidity(): string {
    const lines: string[] = []

    // SPDX and pragma
    lines.push('// SPDX-License-Identifier: MIT')
    lines.push('pragma solidity ^0.8.20;')
    lines.push('')

    // Imports
    lines.push('import "@openzeppelin/contracts/access/Ownable.sol";')
    lines.push('import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";')
    lines.push('import "@openzeppelin/contracts/utils/Pausable.sol";')
    lines.push('')

    // Contract documentation
    lines.push('/**')
    lines.push(` * @title ${this.contractName}`)
    lines.push(' * @dev Transpiled from Python using PyVax Advanced Transpiler')
    lines.push(' * @custom:security-contact security@pyvax.io')
    lines.push(' */')
    lines.push(`contract ${this.contractName} is Ownable, ReentrancyGuard, Pausable {`)
    lines.push('')

    // State variables
    if (this.stateVars.length > 0) {
      lines.push('    // State Variables')
      this.stateVars.forEach(v => {
        const value = v.value ? ` = ${this.convertValue(v.value, v.type)}` : ''
        lines.push(`    ${v.type} ${v.visibility} ${v.name}${value};`)
      })
      lines.push('')
    }

    // Events
    if (this.events.length > 0) {
      lines.push('    // Events')
      this.events.forEach(e => {
        const params = e.params.map(p => `${p.type} ${p.name}`).join(', ')
        lines.push(`    event ${e.name}(${params});`)
      })
      lines.push('')
    }

    // Constructor
    lines.push('    /**')
    lines.push('     * @dev Contract constructor')
    lines.push('     */')
    lines.push('    constructor() Ownable(msg.sender) {')
    lines.push('        // Initialize contract')
    lines.push('    }')
    lines.push('')

    // Functions
    if (this.functions.length > 0) {
      lines.push('    // Functions')
      this.functions.forEach(f => {
        lines.push('    /**')
        lines.push(`     * @dev ${f.name}`)
        f.params.forEach(p => {
          lines.push(`     * @param ${p.name} ${p.type}`)
        })
        if (f.returns) {
          lines.push(`     * @return ${f.returns}`)
        }
        lines.push('     */')

        const params = f.params.map(p => `${p.type} ${p.name}`).join(', ')
        const modifiers = [...f.modifiers]
        if (f.isView) modifiers.push('view')
        if (f.isPure) modifiers.push('pure')
        if (f.isPayable) modifiers.push('payable')
        
        const modifierStr = modifiers.length > 0 ? ' ' + modifiers.join(' ') : ''
        const returnsStr = f.returns ? ` returns (${f.returns})` : ''

        lines.push(`    function ${f.name}(${params}) ${f.visibility}${modifierStr}${returnsStr} {`)
        
        if (f.body.trim()) {
          f.body.split('\n').forEach(line => {
            if (line.trim()) {
              lines.push(`        ${line}`)
            }
          })
        } else {
          lines.push('        // TODO: Implement function logic')
          if (f.returns) {
            const defaultReturn = this.getDefaultReturn(f.returns)
            lines.push(`        return ${defaultReturn};`)
          }
        }
        
        lines.push('    }')
        lines.push('')
      })
    }

    // Emergency functions
    lines.push('    // Emergency Functions')
    lines.push('    function pause() external onlyOwner {')
    lines.push('        _pause();')
    lines.push('    }')
    lines.push('')
    lines.push('    function unpause() external onlyOwner {')
    lines.push('        _unpause();')
    lines.push('    }')
    lines.push('}')

    return lines.join('\n')
  }

  private convertValue(value: string, type: string): string {
    if (type === 'bool') {
      return value === 'True' ? 'true' : 'false'
    }
    if (type === 'string') {
      return value
    }
    if (value === 'msg.sender') {
      return 'msg.sender'
    }
    if (value === '{}' || value === '[]') {
      return '' // Will be initialized in constructor
    }
    return value
  }

  private getDefaultReturn(type: string): string {
    if (type === 'bool') return 'false'
    if (type === 'string') return '""'
    if (type === 'address') return 'address(0)'
    if (type.includes('[]')) return 'new ' + type + '(0)'
    return '0'
  }
}

// Export singleton
export const advancedTranspiler = new AdvancedPythonTranspiler()
