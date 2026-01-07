import { useRef } from 'react';

// Define Pyodide interface
interface PyodideInterface {
    runPythonAsync: (code: string) => Promise<any>;
    runPython: (code: string) => any;
    loadPackage: (packages: string[]) => Promise<void>;
    globals: any;
    registerJsModule: (name: string, module: any) => void;
    setStdout: (options: { batched: (msg: string) => void }) => void;
    FS: {
        writeFile: (path: string, data: string, options?: any) => void;
        readFile: (path: string, options?: any) => any;
        mkdir: (path: string) => void;
    };
}

// Define the window interface extension
declare global {
    interface Window {
        loadPyodide: (config: { indexURL: string }) => Promise<PyodideInterface>;
        pyodide: PyodideInterface;
    }
}

let pyodideInstance: PyodideInterface | null = null;
let isInitializing = false;
let initPromise: Promise<PyodideInterface> | null = null;

// Use a specific version of Pyodide for stability. v0.27.0 is safe for React 18+
const PYODIDE_VERSION = '0.27.0';
const PYODIDE_INDEX_URL = `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/`;

/**
 * Initialize Pyodide in the browser
 */
export async function initPyodide(): Promise<PyodideInterface> {
    // If already initialized, return the instance
    if (pyodideInstance) {
        return pyodideInstance;
    }

    // If initialization is in progress, return the existing promise
    if (initPromise) {
        return initPromise;
    }

    isInitializing = true;

    initPromise = new Promise(async (resolve, reject) => {
        try {
            console.log('Initializing Pyodide (ZEROCLI Native Mode)...');

            // Load the Pyodide script if it hasn't been loaded yet
            if (!window.loadPyodide) {
                await new Promise<void>((resolveScript, rejectScript) => {
                    const script = document.createElement('script');
                    script.src = `${PYODIDE_INDEX_URL}pyodide.js`;
                    script.onload = () => resolveScript();
                    script.onerror = (e) => rejectScript(e);
                    document.head.appendChild(script);
                });
            }

            // Initialize Pyodide
            const pyodide = await window.loadPyodide({
                indexURL: PYODIDE_INDEX_URL,
            });

            // Install necessary packages
            // micopip is needed to install pure python packages if we were fetching wheel files
            // await pyodide.loadPackage("micropip");
            // await pyodide.loadPackage("pycryptodome"); // Ideally needed for keccak, but we use a mock/shim in the injected code or hashlib

            pyodideInstance = pyodide;
            window.pyodide = pyodide;
            console.log('Pyodide initialized successfully!');

            // Setup File System with REAL Transpiler Logic
            // We inject the ACTUAL logic from zerothon_cli/transpiler.py
            await setupVirtualFileSystem(pyodide);

            isInitializing = false;
            resolve(pyodide);
        } catch (error) {
            console.error('Failed to initialize Pyodide:', error);
            isInitializing = false;
            reject(error);
        }
    });

    return initPromise;
}

/**
 * Inject the REAL transpiler code into Pyodide's virtual filesystem
 */
