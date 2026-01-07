// Solidity Compiler Integration (Browser-compatible)

export interface CompilationResult {
  success: boolean
  contracts?: {
    [key: string]: {
      abi: any[]
      bytecode: string
      deployedBytecode: string
      gasEstimates?: any
    }
  }
  errors?: Array<{
    severity: 'error' | 'warning'
    message: string
    formattedMessage: string
  }>
}

export async function compileSolidity(
  source: string,
  contractName: string = 'Contract'
): Promise<CompilationResult> {
  try {
    // Use browser-compatible compilation via API
    const response = await fetch('/api/compile', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        source,
        contractName
      })
    })

    if (!response.ok) {
      throw new Error('Compilation request failed')
    }

    const output = await response.json()

    // Return the API response directly
    return output
  } catch (error) {
    return {
      success: false,
      errors: [{
        severity: 'error',
        message: error instanceof Error ? error.message : 'Compilation failed',
        formattedMessage: error instanceof Error ? error.message : 'Compilation failed'
      }]
    }
  }
}

// Generic EVM configuration (Legacy support, use lib/networks.ts)
export const EVM_CONFIG = {
  defaultGas: {
    maxFeePerGas: 225000000000,
    maxPriorityFeePerGas: 2000000000
  }
}

// Generic EVM-optimized contract template
export const EVM_CONTRACT_TEMPLATE = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

/**
 * @title zerothonContract
 * @dev Optimized for EVM Chains
 */
contract zerothonContract is Ownable, ReentrancyGuard, Pausable {
    // State variables
    uint256 public value;
    mapping(address => uint256) public balances;
    
    // Events
    event ValueChanged(uint256 indexed newValue, address indexed changer);
    event Deposit(address indexed user, uint256 amount);
    event Withdrawal(address indexed user, uint256 amount);
    
    // Custom errors (gas-efficient)
    error InvalidAmount();
    error InsufficientBalance();
    error Unauthorized();
    
    constructor() Ownable(msg.sender) {}
    
    /**
     * @dev Store a new value
     * @param newValue The value to store
     */
    function store(uint256 newValue) external whenNotPaused {
        value = newValue;
        emit ValueChanged(newValue, msg.sender);
    }
    
    /**
     * @dev Retrieve the stored value
     * @return The stored value
     */
    function retrieve() external view returns (uint256) {
        return value;
    }
    
    /**
     * @dev Deposit Native Currency
     */
    function deposit() external payable nonReentrant whenNotPaused {
        if (msg.value == 0) revert InvalidAmount();
        
        balances[msg.sender] += msg.value;
        emit Deposit(msg.sender, msg.value);
    }
    
    /**
     * @dev Withdraw Native Currency
     * @param amount Amount to withdraw
     */
    function withdraw(uint256 amount) external nonReentrant whenNotPaused {
        if (amount == 0) revert InvalidAmount();
        if (balances[msg.sender] < amount) revert InsufficientBalance();
        
        balances[msg.sender] -= amount;
        
        (bool success, ) = msg.sender.call{value: amount}("");
        require(success, "Transfer failed");
        
        emit Withdrawal(msg.sender, amount);
    }
    
    /**
     * @dev Get contract balance
     */
    function getContractBalance() external view returns (uint256) {
        return address(this).balance;
    }
    
    /**
     * @dev Emergency pause
     */
    function pause() external onlyOwner {
        _pause();
    }
    
    /**
     * @dev Unpause
     */
    function unpause() external onlyOwner {
        _unpause();
    }
    
    /**
     * @dev Receive function to accept Native Currency
     */
    receive() external payable {
        balances[msg.sender] += msg.value;
        emit Deposit(msg.sender, msg.value);
    }
}
`;

// Validate Solidity code
export function validateSolidityCode(code: string): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  // Check for SPDX license
  if (!code.includes('SPDX-License-Identifier')) {
    errors.push('Missing SPDX license identifier')
  }

  // Check for pragma
  if (!code.includes('pragma solidity')) {
    errors.push('Missing pragma directive')
  }

  // Check for contract definition
  if (!code.includes('contract ')) {
    errors.push('No contract definition found')
  }

  // Check for dangerous patterns
  if (code.includes('tx.origin')) {
    errors.push('Security risk: Using tx.origin (use msg.sender instead)')
  }

  if (code.includes('selfdestruct')) {
    errors.push('Warning: selfdestruct is deprecated')
  }

  return {
    valid: errors.length === 0,
    errors
  }
}
