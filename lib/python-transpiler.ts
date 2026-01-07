// Python to Solidity Transpiler using Pyodide (Browser-only)

let pyodideInstance: any = null

export async function initializePyodide() {
  // Only load in browser
  if (typeof window === 'undefined') {
    throw new Error('Pyodide can only run in browser')
  }
  
  // Dynamic import to avoid build-time issues
  const { loadPyodide } = await import('pyodide')
  if (pyodideInstance) return pyodideInstance
  
  try {
    pyodideInstance = await loadPyodide({
      indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.25.0/full/'
    })
    
    // Install required packages
    await pyodideInstance.loadPackage(['micropip'])
    
    // Load Python transpiler code
    await pyodideInstance.runPythonAsync(`
import micropip
import js
from typing import Dict, List, Any

class PythonToSolidityTranspiler:
    """Transpile Python smart contracts to Solidity"""
    
    def __init__(self):
        self.solidity_version = "0.8.20"
        self.imports = set()
        self.state_vars = []
        self.functions = []
        self.events = []
        self.modifiers = []
        
    def transpile(self, python_code: str) -> str:
        """Main transpilation function"""
        try:
            # Parse Python code
            self.parse_python(python_code)
            
            # Generate Solidity
            solidity_code = self.generate_solidity()
            
            return solidity_code
        except Exception as e:
            return f"// Error: {str(e)}"
    
    def parse_python(self, code: str):
        """Parse Python code and extract components"""
        lines = code.split('\\n')
        current_function = None
        
        for line in lines:
            line = line.strip()
            
            # Skip comments and empty lines
            if not line or line.startswith('#'):
                continue
            
            # Parse decorators
            if line.startswith('@'):
                self.parse_decorator(line)
            
            # Parse class definition
            elif line.startswith('class '):
                self.parse_class(line)
            
            # Parse function definition
            elif line.startswith('def '):
                current_function = self.parse_function(line)
            
            # Parse state variables
            elif '=' in line and not line.startswith('def'):
                self.parse_state_var(line)
    
    def parse_decorator(self, line: str):
        """Parse Python decorators"""
        if '@contract' in line:
            self.imports.add('contract')
        elif '@public' in line:
            pass  # Handled in function parsing
        elif '@view' in line:
            pass  # Handled in function parsing
        elif '@event' in line:
            pass  # Handled in event parsing
    
    def parse_class(self, line: str):
        """Parse class definition"""
        # Extract contract name
        parts = line.split('class ')[1].split(':')[0].strip()
        self.contract_name = parts.split('(')[0].strip()
    
    def parse_function(self, line: str) -> Dict:
        """Parse function definition"""
        # Extract function name and parameters
        func_def = line.split('def ')[1].split(':')[0]
        func_name = func_def.split('(')[0].strip()
        
        # Extract parameters
        params_str = func_def.split('(')[1].split(')')[0]
        params = self.parse_parameters(params_str)
        
        function = {
            'name': func_name,
            'params': params,
            'visibility': 'public',
            'mutability': 'nonpayable',
            'returns': None
        }
        
        self.functions.append(function)
        return function
    
    def parse_parameters(self, params_str: str) -> List[Dict]:
        """Parse function parameters"""
        params = []
        if not params_str or params_str == 'self':
            return params
        
        for param in params_str.split(','):
            param = param.strip()
            if param == 'self':
                continue
            
            # Parse type hints
            if ':' in param:
                name, type_hint = param.split(':')
                name = name.strip()
                type_hint = type_hint.strip()
                sol_type = self.python_type_to_solidity(type_hint)
            else:
                name = param
                sol_type = 'uint256'
            
            params.append({'name': name, 'type': sol_type})
        
        return params
    
    def parse_state_var(self, line: str):
        """Parse state variable"""
        if '=' in line:
            parts = line.split('=')
            var_name = parts[0].strip()
            
            # Infer type from value
            value = parts[1].strip()
            var_type = self.infer_type(value)
            
            self.state_vars.append({
                'name': var_name,
                'type': var_type,
                'visibility': 'public'
            })
    
    def python_type_to_solidity(self, py_type: str) -> str:
        """Convert Python type to Solidity type"""
        type_map = {
            'int': 'uint256',
            'str': 'string',
            'bool': 'bool',
            'address': 'address',
            'uint256': 'uint256',
            'bytes': 'bytes',
            'mapping': 'mapping'
        }
        return type_map.get(py_type, 'uint256')
    
    def infer_type(self, value: str) -> str:
        """Infer Solidity type from Python value"""
        if value.isdigit():
            return 'uint256'
        elif value in ['True', 'False']:
            return 'bool'
        elif value.startswith('"') or value.startswith("'"):
            return 'string'
        else:
            return 'uint256'
    
    def generate_solidity(self) -> str:
        """Generate Solidity code"""
        code = []
        
        # SPDX and pragma
        code.append('// SPDX-License-Identifier: MIT')
        code.append(f'pragma solidity ^{self.solidity_version};')
        code.append('')
        
        # OpenZeppelin imports
        code.append('import "@openzeppelin/contracts/access/Ownable.sol";')
        code.append('import "@openzeppelin/contracts/security/ReentrancyGuard.sol";')
        code.append('import "@openzeppelin/contracts/security/Pausable.sol";')
        code.append('')
        
        # Contract declaration
        contract_name = getattr(self, 'contract_name', 'PyVaxContract')
        code.append(f'contract {contract_name} is Ownable, ReentrancyGuard, Pausable {{')
        code.append('')
        
        # State variables
        if self.state_vars:
            code.append('    // State variables')
            for var in self.state_vars:
                code.append(f'    {var["type"]} {var["visibility"]} {var["name"]};')
            code.append('')
        
        # Events
        code.append('    // Events')
        code.append('    event ValueChanged(uint256 newValue);')
        code.append('')
        
        # Constructor
        code.append('    constructor() Ownable(msg.sender) {}')
        code.append('')
        
        # Functions
        if self.functions:
            code.append('    // Functions')
            for func in self.functions:
                code.append(self.generate_function(func))
                code.append('')
        
        code.append('}')
        
        return '\\n'.join(code)
    
    def generate_function(self, func: Dict) -> str:
        """Generate Solidity function"""
        params = ', '.join([f'{p["type"]} {p["name"]}' for p in func['params']])
        
        func_code = f'    function {func["name"]}({params}) {func["visibility"]} {func["mutability"]} {{'
        func_code += '\\n        // Function implementation'
        func_code += '\\n    }'
        
        return func_code

# Create global transpiler instance
transpiler = PythonToSolidityTranspiler()

def transpile_python_to_solidity(python_code):
    """Transpile Python to Solidity"""
    return transpiler.transpile(python_code)
`)
    
    return pyodideInstance
  } catch (error) {
    console.error('Failed to initialize Pyodide:', error)
    throw error
  }
}

