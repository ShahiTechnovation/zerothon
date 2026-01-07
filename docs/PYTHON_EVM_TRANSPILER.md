# Python to EVM Bytecode Transpiler

## Overview

Professional Python-to-EVM bytecode transpiler that converts Python smart contracts directly to EVM bytecode, bypassing Solidity compilation. This enables Python developers to write smart contracts in native Python syntax.

## Architecture

```
┌─────────────────────────────────────────┐
│     Python Smart Contract               │
│  - Python syntax                        │
│  - Type hints                           │
│  - Decorators (@public, @view)          │
└────────────────┬────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────┐
│     AST Analysis                        │
│  - Parse Python AST                     │
│  - Extract state variables              │
│  - Extract functions                    │
│  - Extract events                       │
└────────────────┬────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────┐
│     EVM Bytecode Generation             │
│  - Generate init code                   │
│  - Generate runtime code                │
│  - Function dispatcher                  │
│  - Storage operations                   │
└────────────────┬────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────┐
│     Output                              │
│  - EVM Bytecode (0x...)                 │
│  - ABI (JSON)                           │
│  - Metadata                             │
└─────────────────────────────────────────┘
```

## Features

### ✅ Python Syntax Support

**State Variables:**
```python
class SimpleStorage(PySmartContract):
    def __init__(self):
        self.value: int = 0
        self.owner: address = self.msg_sender()
        self.name: str = "MyContract"
```

**Functions:**
```python
@public_function
def store(self, new_value: int):
    self.value = new_value

@view_function
def retrieve(self) -> int:
    return self.value
```

**Mappings:**
```python
def __init__(self):
    self.balances: dict = {}  # address => uint256

@public_function
def get_balance(self, user: str) -> int:
    return self.balances[user]
```

**Control Flow:**
```python
@public_function
def transfer(self, to: str, amount: int):
    if self.balances[msg.sender] >= amount:
        self.balances[msg.sender] -= amount
        self.balances[to] += amount
    else:
        # Revert transaction
        pass
```

### ✅ Type System

**Supported Types:**
- `int` → `uint256`
- `str` → `address` or `bytes32`
- `bool` → `bool`
- `dict` → `mapping`
- `address` → `address`
- `bytes` → `bytes`

**Type Inference:**
```python
self.count: int = 0          # uint256
self.owner: address = "0x..."  # address
self.name: str = "Token"     # bytes32
self.active: bool = True     # bool
self.balances: dict = {}     # mapping(address => uint256)
```

### ✅ EVM Opcodes

**Generated Opcodes:**
- Stack operations: `PUSH`, `POP`, `DUP`, `SWAP`
- Arithmetic: `ADD`, `SUB`, `MUL`, `DIV`, `MOD`
- Comparison: `EQ`, `LT`, `GT`, `ISZERO`
- Storage: `SLOAD`, `SSTORE`
- Memory: `MLOAD`, `MSTORE`
- Control flow: `JUMP`, `JUMPI`, `JUMPDEST`
- Calldata: `CALLDATALOAD`, `CALLDATASIZE`
- Return: `RETURN`, `REVERT`

### ✅ Function Dispatcher

**Automatic Generation:**
```
1. Load function selector (first 4 bytes of calldata)
2. Compare with each function selector
3. Jump to matching function
4. Execute function logic
5. Return result
```

**Function Selector Calculation:**
```python
# Python: def store(self, new_value: int)
# Signature: store(uint256)
# Selector: keccak256("store(uint256)")[:4]
# Result: 0x6057361d
```

### ✅ Storage Layout

**Slot Allocation:**
```python
class Token:
    def __init__(self):
        self.name = "Token"      # Slot 0
        self.symbol = "TKN"      # Slot 1
        self.total_supply = 1000 # Slot 2
        self.balances = {}       # Slot 3 (base)
```

**Mapping Storage:**
```
slot = keccak256(key . base_slot)
```

## API Integration

### Transpile Endpoint

**POST `/api/transpile`**

**Request:**
```json
{
  "source": "class SimpleStorage(PySmartContract):\n    def __init__(self):\n        self.value: int = 0",
  "contractName": "SimpleStorage"
}
```

**Response:**
```json
{
  "success": true,
  "bytecode": "0x608060405234801561001057600080fd5b50...",
  "abi": [
    {
      "type": "constructor",
      "inputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "store",
      "inputs": [{"name": "new_value", "type": "uint256"}],
      "outputs": [],
      "stateMutability": "nonpayable"
    }
  ],
  "metadata": {
    "compiler": "python-evm-transpiler",
    "version": "0.1.0",
    "gas_estimate": 50000,
    "state_variables": {"value": 0},
    "functions": ["store", "retrieve"]
  }
}
```

## Example Contracts

### Simple Storage

```python
class SimpleStorage(PySmartContract):
    """A simple storage contract"""
    
    def __init__(self):
        self.value: int = 0
        self.owner: address = self.msg_sender()
    
    @public_function
    def store(self, new_value: int):
        """Store a new value"""
        self.value = new_value
    
    @view_function
    def retrieve(self) -> int:
        """Retrieve the stored value"""
        return self.value
```

### ERC20 Token

```python
class ERC20Token(PySmartContract):
    """ERC20 Token Implementation"""
    
    def __init__(self):
        self.name: str = "MyToken"
        self.symbol: str = "MTK"
        self.decimals: int = 18
        self.total_supply: int = 1000000
        self.balances: dict = {}
        self.allowances: dict = {}
        
        # Mint to deployer
        self.balances[self.msg_sender()] = self.total_supply
    
    @view_function
    def balance_of(self, account: address) -> int:
        """Get balance of account"""
        return self.balances.get(account, 0)
    
    @public_function
    def transfer(self, to: address, amount: int) -> bool:
        """Transfer tokens"""
        sender = self.msg_sender()
        
        if self.balances[sender] >= amount:
            self.balances[sender] -= amount
            self.balances[to] += amount
            return True
        return False
    
    @public_function
    def approve(self, spender: address, amount: int) -> bool:
        """Approve spending"""
        self.allowances[self.msg_sender()][spender] = amount
        return True
```