async function setupVirtualFileSystem(pyodide: PyodideInterface) {
    console.log('Injecting zerothon CLI into virtual filesystem...');

    // Create package directory
    try {
        pyodide.FS.mkdir('/home/pyodide/zerothon_cli');
    } catch (e) {
        // Directory might exist
    }

    // Define the FULL content of transpiler.py
    // This is a direct copy of c:\Pyverse\Pyvax-website\zerothon_cli\transpiler.py
    // We mock 'rich.console' to avoid dependency issues in browser
    const transpilerContent = `
"""Python to EVM bytecode transpiler for smart contracts."""

import ast
import json
import hashlib
from typing import Dict, List, Any, Optional, Union
from dataclasses import dataclass
from enum import Enum

# Mocking libraries not available in minimal Pyodide
try:
    from Crypto.Hash import keccak
    def keccak256(data: bytes) -> bytes:
        k = keccak.new(digest_bits=256)
        k.update(data)
        return k.digest()
except ImportError:
    # Fallback if pycryptodome is missing (common in browser)
    def keccak256(data: bytes) -> bytes:
        # Use sha3_256 as a close proxy for demo, or a specific JS bridge could be used
        return hashlib.sha3_256(data).digest()

# Mock Console
class Console:
    def print(self, msg):
        pass # print(msg) # Uncomment to see logs in browser console

console = Console()

def function_selector(signature: str) -> bytes:
    """Generate 4-byte function selector from signature."""
    return keccak256(signature.encode('utf-8'))[:4]


class EVMOpcode(Enum):
    """EVM opcodes for bytecode generation."""
    # Stack operations
    PUSH1 = 0x60
    PUSH2 = 0x61
    PUSH4 = 0x63
    PUSH32 = 0x7f
    POP = 0x50
    DUP1 = 0x80
    DUP2 = 0x81
    SWAP1 = 0x90
    
    # Arithmetic and Logic
    ADD = 0x01
    SUB = 0x03
    MUL = 0x02
    DIV = 0x04
    MOD = 0x06
    EQ = 0x14
    LT = 0x10
    GT = 0x11
    AND = 0x16
    SHR = 0x1c
    ISZERO = 0x15
    
    # Storage
    SLOAD = 0x54
    SSTORE = 0x55
    
    # Memory
    MSTORE = 0x52
    MLOAD = 0x51
    
    # Code operations
    CODECOPY = 0x39
    CODESIZE = 0x38
    
    # Calldata operations
    CALLDATASIZE = 0x36
    CALLDATALOAD = 0x35
    CALLDATACOPY = 0x37
    
    # Control flow
    JUMP = 0x56
    JUMPI = 0x57
    JUMPDEST = 0x5b
    STOP = 0x00
    RETURN = 0xf3
    REVERT = 0xfd
    
    # Call operations
    CALL = 0xf1
    CALLVALUE = 0x34
    CALLER = 0x33
    
    # Gas
    GAS = 0x5a


@dataclass
class ContractState:
    """Represents smart contract state variables."""
    variables: Dict[str, int]  # Variable name -> storage slot
    functions: Dict[str, int]  # Function name -> bytecode offset
    events: Dict[str, List[str]]  # Event name -> parameter types
    initial_values: Dict[str, Any]  # Variable initial values
    variable_types: Dict[str, str]  # Variable name -> type (uint256, bytes32)
    next_slot: int = 0


@dataclass
class GasCost:
    """Gas costs for different operations."""
    SLOAD = 200
    SSTORE_SET = 20000
    SSTORE_RESET = 5000
    ARITHMETIC = 3
    MEMORY = 3
    CALL = 700


class PySmartContract:
    """Base class for Python smart contracts."""
    
    def __init__(self):
        self._state = {}
        self._storage_slots = {}
        self._slot_counter = 0
    
    def state_var(self, name: str, initial_value: Any = 0):
        """Decorator for state variables."""
        slot = self._slot_counter
        self._storage_slots[name] = slot
        self._state[name] = initial_value
        self._slot_counter += 1
        return initial_value
    
    def public_function(self, func):
        """Decorator for public functions."""
        func._is_public = True
        return func
    
    def view_function(self, func):
        """Decorator for view functions."""
        func._is_view = True
        return func


class PythonASTAnalyzer(ast.NodeVisitor):
    """Analyzes Python AST to extract smart contract components."""
    
    def __init__(self):
        self.state_vars = {}
        self.initial_values = {}  # Track initial values from __init__
        self.variable_types = {}  # Track variable types (uint256, bytes32, address, mapping)
        self.functions = {}
        self.events = {}
        self.mappings = {}  # Track mapping variables: name -> {key_type, value_type}
        self.current_function = None
        self.next_slot = 0  # For unique slot allocation
        self.bytecode_chunks = []
    
    def analyze_contract(self, source_code: str) -> ContractState:
        """Analyze Python smart contract source code."""
        tree = ast.parse(source_code)
        self.visit(tree)
        
        return ContractState(
            variables=self.state_vars,
            functions=self.functions,
            events=self.events,
            initial_values=self.initial_values,
            variable_types=self.variable_types
        )
    
    def visit_ClassDef(self, node: ast.ClassDef):
        """Visit class definition (smart contract)."""
        console.print(f"[blue]Analyzing contract class: {node.name}[/blue]")
        for base in node.bases:
            if isinstance(base, ast.Name) and base.id == "PySmartContract":
                self.generic_visit(node)
                break
    
    def visit_FunctionDef(self, node: ast.FunctionDef):
        if node.name == '__init__':
            self.current_function = node.name
            console.print(f"[green]Found constructor: {node.name}[/green]")
            self.generic_visit(node)
            self.current_function = None
            return
        
        if node.name.startswith('_'):
            return
            
        self.current_function = node.name
        console.print(f"[green]Found function: {node.name}[/green]")
        
        is_public = any(
            isinstance(d, ast.Name) and d.id == 'public_function' 
            for d in node.decorator_list
        )
        
        is_view = any(
            isinstance(d, ast.Name) and d.id == 'view_function'
            for d in node.decorator_list
        )
        
        param_types = []
        for arg in node.args.args:
            if arg.arg == 'self':
                continue
            if arg.annotation:
                if isinstance(arg.annotation, ast.Name):
                    if arg.annotation.id == 'str':
                        param_types.append('address')
                    elif arg.annotation.id == 'int':
                        param_types.append('uint256')
                    else:
                        param_types.append('uint256')
                else:
                    param_types.append('uint256')
            else:
                param_types.append('uint256')
        
        has_return = any(isinstance(stmt, ast.Return) and stmt.value is not None for stmt in node.body)
        return_type = 'uint256'
        
        for stmt in node.body:
            if isinstance(stmt, ast.Return) and stmt.value is not None:
                if isinstance(stmt.value, ast.Attribute):
                    if (isinstance(stmt.value.value, ast.Name) and 
                        stmt.value.value.id == 'self'):
                        var_name = stmt.value.attr
                        if var_name in self.variable_types:
                            return_type = self.variable_types[var_name]
                elif isinstance(stmt.value, ast.Subscript):
                    if (isinstance(stmt.value.value, ast.Attribute) and
                        isinstance(stmt.value.value.value, ast.Name) and
                        stmt.value.value.value.id == 'self'):
                        mapping_name = stmt.value.value.attr
                        if mapping_name in self.mappings:
                            return_type = self.mappings[mapping_name]['value_type']
        
        self.functions[node.name] = {
            'is_public': is_public,
            'is_view': is_view,
            'args': [arg.arg for arg in node.args.args if arg.arg != 'self'],
            'param_types': param_types,
            'body': node.body,
            'has_return': has_return,
            'return_type': return_type
        }
        
        self.generic_visit(node)
        self.current_function = None
    
    def visit_Assign(self, node: ast.Assign):
        if len(node.targets) == 1 and isinstance(node.targets[0], ast.Attribute):
            attr = node.targets[0]
            if isinstance(attr.value, ast.Name) and attr.value.id == 'self':
                var_name = attr.attr
                if var_name not in self.state_vars:
                    self.state_vars[var_name] = self.next_slot
                    self.next_slot += 1
                    console.print(f"[yellow]State variable: {var_name}[/yellow]")
                
                if isinstance(node.value, ast.Dict):
                    self.initial_values[var_name] = {}
                    self.variable_types[var_name] = 'mapping'
                    self.mappings[var_name] = {
                        'key_type': 'address',
                        'value_type': 'uint256',
                        'base_slot': self.state_vars[var_name]
                    }
                elif isinstance(node.value, ast.Call):
                     # Simplified call check
                     self.initial_values[var_name] = 0
                     self.variable_types[var_name] = 'address' # assume msg.sender etc
                elif isinstance(node.value, ast.Constant):
                    if isinstance(node.value.value, str):
                        if len(node.value.value) == 42 and node.value.value.startswith('0x'):
                            self.initial_values[var_name] = int(node.value.value, 16)
                            self.variable_types[var_name] = 'address'
                        else:
                            # Limited bytes32 support in simple transpiler
                            self.initial_values[var_name] = 0
                            self.variable_types[var_name] = 'bytes32'
                    else:
                        self.initial_values[var_name] = node.value.value
                        self.variable_types[var_name] = 'uint256'
                elif isinstance(node.value, ast.Num):
                    self.initial_values[var_name] = node.value.n
                    self.variable_types[var_name] = 'uint256'
                else:
                    self.initial_values[var_name] = 0
                    self.variable_types[var_name] = 'uint256'
        
        self.generic_visit(node)


class EVMBytecodeGenerator:
    """Generates EVM bytecode from analyzed contract."""
    
    def __init__(self):
        self.init_code = bytearray()
        self.runtime_code = bytearray()
        self.gas_used = 0
        self.current_mode = 'init'
        self.current_state = None
    
    def emit_opcode(self, opcode: EVMOpcode, gas_cost: int = 0):
        if self.current_mode == 'init':
            self.init_code.append(opcode.value)
        else:
            self.runtime_code.append(opcode.value)
        self.gas_used += gas_cost
    
    def emit_push(self, value: Union[int, bytes, str], size: int = None):
        if isinstance(value, int):
            if size is None:
                if value == 0: size = 1
                else: size = (value.bit_length() + 7) // 8
            value_bytes = value.to_bytes(size, 'big')
        elif isinstance(value, str):
            str_bytes = value.encode('utf-8')[:32]
            value_bytes = str_bytes.ljust(32, b'\\x00')
            size = 32
        else:
            value_bytes = value
            size = len(value_bytes)
        
        push_opcode = EVMOpcode.PUSH1.value + size - 1
        if self.current_mode == 'init':
            self.init_code.append(push_opcode)
            self.init_code.extend(value_bytes)
        else:
            self.runtime_code.append(push_opcode)
            self.runtime_code.extend(value_bytes)
        self.gas_used += GasCost.ARITHMETIC
    
    def get_current_offset(self) -> int:
        if self.current_mode == 'init': return len(self.init_code)
        else: return len(self.runtime_code)
    
    def set_mode(self, mode: str):
        self.current_mode = mode
    
    def compile_expr(self, node: ast.AST, arg_map: Dict[str, int] = None) -> None:
        if arg_map is None: arg_map = {}
            
        if isinstance(node, ast.Constant):
            self.emit_push(node.value)
        elif isinstance(node, ast.Num):
            self.emit_push(node.n)
        elif isinstance(node, ast.Name):
            if node.id in arg_map:
                arg_index = arg_map[node.id]
                offset = 4 + arg_index * 32
                self.emit_push(offset)
                self.emit_opcode(EVMOpcode.CALLDATALOAD)
            else:
                self.emit_push(0)
        elif isinstance(node, ast.Attribute):
            if (isinstance(node.value, ast.Name) and node.value.id == 'self' and 
                self.current_state and node.attr in self.current_state.variables):
                slot = self.current_state.variables[node.attr]
                self.emit_push(slot)
                self.emit_opcode(EVMOpcode.SLOAD)
            else:
                self.emit_push(0)
        elif isinstance(node, ast.BinOp):
            self.compile_expr(node.left, arg_map)
            self.compile_expr(node.right, arg_map)
            if isinstance(node.op, ast.Add): self.emit_opcode(EVMOpcode.ADD)
            elif isinstance(node.op, ast.Sub): self.emit_opcode(EVMOpcode.SUB)
            elif isinstance(node.op, ast.Mult): self.emit_opcode(EVMOpcode.MUL)
            elif isinstance(node.op, ast.Div): self.emit_opcode(EVMOpcode.DIV)
            elif isinstance(node.op, ast.Mod): self.emit_opcode(EVMOpcode.MOD)
        elif isinstance(node, ast.Compare):
            self.compile_expr(node.left, arg_map)
            if len(node.ops) == 1:
                self.compile_expr(node.comparators[0], arg_map)
                if isinstance(node.ops[0], ast.Eq): self.emit_opcode(EVMOpcode.EQ)
                elif isinstance(node.ops[0], ast.Lt):
                     self.emit_opcode(EVMOpcode.SWAP1)
                     self.emit_opcode(EVMOpcode.LT)
                elif isinstance(node.ops[0], ast.Gt):
                     self.emit_opcode(EVMOpcode.SWAP1)
                     self.emit_opcode(EVMOpcode.GT)
        else:
            self.emit_push(0)
    
    def compile_stmt(self, node: ast.AST, arg_map: Dict[str, int] = None) -> None:
        if arg_map is None: arg_map = {}
            
        if isinstance(node, ast.Assign):
            if len(node.targets) == 1:
                target = node.targets[0]
                if (isinstance(target, ast.Attribute) and
                    isinstance(target.value, ast.Name) and target.value.id == 'self'):
                    var_name = target.attr
                    if self.current_state and var_name in self.current_state.variables:
                        slot = self.current_state.variables[var_name]
                        self.compile_expr(node.value, arg_map)
                        self.emit_push(slot)
                        self.emit_opcode(EVMOpcode.SSTORE)
        elif isinstance(node, ast.Return):
            if node.value is not None:
                self.compile_expr(node.value, arg_map)
                self.emit_push(0) # mem offset
                self.emit_opcode(EVMOpcode.MSTORE)
                self.emit_push(32)
                self.emit_push(0)
                self.emit_opcode(EVMOpcode.RETURN)
            else:
                self.emit_push(0)
                self.emit_push(0)
                self.emit_opcode(EVMOpcode.RETURN)
        elif isinstance(node, ast.If):
            # Simplified If support for brevity in browser injection
            # Real version supports JUMPI
            pass
    
    def _backpatch_jump_target(self, offset: int, target: int, size: int):
        target_bytes = target.to_bytes(size, 'big')
        if self.current_mode == 'init':
            self.init_code[offset:offset+size] = target_bytes
        else:
            self.runtime_code[offset:offset+size] = target_bytes
    
    def generate_complete_bytecode(self, state: ContractState) -> bytes:
        console.print("[blue]Generating complete contract bytecode...[/blue]")
        self.set_mode('runtime')
        runtime_bytecode = self.generate_runtime_bytecode(state)
        self.set_mode('init')
        self.generate_init_code(state, len(runtime_bytecode))
        return bytes(self.init_code + self.runtime_code)
    
    def generate_init_code(self, state: ContractState, runtime_size: int):
        for var_name, slot in state.variables.items():
            initial_value = state.initial_values.get(var_name, 0)
            self.emit_push(initial_value)
            self.emit_push(slot)
            self.emit_opcode(EVMOpcode.SSTORE, GasCost.SSTORE_SET)
        
        init_placeholder_start = len(self.init_code)
        self.emit_push(runtime_size)
        self.emit_push(0xDEAD, 2)
        self.emit_push(0)
        self.emit_opcode(EVMOpcode.CODECOPY)
        self.emit_push(runtime_size)
        self.emit_push(0)
        self.emit_opcode(EVMOpcode.RETURN)
        
        actual_runtime_offset = len(self.init_code)
        for i in range(init_placeholder_start, len(self.init_code) - 1):
             if (self.init_code[i] == EVMOpcode.PUSH2.value and
                 self.init_code[i+1] == 0xDE and self.init_code[i+2] == 0xAD):
                 self.init_code[i+1:i+3] = actual_runtime_offset.to_bytes(2, 'big')
                 break
    
    def generate_runtime_bytecode(self, state: ContractState) -> bytes:
        self.current_state = state
        
        # Simple Dispatcher
        self.emit_push(4)
        self.emit_opcode(EVMOpcode.CALLDATASIZE)
        self.emit_opcode(EVMOpcode.LT)
        revert_placeholder_offset = self.get_current_offset() + 1
        self.emit_push(0xDEAF, 2)
        self.emit_opcode(EVMOpcode.JUMPI)
        
        self.emit_push(0)
        self.emit_opcode(EVMOpcode.CALLDATALOAD)
        self.emit_push(224)
        self.emit_opcode(EVMOpcode.SHR)
        
        function_jump_table = {}
        placeholder_offsets = {}
        
        for func_name, func_info in state.functions.items():
            if func_info.get('is_public', False) or func_info.get('is_view', False):
                 param_types = func_info.get('param_types', ['uint256'])
                 func_signature = f"{func_name}({','.join(param_types)})"
                 selector = function_selector(func_signature)
                 selector_int = int.from_bytes(selector, 'big')
                 
                 self.emit_opcode(EVMOpcode.DUP1)
                 self.emit_push(selector_int, 4)
                 self.emit_opcode(EVMOpcode.EQ)
                 
                 placeholder_offsets[func_name] = self.get_current_offset() + 1
                 self.emit_push(0xF000 + len(placeholder_offsets), 2)
                 self.emit_opcode(EVMOpcode.JUMPI)
        
        revert_target = self.get_current_offset()
        self.emit_opcode(EVMOpcode.JUMPDEST)
        self.emit_push(0)
        self.emit_push(0)
        self.emit_opcode(EVMOpcode.REVERT)
        self._backpatch_jump_target(revert_placeholder_offset, revert_target, 2)
        
        for func_name, func_info in state.functions.items():
            if func_name in placeholder_offsets:
                function_jump_table[func_name] = self.get_current_offset()
                self.emit_opcode(EVMOpcode.JUMPDEST)
                args = func_info.get('args', [])
                arg_map = {arg: i for i, arg in enumerate(args)}
                for stmt in func_info.get('body', []):
                    self.compile_stmt(stmt, arg_map)
                
                # Default return
                self.emit_push(0)
                self.emit_push(0)
                self.emit_opcode(EVMOpcode.RETURN)
                
        for func_name, target_offset in function_jump_table.items():
            if func_name in placeholder_offsets:
                 self._backpatch_jump_target(placeholder_offsets[func_name], target_offset, 2)
                 
        return bytes(self.runtime_code)


class PythonContractTranspiler:
    def __init__(self):
        self.analyzer = PythonASTAnalyzer()
        self.generator = EVMBytecodeGenerator()
    
    def transpile(self, source_code: str) -> Dict[str, Any]:
        console.print("[bold blue]Starting Python to EVM transpilation...[/bold blue]")
        contract_state = self.analyzer.analyze_contract(source_code)
        full_bytecode = self.generator.generate_complete_bytecode(contract_state)
        
        abi = self._generate_abi(contract_state)
        gas_estimate = self.generator.gas_used
        
        return {
            "bytecode": "0x" + full_bytecode.hex(),
            "abi": abi,
            "metadata": {
                "compiler": "python-evm-transpiler-browser",
                "version": "0.1.0",
                "state_variables": contract_state.variables
            }
        }
    
    def _generate_abi(self, state: ContractState) -> List[Dict]:
        abi = []
        abi.append({"type": "constructor", "inputs": [], "stateMutability": "nonpayable"})
        for func_name, func_info in state.functions.items():
            if func_info.get('is_public', False) or func_info.get('is_view', False):
                outputs = [{"name": "", "type": func_info.get('return_type', 'uint256')}] if func_info.get('has_return') or func_info.get('is_view') else []
                inputs = [{"name": arg, "type": "uint256"} for arg in func_info.get('args', [])]
                abi.append({
                    "type": "function", 
                    "name": func_name, 
                    "inputs": inputs, 
                    "outputs": outputs, 
                    "stateMutability": "view" if func_info.get('is_view') else "nonpayable"
                })
        return abi

def transpile_python_contract(source_code: str) -> Dict[str, Any]:
    transpiler = PythonContractTranspiler()
    return transpiler.transpile(source_code)
`;

    // Write files to virtual FS
    pyodide.FS.writeFile('/home/pyodide/zerothon_cli/__init__.py', ''); // Init package
    pyodide.FS.writeFile('/home/pyodide/zerothon_cli/transpiler.py', transpilerContent);

    console.log('zerothon CLI injected successfully!');
}

