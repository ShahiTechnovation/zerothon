"use client"

import { useState } from "react"
import { Copy, Check, ExternalLink, AlertTriangle, Info, CheckCircle, Zap, Shield } from "lucide-react"

export function DocsContent() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  const handleCopyCode = async (code: string, id: string) => {
    await navigator.clipboard.writeText(code)
    setCopiedCode(id)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  const codeExamples = {
    installation: `# Install PyVax CLI
pip install -e .

# Or with requirements.txt
pip install -r requirements.txt
pip install -e .

# Development installation
pip install -e ".[dev]"

# Initialize new project
python -m avax_cli.cli init my_project
cd my_project`,

    firstContract: `from avax_cli.py_contracts import PySmartContract

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
        return self.stored_data`,

    compilation: `# Compile contracts
python -m avax_cli.cli compile

# Deploy to Fuji testnet (default)
python -m avax_cli.cli deploy SimpleStorage

# Deploy to mainnet
python -m avax_cli.cli deploy SimpleStorage --network mainnet

# Deploy with constructor arguments
python -m avax_cli.cli deploy SimpleStorage --args '[42]'

# Dry run (estimate gas only)
python -m avax_cli.cli deploy SimpleStorage --dry-run`,

    walletManagement: `# Create new wallet
python -m avax_cli.cli wallet new

# Show wallet info
python -m avax_cli.cli wallet show

# Create wallet with custom password
python -m avax_cli.cli wallet new --password mypassword

# Use custom keystore file
python -m avax_cli.cli wallet new --keystore my_key.json`,

    configuration: `{
  "network": "fuji",
  "rpc_url": "https://api.avax-test.network/ext/bc/C/rpc",
  "chain_id": 43113,
  "explorer_api_key": ""
}`,

    testing: `#!/usr/bin/env python3
from avax_cli.deployer import deploy_contract
from avax_cli.wallet import WalletManager
import json

# Load configuration
with open("avax_config.json") as f:
    config = json.load(f)

# Deploy contract
wallet = WalletManager()
result = deploy_contract(
    contract_name="SimpleStorage",
    constructor_args=[],
    config=config,
    wallet=wallet
)

print(f"Contract deployed at: {result['address']}")`,

    counterExample: `from avax_cli.py_contracts import PySmartContract

class Counter(PySmartContract):
    def __init__(self):
        super().__init__()
        self.count = self.state_var("count", 0)
    
    @public_function
    def increment(self):
        self.count = self.count + 1
        self.event("Incremented", self.count)
    
    @view_function
    def get_count(self) -> int:
        return self.count`,
  }

  return (
    <div className="max-w-4xl">
      <div className="prose prose-invert max-w-none">
        {/* Introduction */}
        <section id="introduction" className="mb-16">
          <h1 className="text-4xl font-mono font-bold text-white mb-6">PyVax Documentation</h1>
          <p className="text-xl text-slate-400 leading-relaxed mb-8">
            Welcome to PyVax, a production-ready CLI tool for deploying Solidity and Python smart contracts to Avalanche
            C-Chain. It features a unique Python-to-EVM transpiler that allows you to write smart contracts in Python
            and deploy them directly to the blockchain.
          </p>

          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-6 mb-8">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-blue-400 font-semibold mb-2">Key Features</h3>
                <ul className="text-slate-300 text-sm leading-relaxed space-y-1">
                  <li>• Python Smart Contracts with EVM transpilation</li>
                  <li>• Full Solidity support and compilation</li>
                  <li>• Multi-network deployment (Fuji testnet & mainnet)</li>
                  <li>• Secure wallet management with PBKDF2 encryption</li>
                  <li>• Gas estimation and deployment tracking</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Installation */}
        <section id="installation" className="mb-16">
          <h2 className="text-3xl font-mono font-bold text-white mb-6">Installation</h2>
          <p className="text-slate-400 mb-6">
            Get started with PyVax by installing the CLI tool and setting up your development environment.
          </p>

          <div className="bg-slate-950 rounded-lg border border-slate-700 overflow-hidden mb-6">
            <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-700">
              <span className="text-sm text-slate-400 font-mono">Terminal</span>
              <button
                onClick={() => handleCopyCode(codeExamples.installation, "installation")}
                className="text-slate-400 hover:text-white transition-colors"
              >
                {copiedCode === "installation" ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            <pre className="p-4 text-sm text-slate-300 font-mono overflow-x-auto">{codeExamples.installation}</pre>
          </div>

          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span className="text-green-400 font-semibold text-sm">Requirements</span>
            </div>
            <ul className="text-slate-300 text-sm mt-2 space-y-1">
              <li>• Python 3.8 or higher</li>
              <li>• Git (for version control)</li>
              <li>• AVAX tokens for deployment (testnet faucet available)</li>
            </ul>
          </div>
        </section>

        {/* Quick Start */}
        <section id="quick-start" className="mb-16">
          <h2 className="text-3xl font-mono font-bold text-white mb-6">Quick Start</h2>
          <p className="text-slate-400 mb-6">
            Create your first smart contract in minutes with this step-by-step guide.
          </p>

          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-red-500 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                1
              </div>
              <div>
                <h3 className="text-white font-semibold mb-2">Initialize a new project</h3>
                <p className="text-slate-400 text-sm">
                  Creates sample contracts, config files, and deployment scripts.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-red-500 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                2
              </div>
              <div>
                <h3 className="text-white font-semibold mb-2">Create a wallet</h3>
                <p className="text-slate-400 text-sm">Generate an encrypted wallet for contract deployment.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-red-500 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                3
              </div>
              <div>
                <h3 className="text-white font-semibold mb-2">Compile and deploy</h3>
                <p className="text-slate-400 text-sm">Compile Python contracts and deploy to Avalanche networks.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Wallet Management */}
        <section id="wallet-management" className="mb-16">
          <h2 className="text-3xl font-mono font-bold text-white mb-6">Wallet Management</h2>
          <p className="text-slate-400 mb-6">
            PyVax includes secure wallet management with PBKDF2 encryption for safe private key storage.
          </p>

          <div className="bg-slate-950 rounded-lg border border-slate-700 overflow-hidden mb-6">
            <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-700">
              <span className="text-sm text-slate-400 font-mono">Terminal</span>
              <button
                onClick={() => handleCopyCode(codeExamples.walletManagement, "walletManagement")}
                className="text-slate-400 hover:text-white transition-colors"
              >
                {copiedCode === "walletManagement" ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            <pre className="p-4 text-sm text-slate-300 font-mono overflow-x-auto">{codeExamples.walletManagement}</pre>
          </div>

          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-yellow-400 font-semibold mb-2">Important: Fund Your Wallet</h3>
                <p className="text-slate-300 text-sm leading-relaxed">
                  Make sure to fund your wallet with AVAX before deploying contracts. Use the{" "}
                  <a href="https://faucet.avax.network/" className="text-blue-400 hover:underline">
                    Fuji testnet faucet
                  </a>{" "}
                  for testing.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Python Smart Contracts */}
        <section id="python-contracts" className="mb-16">
          <h2 className="text-3xl font-mono font-bold text-white mb-6">Python Smart Contracts</h2>
          <p className="text-slate-400 mb-6">
            Write smart contracts using familiar Python syntax with PyVax's special contract framework.
          </p>

          <div className="bg-slate-950 rounded-lg border border-slate-700 overflow-hidden mb-6">
            <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-700">
              <span className="text-sm text-slate-400 font-mono">contracts/SimpleStorage.py</span>
              <button
                onClick={() => handleCopyCode(codeExamples.firstContract, "firstContract")}
                className="text-slate-400 hover:text-white transition-colors"
              >
                {copiedCode === "firstContract" ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            <pre className="p-4 text-sm text-slate-300 font-mono overflow-x-auto">{codeExamples.firstContract}</pre>
          </div>

          <div className="bg-slate-900 rounded-lg p-6 border border-slate-700 mb-6">
            <h3 className="text-white font-semibold mb-4">Python Contract Features</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span className="text-slate-300 text-sm">
                    State Variables: <code className="text-blue-400">self.state_var(name, value)</code>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span className="text-slate-300 text-sm">
                    Public Functions: <code className="text-blue-400">@public_function</code>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span className="text-slate-300 text-sm">
                    View Functions: <code className="text-blue-400">@view_function</code>
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span className="text-slate-300 text-sm">
                    Events: <code className="text-blue-400">self.event(name, *params)</code>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span className="text-slate-300 text-sm">
                    Basic Types: <code className="text-blue-400">int, str</code>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span className="text-slate-300 text-sm">Familiar Python syntax</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-950 rounded-lg border border-slate-700 overflow-hidden mb-6">
            <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-700">
              <span className="text-sm text-slate-400 font-mono">contracts/Counter.py</span>
              <button
                onClick={() => handleCopyCode(codeExamples.counterExample, "counterExample")}
                className="text-slate-400 hover:text-white transition-colors"
              >
                {copiedCode === "counterExample" ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            <pre className="p-4 text-sm text-slate-300 font-mono overflow-x-auto">{codeExamples.counterExample}</pre>
          </div>
        </section>

        {/* Configuration */}
        <section id="configuration" className="mb-16">
          <h2 className="text-3xl font-mono font-bold text-white mb-6">Configuration</h2>
          <p className="text-slate-400 mb-6">
            Configure network settings and deployment parameters in your project's configuration file.
          </p>

          <div className="bg-slate-950 rounded-lg border border-slate-700 overflow-hidden mb-6">
            <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-700">
              <span className="text-sm text-slate-400 font-mono">avax_config.json</span>
              <button
                onClick={() => handleCopyCode(codeExamples.configuration, "configuration")}
                className="text-slate-400 hover:text-white transition-colors"
              >
                {copiedCode === "configuration" ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            <pre className="p-4 text-sm text-slate-300 font-mono overflow-x-auto">{codeExamples.configuration}</pre>
          </div>

          <div className="bg-slate-900 rounded-lg p-6 border border-slate-700">
            <h3 className="text-white font-semibold mb-4">Supported Networks</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="text-left text-slate-300 py-2">Network</th>
                    <th className="text-left text-slate-300 py-2">Chain ID</th>
                    <th className="text-left text-slate-300 py-2">RPC URL</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-slate-800">
                    <td className="text-slate-400 py-2">Fuji (Testnet)</td>
                    <td className="text-slate-400 py-2">43113</td>
                    <td className="text-slate-400 py-2 font-mono text-xs">
                      https://api.avax-test.network/ext/bc/C/rpc
                    </td>
                  </tr>
                  <tr>
                    <td className="text-slate-400 py-2">Mainnet</td>
                    <td className="text-slate-400 py-2">43114</td>
                    <td className="text-slate-400 py-2 font-mono text-xs">https://api.avax.network/ext/bc/C/rpc</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Compilation and Deployment */}
        <section id="compilation" className="mb-16">
          <h2 className="text-3xl font-mono font-bold text-white mb-6">Compilation & Deployment</h2>
          <p className="text-slate-400 mb-6">
            Compile your Python contracts to Solidity and deploy them to Avalanche networks with gas estimation.
          </p>

          <div className="bg-slate-950 rounded-lg border border-slate-700 overflow-hidden mb-6">
            <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-700">
              <span className="text-sm text-slate-400 font-mono">Terminal</span>
              <button
                onClick={() => handleCopyCode(codeExamples.compilation, "compilation")}
                className="text-slate-400 hover:text-white transition-colors"
              >
                {copiedCode === "compilation" ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            <pre className="p-4 text-sm text-slate-300 font-mono overflow-x-auto">{codeExamples.compilation}</pre>
          </div>
        </section>

        {/* Deployment Scripts */}
        <section id="deployment-scripts" className="mb-16">
          <h2 className="text-3xl font-mono font-bold text-white mb-6">Deployment Scripts</h2>
          <p className="text-slate-400 mb-6">
            Create custom deployment scripts for complex deployment scenarios and automation.
          </p>

          <div className="bg-slate-950 rounded-lg border border-slate-700 overflow-hidden mb-6">
            <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-700">
              <span className="text-sm text-slate-400 font-mono">scripts/deploy.py</span>
              <button
                onClick={() => handleCopyCode(codeExamples.testing, "testing")}
                className="text-slate-400 hover:text-white transition-colors"
              >
                {copiedCode === "testing" ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            <pre className="p-4 text-sm text-slate-300 font-mono overflow-x-auto">{codeExamples.testing}</pre>
          </div>
        </section>

        {/* Security */}
        <section id="security" className="mb-16">
          <h2 className="text-3xl font-mono font-bold text-white mb-6">Security Best Practices</h2>
          <p className="text-slate-400 mb-6">
            Follow these security guidelines to protect your contracts and private keys.
          </p>

          <div className="space-y-4">
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-red-400 font-semibold mb-2">Private Key Security</h3>
                  <ul className="text-slate-300 text-sm space-y-1">
                    <li>• Never commit private keys to version control</li>
                    <li>• Use strong passwords for wallet encryption</li>
                    <li>• Backup keystore files securely</li>
                    <li>• Use environment variables for CI/CD</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-green-400 font-semibold mb-2">Development Best Practices</h3>
                  <ul className="text-slate-300 text-sm space-y-1">
                    <li>• Test on Fuji testnet before mainnet deployment</li>
                    <li>• Use dry-run mode to estimate gas costs</li>
                    <li>• Implement proper error handling in contracts</li>
                    <li>• Follow smart contract security patterns</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Next Steps */}
        <section id="next-steps" className="mb-16">
          <h2 className="text-3xl font-mono font-bold text-white mb-6">Next Steps</h2>
          <p className="text-slate-400 mb-6">
            Now that you understand the basics, explore these resources to become a PyVax expert:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <a
              href="/templates"
              className="block bg-gradient-to-br from-slate-900 to-slate-800 rounded-lg p-6 border border-slate-700 hover:border-blue-500/50 transition-all duration-300 group"
            >
              <div className="flex items-center gap-3 mb-3">
                <Zap className="w-6 h-6 text-blue-400" />
                <h3 className="text-white font-semibold">Contract Templates</h3>
                <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-blue-400 ml-auto" />
              </div>
              <p className="text-slate-400 text-sm">
                Explore ready-to-use contract templates for tokens, NFTs, DeFi, and more.
              </p>
            </a>

            <a
              href="/playground"
              className="block bg-gradient-to-br from-slate-900 to-slate-800 rounded-lg p-6 border border-slate-700 hover:border-blue-500/50 transition-all duration-300 group"
            >
              <div className="flex items-center gap-3 mb-3">
                <Shield className="w-6 h-6 text-green-400" />
                <h3 className="text-white font-semibold">Try the Playground</h3>
                <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-green-400 ml-auto" />
              </div>
              <p className="text-slate-400 text-sm">
                Test your Python contracts in our interactive playground with real-time compilation.
              </p>
            </a>
          </div>
        </section>
      </div>
    </div>
  )
}