### DeFi Staking

```python
class StakingContract(PySmartContract):
    """Simple staking contract"""
    
    def __init__(self):
        self.stakes: dict = {}
        self.rewards: dict = {}
        self.total_staked: int = 0
        self.reward_rate: int = 100  # 1% per block
    
    @public_function
    def stake(self, amount: int):
        """Stake tokens"""
        user = self.msg_sender()
        self.stakes[user] += amount
        self.total_staked += amount
    
    @public_function
    def unstake(self, amount: int):
        """Unstake tokens"""
        user = self.msg_sender()
        if self.stakes[user] >= amount:
            self.stakes[user] -= amount
            self.total_staked -= amount
    
    @view_function
    def get_stake(self, user: address) -> int:
        """Get user's stake"""
        return self.stakes.get(user, 0)
    
    @view_function
    def calculate_reward(self, user: address) -> int:
        """Calculate pending rewards"""
        stake = self.stakes.get(user, 0)
        return stake * self.reward_rate // 10000
```

## Deployment

### Using Unified IDE

1. **Write Python Contract:**
```python
class MyContract(PySmartContract):
    def __init__(self):
        self.value: int = 0
```

2. **Click "Transpile":**
- Generates EVM bytecode
- Generates ABI
- Shows Solidity equivalent

3. **Click "Deploy":**
- Connects MetaMask
- Deploys to Avalanche
- Returns contract address

### Using CLI

```bash
# Transpile Python contract
avax-cli transpile contracts/MyContract.py

# Deploy to Avalanche
avax-cli deploy MyContract --network fuji

# Interact with contract
avax-cli call MyContract store 42
avax-cli call MyContract retrieve
```

## Gas Optimization

### Efficient Storage

**Before:**
```python
def __init__(self):
    self.var1: int = 0
    self.var2: int = 0
    self.var3: int = 0
```

**After (Packed):**
```python
def __init__(self):
    # Pack multiple values in one slot
    self.packed_vars: int = 0  # Use bit manipulation
```

### Efficient Mappings

**Before:**
```python
self.data: dict = {}
self.metadata: dict = {}
```

**After:**
```python
# Combine related data
self.user_data: dict = {}  # Store both data and metadata
```

### Efficient Functions

**Before:**
```python
@public_function
def update(self, a: int, b: int, c: int):
    self.var_a = a
    self.var_b = b
    self.var_c = c
```

**After:**
```python
@public_function
def update_batch(self, values: list):
    # Batch updates in one transaction
    pass
```

## Security Considerations

### ✅ Implemented

- **Reentrancy Protection:** Built into transpiler
- **Integer Overflow:** EVM 0.8+ has built-in checks
- **Access Control:** Use owner checks
- **Input Validation:** Check function parameters

### ⚠️ Best Practices

```python
class SecureContract(PySmartContract):
    def __init__(self):
        self.owner: address = self.msg_sender()
    
    @public_function
    def sensitive_function(self, amount: int):
        # Check caller is owner
        if self.msg_sender() != self.owner:
            return  # Revert
        
        # Check amount is valid
        if amount <= 0:
            return  # Revert
        
        # Perform operation
        self.value = amount
```

## Debugging

### Console Output

```python
# Transpiler provides detailed logs
[blue]Analyzing contract class: SimpleStorage[/blue]
[green]Found function: store[/green]
[yellow]State variable: value[/yellow]
[blue]Generating EVM bytecode...[/blue]
[green]✓ Transpilation completed successfully![/green]
```

### Bytecode Analysis

```bash
# View generated bytecode
avax-cli bytecode MyContract

# Disassemble bytecode
avax-cli disassemble MyContract

# Gas analysis
avax-cli gas-estimate MyContract
```

## Limitations

### Current Limitations

1. **Complex Python Features:**
   - No list comprehensions
   - No lambda functions
   - No decorators (except @public, @view)
   - No inheritance (except PySmartContract)

2. **Type System:**
   - Limited to basic EVM types
   - No custom structs yet
   - No arrays (use mappings)

3. **Libraries:**
   - No Python standard library
   - No external imports

### Workarounds

**Lists → Mappings:**
```python
# Instead of: self.items = []
self.items: dict = {}  # index => value
self.item_count: int = 0
```

**Structs → Multiple Mappings:**
```python
# Instead of: struct User { name, age }
self.user_names: dict = {}
self.user_ages: dict = {}
```

## Future Enhancements

### Planned Features

1. **Advanced Types:**
   - Structs
   - Arrays
   - Nested mappings

2. **Python Features:**
   - List comprehensions
   - More decorators
   - Multiple inheritance

3. **Optimizations:**
   - Better gas optimization
   - Storage packing
   - Function inlining

4. **Tooling:**
   - Debugger
   - Profiler
   - Test framework

## Conclusion

The Python-to-EVM transpiler enables Python developers to write smart contracts in familiar Python syntax while generating efficient EVM bytecode for deployment on Avalanche and other EVM chains.

**Key Benefits:**
- 🐍 Native Python syntax
- ⚡ Direct EVM bytecode generation
- 🔺 Avalanche optimized
- 🛡️ Security built-in
- 📦 No Solidity required

**Start building with Python today!** 🚀

---

**Built with PyVax** - Python-first smart contract development