export async function transpilePythonToSolidity(pythonCode: string): Promise<string> {
  try {
    if (!pyodideInstance) {
      await initializePyodide()
    }
    
    // Run transpilation
    const result = await pyodideInstance.runPythonAsync(`
transpile_python_to_solidity("""${pythonCode.replace(/"/g, '\\"')}""")
`)
    
    return result
  } catch (error) {
    console.error('Transpilation error:', error)
    return `// Transpilation Error: ${error}`
  }
}

// Example Python contract templates
export const PYTHON_CONTRACT_TEMPLATE = `# PyVax Smart Contract
from pyvax import contract, public, view, event

@contract
class SimpleStorage:
    """A simple storage contract"""
    
    def __init__(self):
        self.value: int = 0
        self.owner: address = msg.sender
    
    @event
    def ValueChanged(self, new_value: int):
        pass
    
    @public
    def store(self, new_value: int):
        """Store a new value"""
        require(msg.sender == self.owner, "Not owner")
        self.value = new_value
        emit ValueChanged(new_value)
    
    @view
    def retrieve(self) -> int:
        """Retrieve the stored value"""
        return self.value
`

export const PYTHON_TOKEN_TEMPLATE = `# PyVax ERC20 Token
from pyvax import contract, public, view, event

@contract
class PyVaxToken:
    """ERC20 Token Implementation"""
    
    def __init__(self):
        self.name: str = "PyVax Token"
        self.symbol: str = "PVX"
        self.decimals: int = 18
        self.total_supply: int = 1000000 * 10**18
        self.balances: mapping = {}
        self.allowances: mapping = {}
        
        # Mint initial supply to deployer
        self.balances[msg.sender] = self.total_supply
    
    @event
    def Transfer(self, from_addr: address, to_addr: address, amount: int):
        pass
    
    @event
    def Approval(self, owner: address, spender: address, amount: int):
        pass
    
    @view
    def balance_of(self, account: address) -> int:
        """Get balance of account"""
        return self.balances.get(account, 0)
    
    @public
    def transfer(self, to: address, amount: int) -> bool:
        """Transfer tokens"""
        require(self.balances[msg.sender] >= amount, "Insufficient balance")
        
        self.balances[msg.sender] -= amount
        self.balances[to] += amount
        
        emit Transfer(msg.sender, to, amount)
        return True
    
    @public
    def approve(self, spender: address, amount: int) -> bool:
        """Approve spending"""
        self.allowances[msg.sender][spender] = amount
        emit Approval(msg.sender, spender, amount)
        return True
`