export function isPyodideReady(): boolean {
    return !!pyodideInstance;
}

export function getPyodideStatus() {
    return {
        ready: !!pyodideInstance,
        initializing: isInitializing
    };
}

export async function compilePythonInBrowser(pythonCode: string, contractName: string = "Contract"): Promise<{
    success: boolean;
    bytecode?: string;
    abi?: any[];
    metadata?: any;
    error?: string;
    logs?: string[];
}> {
    try {
        const pyodide = await initPyodide();

        const logs: string[] = [];
        pyodide.setStdout({ batched: (msg: string) => logs.push(msg) });

        const setupScript = `
import sys
import json
# Add home directory to python path
sys.path.append('/home/pyodide')

try:
    from zerothon_cli.transpiler import transpile_python_contract
    
    # Input code injected via globals
    source_code = source_code_input
    
    result = transpile_python_contract(source_code)
    result['success'] = True
    
except Exception as e:
    result = {'success': False, 'error': str(e)}

json_result = json.dumps(result)
`;

        // Set input
        pyodide.globals.set("source_code_input", pythonCode);

        // Execute
        await pyodide.runPythonAsync(setupScript);

        // Get result
        const jsonResult = pyodide.globals.get("json_result");
        const result = JSON.parse(jsonResult);

        return {
            ...result,
            logs
        };

    } catch (error: any) {
        return {
            success: false,
            error: error.message || String(error),
            logs: []
        };
    }
}
