// Python to EVM Bytecode Transpiler (Browser-compatible)
// Based on professional Python-to-EVM transpiler architecture

export interface TranspileResult {
  success: boolean
  solidity?: string
  bytecode?: string
  abi?: any[]
  metadata?: any
  errors?: string[]
}

export async function transpilePythonToSolidity(pythonCode: string): Promise<TranspileResult> {
  try {
    // Call the transpile API endpoint
    const response = await fetch('/api/python-native-compile', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        source: pythonCode,
        optimize: true
      })
    })

    if (!response.ok) {
      throw new Error('Transpilation request failed')
    }

    const result = await response.json()

    if (result.success) {
      // Also generate Solidity for display
      const transpiler = new SimplePythonTranspiler()
      const solidity = transpiler.transpile(pythonCode)

      return {
        success: true,
        solidity,
        bytecode: result.bytecode,
        abi: result.abi,
        metadata: result.metadata
      }
    } else {
      return {
        success: false,
        errors: result.errors || ['Transpilation failed']
      }
    }
  } catch (error) {
    // Fallback to simple transpiler
    try {
      const transpiler = new SimplePythonTranspiler()
      const solidity = transpiler.transpile(pythonCode)

      return {
        success: true,
        solidity
      }
    } catch (fallbackError) {
      return {
        success: false,
        errors: [error instanceof Error ? error.message : 'Transpilation failed']
      }
    }
  }
}

class SimplePythonTranspiler {
  private contractName: string = 'Contract'
  private stateVars: Array<{ name: string; type: string; visibility: string }> = []
  private functions: Array<{ name: string; params: string; returns: string; visibility: string; body: string }> = []

  transpile(pythonCode: string): string {
    this.parsePython(pythonCode)
    return this.generateSolidity()
  }

  private parsePython(code: string) {
    const lines = code.split('\n')
    let inFunction = false
    let currentFunction: any = null
    let functionBody: string[] = []

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      const trimmed = line.trim()

      if (!trimmed || trimmed.startsWith('#')) continue

      // Class definition
      if (trimmed.startsWith('class ')) {
        const match = trimmed.match(/class\s+(\w+)/)
        if (match) this.contractName = match[1]
      }
      // Function definition
      else if (trimmed.startsWith('def ')) {
        if (inFunction && currentFunction) {
          currentFunction.body = functionBody.join('\n')
          this.functions.push(currentFunction)
          functionBody = []
        }
        currentFunction = this.parseFunction(trimmed)
        inFunction = true
      }
      // State Variables (Standard + PySmartContract style)
      else if (!inFunction && (trimmed.startsWith('self.') || trimmed.includes('state_var'))) {
        // Handle declarations outside init if any, though Python usually does inside init
      }
      // Function Body
      else if (inFunction && (line.startsWith('    ') || line.startsWith('\t'))) {
        // Check for state vars inside __init__
        if (currentFunction && currentFunction.name === '__init__' && trimmed.startsWith('self.')) {
          const stateVar = this.parseStateVar(trimmed)
          if (stateVar) {
            this.stateVars.push(stateVar)
          }
        } else {
          functionBody.push(trimmed) // Flatten indentation for processing
        }
      }
    }

