"use client"

import { useState, useEffect } from "react"
import { Copy, Check, ExternalLink, CheckCircle, Info, Zap, FileText } from "lucide-react"

export function CodeEditor() {
  const [pythonCode, setPythonCode] = useState(`from avax_cli.py_contracts import PySmartContract

@PySmartContract
class SimpleToken:
    def __init__(self, name: str, symbol: str, total_supply: uint256):
        self.name = name
        self.symbol = symbol
        self.total_supply = total_supply
        self.balances = {msg.sender: total_supply}
        
        # Emit initial supply event
        emit Transfer(address(0), msg.sender, total_supply)
    
    @public
    @view
    def balance_of(self, account: address) -> uint256:
        """Get the balance of an account"""
        return self.balances.get(account, 0)
    
    @public
    def transfer(self, to: address, amount: uint256) -> bool:
        """Transfer tokens to another account"""
        require(to != address(0), "Transfer to zero address")
        require(self.balances[msg.sender] >= amount, "Insufficient balance")
        
        self.balances[msg.sender] -= amount
        self.balances[to] += amount
        
        emit Transfer(msg.sender, to, amount)
        return True
    
    @public
    def approve(self, spender: address, amount: uint256) -> bool:
        """Approve spender to transfer tokens"""
        self.allowances[msg.sender][spender] = amount
        emit Approval(msg.sender, spender, amount)
        return True`)

  const [solidityCode, setSolidityCode] = useState("")
  const [compilationResults, setCompilationResults] = useState<any>(null)
  const [activeTab, setActiveTab] = useState("solidity")
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  useEffect(() => {
    // Simulate compilation
    const timer = setTimeout(() => {
      setSolidityCode(`pragma solidity ^0.8.0;

contract SimpleToken {
    string public name;
    string public symbol;
    uint256 public totalSupply;
    mapping(address => uint256) public balances;
    mapping(address => mapping(address => uint256)) public allowances;
    
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
    
    constructor(string memory _name, string memory _symbol, uint256 _totalSupply) {
        name = _name;
        symbol = _symbol;
        totalSupply = _totalSupply;
        balances[msg.sender] = _totalSupply;
        emit Transfer(address(0), msg.sender, _totalSupply);
    }
    
    function balanceOf(address account) public view returns (uint256) {
        return balances[account];
    }
    
    function transfer(address to, uint256 amount) public returns (bool) {
        require(to != address(0), "Transfer to zero address");
        require(balances[msg.sender] >= amount, "Insufficient balance");
        
        balances[msg.sender] -= amount;
        balances[to] += amount;
        
        emit Transfer(msg.sender, to, amount);
        return true;
    }
    
    function approve(address spender, uint256 amount) public returns (bool) {
        allowances[msg.sender][spender] = amount;
        emit Approval(msg.sender, spender, amount);
        return true;
    }
}`)

      setCompilationResults({
        success: true,
        gasEstimate: 1234567,
        optimizationSavings: 15,
        securityScore: 98,
        warnings: 0,
        errors: 0,
        compilationTime: 0.23,
      })
    }, 1000)

    return () => clearTimeout(timer)
  }, [pythonCode])

  const handleCopyCode = async (code: string, type: string) => {
    await navigator.clipboard.writeText(code)
    setCopiedCode(type)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  const tabs = [
    { id: "solidity", name: "Solidity Output", icon: FileText },
    { id: "bytecode", name: "Bytecode", icon: Zap },
    { id: "abi", name: "ABI", icon: Info },
    { id: "deployment", name: "Deploy", icon: ExternalLink },
  ]

  return (
    <div className="flex h-full">
      {/* Python Editor */}
      <div className="flex-1 flex flex-col border-r border-slate-700">
        <div className="bg-slate-900 px-4 py-3 border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full transition-all duration-300 hover:scale-110 cursor-pointer"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full transition-all duration-300 hover:scale-110 cursor-pointer"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full transition-all duration-300 hover:scale-110 cursor-pointer"></div>
            </div>
            <span className="text-sm text-slate-400 font-mono">smart_contract.py</span>
          </div>
          <button
            onClick={() => handleCopyCode(pythonCode, "python")}
            className="text-slate-400 hover:text-white transition-all duration-300 hover:scale-110"
          >
            {copiedCode === "python" ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>

        <div className="flex-1 bg-slate-950">
          <textarea
            value={pythonCode}
            onChange={(e) => setPythonCode(e.target.value)}
            className="w-full h-full p-4 bg-transparent text-slate-300 font-mono text-sm resize-none focus:outline-none transition-all duration-300 focus:bg-slate-900/20"
            placeholder="Write your Python smart contract here..."
          />
        </div>
      </div>

      {/* Output Panel */}
      <div className="flex-1 flex flex-col">
        {/* Compilation Status */}
        {compilationResults && (
          <div className="bg-slate-900 px-4 py-3 border-b border-slate-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span className="text-sm text-green-400 font-medium">Compilation Successful</span>
                <span className="text-xs text-slate-400">({compilationResults.compilationTime}s)</span>
              </div>
              <div className="flex items-center gap-4 text-xs text-slate-400">
                <span>Gas: {compilationResults.gasEstimate.toLocaleString()}</span>
                <span>Optimized: {compilationResults.optimizationSavings}%</span>
                <span>Security: {compilationResults.securityScore}/100</span>
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="bg-slate-900 border-b border-slate-700">
          <div className="flex">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors border-b-2 ${
                  activeTab === tab.id
                    ? "text-blue-400 border-blue-400 bg-slate-800"
                    : "text-slate-400 border-transparent hover:text-white hover:bg-slate-800"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.name}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="flex-1 bg-slate-950">
          {activeTab === "solidity" && (
            <div className="h-full flex flex-col">
              <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-700">
                <span className="text-sm text-slate-400 font-mono">SimpleToken.sol</span>
                <button
                  onClick={() => handleCopyCode(solidityCode, "solidity")}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  {copiedCode === "solidity" ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
              <div className="flex-1 overflow-auto">
                <pre className="p-4 text-sm text-slate-300 font-mono">{solidityCode}</pre>
              </div>
            </div>
          )}

          {activeTab === "bytecode" && (
            <div className="h-full flex flex-col">
              <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-700">
                <span className="text-sm text-slate-400 font-mono">Bytecode</span>
                <button
                  onClick={() => handleCopyCode("608060405234801561001057600080fd5b50...", "bytecode")}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  {copiedCode === "bytecode" ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
              <div className="flex-1 overflow-auto">
                <pre className="p-4 text-sm text-slate-300 font-mono break-all">
                  608060405234801561001057600080fd5b50604051610c38380380610c38833981810160405281019061003291906100fa565b8160009080519060200190610048929190610251565b50806001908051906020019061005f929190610251565b505050610445565b6000815190506100748161042e565b92915050565b6000806040838503121561008d57600080fd5b600061009b85828601610065565b92505060206100ac85828601610065565b9150509250929050565b60006100fa82610402565b6100cb8185610402565b93506100db818560208601610413565b6100e481610446565b840191505092915050565b600061010c826103f7565b9050919050565b60005b8381101561013157808201518184015260208101905061011657600080fd5b83811115610140576000848401525b50505050565b6000600282049050600182168061015e57607f821691505b6020821081141561017257610171610417565b5b50919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b
                </pre>
              </div>
            </div>
          )}

          {activeTab === "abi" && (
            <div className="h-full flex flex-col">
              <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-700">
                <span className="text-sm text-slate-400 font-mono">Contract ABI</span>
                <button
                  onClick={() => handleCopyCode("[]", "abi")}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  {copiedCode === "abi" ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
              <div className="flex-1 overflow-auto">
                <pre className="p-4 text-sm text-slate-300 font-mono">
                  {`[
  {
    "inputs": [
      {"name": "_name", "type": "string"},
      {"name": "_symbol", "type": "string"},
      {"name": "_totalSupply", "type": "uint256"}
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [{"name": "account", "type": "address"}],
    "name": "balanceOf",
    "outputs": [{"name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {"name": "to", "type": "address"},
      {"name": "amount", "type": "uint256"}
    ],
    "name": "transfer",
    "outputs": [{"name": "", "type": "bool"}],
    "stateMutability": "nonpayable",
    "type": "function"
  }
]`}
                </pre>
              </div>
            </div>
          )}

          {activeTab === "deployment" && (
            <div className="h-full p-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-mono font-semibold text-white mb-4">Deploy Contract</h3>
                  <p className="text-slate-400 text-sm mb-6">
                    Deploy your compiled contract to any EVM-compatible network
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Network</label>
                    <select className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500">
                      <option>Ethereum Mainnet</option>
                      <option>Goerli Testnet</option>
                      <option>Polygon</option>
                      <option>BSC</option>
                      <option>Arbitrum</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Constructor Parameters</label>
                    <div className="space-y-2">
                      <input
                        type="text"
                        placeholder="Token Name"
                        className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
                      />
                      <input
                        type="text"
                        placeholder="Token Symbol"
                        className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
                      />
                      <input
                        type="text"
                        placeholder="Total Supply"
                        className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div className="bg-slate-900 rounded-lg p-4 border border-slate-700">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-400">Estimated Gas:</span>
                      <span className="text-white font-mono">1,234,567</span>
                    </div>
                    <div className="flex items-center justify-between text-sm mt-2">
                      <span className="text-slate-400">Estimated Cost:</span>
                      <span className="text-white font-mono">~$45.67</span>
                    </div>
                  </div>

                  <button className="w-full bg-gradient-to-r from-blue-500 to-red-500 hover:from-blue-600 hover:to-red-600 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105">
                    Deploy Contract
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
