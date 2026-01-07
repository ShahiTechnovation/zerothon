// Contract templates

export const PYTHON_TEMPLATES = {
  storage: {
    name: "Simple Storage",
    language: "python" as const,
    code: `from avax_cli.py_contracts import PySmartContract

class SimpleStorage(PySmartContract):
    """Simple storage contract in Python."""
    
    def __init__(self):
        super().__init__()
        self.stored_data = self.state_var("stored_data", 0)
    
    @public_function
    def set(self, value: int):
        """Set stored data."""
        self.stored_data = value
        self.event("DataStored", value)
    
    @view_function
    def get(self) -> int:
        """Get stored data."""
        return self.stored_data
`,
  },
  counter: {
    name: "Counter",
    language: "python" as const,
    code: `from avax_cli.py_contracts import PySmartContract

class Counter(PySmartContract):
    def __init__(self):
        super().__init__()
        self.count = self.state_var("count", 0)
    
    @public_function
    def increment(self):
        self.count = self.count + 1
        self.event("Incremented", self.count)
    
    @public_function
    def decrement(self):
        if self.count > 0:
            self.count = self.count - 1
    
    @view_function
    def get_count(self) -> int:
        return self.count
`,
  },
  token: {
    name: "ERC20 Token",
    language: "python" as const,
    code: `from avax_cli.py_contracts import PySmartContract

class SimpleToken(PySmartContract):
    def __init__(self, name: str, symbol: str, supply: int):
        super().__init__()
        self.name = self.state_var("name", name)
        self.symbol = self.state_var("symbol", symbol)
        self.total_supply = self.state_var("total_supply", supply)
        self.balances = self.mapping("balances")
        self.balances[self.msg_sender()] = supply
    
    @view_function
    def balance_of(self, account: str) -> int:
        return self.balances.get(account, 0)
    
    @public_function
    def transfer(self, to: str, amount: int):
        sender = self.msg_sender()
        if self.balances.get(sender, 0) >= amount:
            self.balances[sender] -= amount
            self.balances[to] = self.balances.get(to, 0) + amount
            self.event("Transfer", sender, to, amount)
        else:
            self.revert("Insufficient balance")
`,
  },
}

export const SOLIDITY_TEMPLATES = {
  storage: {
    name: "Simple Storage",
    language: "solidity" as const,
    code: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract SimpleStorage {
    uint256 private storedData;
    
    event DataStored(uint256 indexed value);
    
    function set(uint256 value) public {
        storedData = value;
        emit DataStored(value);
    }
    
    function get() public view returns (uint256) {
        return storedData;
    }
}
`,
  },
  counter: {
    name: "Counter",
    language: "solidity" as const,
    code: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract Counter {
    uint256 public count;
    
    event Incremented(uint256 indexed newCount);
    
    function increment() public {
        count++;
        emit Incremented(count);
    }
    
    function decrement() public {
        if (count > 0) {
            count--;
        }
    }
    
    function getCount() public view returns (uint256) {
        return count;
    }
}
`,
  },
}