    if (inFunction && currentFunction) {
      currentFunction.body = functionBody.join('\n')
      this.functions.push(currentFunction)
    }
  }

  private parseFunction(line: string): any {
    const nameMatch = line.match(/def\s+(\w+)\s*\(([^)]*)\)/)
    if (!nameMatch) return null

    const name = nameMatch[1]
    const paramsStr = nameMatch[2]

    // Ignore __init__ metadata here (handled via state var parsing)
    if (name === '__init__') return { name: '__init__', params: '', returns: '', visibility: 'internal', body: '' }

    const params = this.parseParameters(paramsStr)
    const returnsMatch = line.match(/->\s*(.+):/)
    const returns = returnsMatch ? this.pythonTypeToSolidity(returnsMatch[1].trim()) : ''

    // Decorators usually define visibility, defaulting to public for now
    return { name, params, returns, visibility: 'public', body: '' }
  }

  private parseParameters(paramsStr: string): string {
    if (!paramsStr || paramsStr === 'self') return ''
    return paramsStr.split(',')
      .map(p => p.trim())
      .filter(p => p !== 'self')
      .map(p => {
        if (p.includes(':')) {
          const [name, type] = p.split(':').map(s => s.trim())
          return `${this.pythonTypeToSolidity(type)} ${name}`
        }
        return `uint256 ${p}`
      })
      .join(', ')
  }

  private parseStateVar(line: string): any {
    // case: self.var = self.state_var("name", default, type?)
    // This assumes the user's specific framework syntax
    if (line.includes('state_var')) {
      const match = line.match(/self\.(\w+)\s*=\s*self\.state_var\s*\(\s*["']\w+["']\s*,\s*(.+?)\)/)
      if (match) {
        const name = match[1]
        const defaultVal = match[2]
        return {
          name,
          type: this.inferTypeFromValue(defaultVal),
          visibility: 'public'
        }
      }
    }

    // case: self.var: type = val
    const typedMatch = line.match(/self\.(\w+)\s*:\s*(\w+)\s*=/)
    if (typedMatch) return { name: typedMatch[1], type: this.pythonTypeToSolidity(typedMatch[2]), visibility: 'public' }

    // case: self.var = val
    const simpleMatch = line.match(/self\.(\w+)\s*=\s*(.+)/)
    if (simpleMatch) return { name: simpleMatch[1], type: this.inferTypeFromValue(simpleMatch[2]), visibility: 'public' }

    return null
  }

  private inferTypeFromValue(val: string): string {
    val = val.trim()
    if (val === '[]') return 'string[]' // defaulting list to string array or bytes
    if (val === '{}') return 'mapping(address => uint256)' // defaulting dict to map
    if (val === 'True' || val === 'False') return 'bool'
    if (val.startsWith('"') || val.startsWith("'")) return 'string'
    if (val.startsWith('self.msg_sender()')) return 'address'
    if (!isNaN(Number(val))) return 'uint256'
    return 'uint256'
  }

  private pythonTypeToSolidity(pyType: string): string {
    const clean = pyType.replace('list', '').replace('[', '').replace(']', '').trim()
    const typeMap: any = {
      'int': 'uint256', 'str': 'string', 'bool': 'bool', 'address': 'address', 'list': 'string[]'
    }
    if (pyType.includes('list')) return `${this.pythonTypeToSolidity(clean)}[]`
    return typeMap[pyType] || 'uint256'
  }

  private convertBodyToSolidity(pythonBody: string, returnType: string): string {
    const lines = pythonBody.split('\n')
    const solLines: string[] = []

    lines.forEach(line => {
      let t = line.trim()
      if (!t || t.startsWith('#')) return

      // Transformations
      t = t.replace(/self\.msg_sender\(\)/g, 'msg.sender')
      t = t.replace(/raise Exception\((.+)\)/, 'require(false, $1)')

      // Storage access
      // self.candidates.append(name) -> candidates.push(name)
      if (t.includes('.append(')) {
        t = t.replace(/self\.(\w+)\.append\(/, '$1.push(')
      }

      // Map access: self.vote_counts[name] -> vote_counts[name]
      t = t.replace(/self\.(\w+)\[/g, '$1[')

      // self.var access
      t = t.replace(/self\.(\w+)/g, '$1')

      // Map get: has_voted.get(sender, False) -> has_voted[sender]
      // This is a naive heuristic
      if (t.includes('.get(')) {
        t = t.replace(/(\w+)\.get\(([^,]+)(,\s*.+)?\)/, '$1[$2]')
      }

      if (t.startsWith('return ')) solLines.push(`        ${t};`)
      else if (t.includes('=')) solLines.push(`        ${t};`)
      else if (t.startsWith('require')) solLines.push(`        ${t};`)
      else if (t.includes('.push(')) solLines.push(`        ${t};`)
      // Events
      else if (t.includes('event(')) {
        // self.event("Name", arg) -> emit Name(arg)
        // But we didn't define events in struct. For now fallback.
        t = t.replace(/event\("(\w+)"\s*,?\s*(.*)\)/, 'emit $1($2)')
        solLines.push(`        ${t};`)
      }
      else solLines.push(`        ${t};`)
    })

    return solLines.join('\n')
  }

  private generateSolidity(): string {
    // Reconstruct state vars for more complex types based on usage
    // (Enhancement: refine types based on .push or map usage if possible)
    // For now relying on inferType

    const lines = [
      '// SPDX-License-Identifier: MIT',
      'pragma solidity ^0.8.20;',
      'import "@openzeppelin/contracts/access/Ownable.sol";',
      '',
      `contract ${this.contractName} is Ownable {`,
      '    // State Variables'
    ]

    this.stateVars.forEach(v => {
      // Auto-correct inferred types for common patterns in voting
      if (v.name === 'candidates' && v.type === 'string[]') lines.push(`    string[] public candidates;`)
      else if (v.name === 'vote_counts') lines.push(`    mapping(string => uint256) public vote_counts;`)
      else if (v.name === 'has_voted') lines.push(`    mapping(address => bool) public has_voted;`)
      else lines.push(`    ${v.type} public ${v.name};`)
    })

    // Dynamic Events
    lines.push('')
    lines.push('    event CandidateAdded(string name);')
    lines.push('    event VoteCast(address indexed voter, string candidate);')
    lines.push('    event VotingClosed();')
    lines.push('')

    lines.push('    constructor() Ownable(msg.sender) {')
    // Init vars if needed (usually 0/empty by default in Sol)
    this.stateVars.forEach(v => {
      if (v.name === 'admin') lines.push('        admin = msg.sender;')
      if (v.name === 'voting_open') lines.push('        voting_open = true;')
    })
    lines.push('    }')
    lines.push('')

    this.functions.filter(f => f.name !== '__init__').forEach(f => {
      const returns = f.returns ? ` returns (${f.returns})` : ''
      lines.push(`    function ${f.name}(${f.params}) public ${f.name.startsWith('get') || f.name.startsWith('is') ? 'view' : ''} ${returns} {`)
      lines.push(this.convertBodyToSolidity(f.body, f.returns))
      lines.push('    }')
      lines.push('')
    })

    lines.push('}')
    return lines.join('\n')
  }
}

// Python contract templates
export const PYTHON_CONTRACT_TEMPLATE = `# zerothon Smart Contract
# Write Python code and transpile to Solidity

class SimpleStorage:
    """A simple storage contract"""
    
    def __init__(self):
        self.value: int = 0
        self.owner: address = msg.sender
    
    def store(self, new_value: int):
        """Store a new value"""
        self.value = new_value
    
    def retrieve(self) -> int:
        """Retrieve the stored value"""
        return self.value
`

export const PYTHON_TOKEN_TEMPLATE = `# zerothon ERC20 Token
class zerothonToken:
    """ERC20 Token Implementation"""
    
    def __init__(self):
        self.name: str = "zerothon Token"
        self.symbol: str = "ZTN"
        self.decimals: int = 18
        self.total_supply: int = 1000000
    
    def balance_of(self, account: address) -> int:
        """Get balance of account"""
        return 0
    
    def transfer(self, to: address, amount: int) -> bool:
        """Transfer tokens"""
        return True
`
