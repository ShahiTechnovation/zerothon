# 🚀 Zerothon - Python Smart Contract Platform

**Build, compile, and deploy Python smart contracts with an AI-powered IDE**

[![Next.js](https://img.shields.io/badge/Next.js-14.2.25-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Python](https://img.shields.io/badge/Python-3.8+-green)](https://www.python.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow)](LICENSE)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Available Routes](#available-routes)
- [Smart Contract Templates](#smart-contract-templates)
- [Zero Wizard](#zero-wizard)
- [Python Compiler](#python-compiler)
- [Development](#development)
- [Deployment](#deployment)
- [Documentation](#documentation)

---

## 🎯 Overview

Zerothon is a comprehensive platform for developing Python-based smart contracts. It features:

- **Unified IDE**: Monaco-based code editor with Python and Solidity support
- **Zero Wizard**: Interactive contract generator (OpenZeppelin-style)
- **Python Compiler**: Transpiles Python to EVM bytecode
- **AI Assistant**: Integrated AI chat for contract development
- **Contract Explorer**: View and interact with deployed contracts
- **Template Library**: Pre-built contract templates

---

## ✨ Features

### 🎨 **Zero Wizard** (`/wizard`)
Interactive smart contract builder with:
- **Contract Types**: Token (ERC20), NFT (ERC721), Vault, Governance
- **Modules**: Ownable, Mintable, Burnable, Pausable, ReentrancyGuard
- **Real-time Code Generation**: Compiler-compatible Python code
- **Security Analysis**: Built-in security checks
- **Production-Ready**: 500-650 lines per contract, 30-40 functions

### 💻 **Playground** (`/playground`)
Full-featured IDE with:
- **Monaco Editor**: Syntax highlighting, autocomplete
- **Multi-language**: Python, Solidity, JavaScript
- **Compiler Integration**: Real-time compilation
- **Deployment**: Deploy to blockchain
- **Interaction**: Call contract functions
- **File Management**: Save/load contracts

### 🤖 **AI Chat** (`/ai-chat`)
AI-powered development assistant:
- Contract generation
- Code explanation
- Bug fixing
- Best practices

### 📚 **Templates** (`/templates`)
Pre-built contracts:
- **Python Contracts**: TokenMint, NFTSimple, Staking, DeFiSwap
- **Wizard Examples**: AdvancedToken, AdvancedNFT, SecureVault
- **Production-Ready**: Fully tested and documented

### 🔍 **Explorer** (`/explorer`)
Blockchain explorer:
- View deployed contracts
- Transaction history
- Contract interaction
- Event logs

---

## 🛠 Tech Stack

### Frontend
- **Framework**: Next.js 14.2.25
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4.1.9
- **UI Components**: Radix UI
- **Animations**: Framer Motion, GSAP
- **3D Graphics**: Three.js, React Three Fiber
- **Code Editor**: Monaco Editor

### Backend
- **Runtime**: Node.js
- **API**: Next.js API Routes
- **Database**: Dexie (IndexedDB)
- **Authentication**: JWT

### Blockchain
- **Library**: ethers.js
- **Compiler**: solc 0.8.30
- **Python Runtime**: Pyodide 0.29.0

### AI
- **Provider**: OpenRouter
- **SDK**: Vercel AI SDK

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or pnpm
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/ShahiTechnovation/zerothon.git
cd zerothon

# Install dependencies
npm install --legacy-peer-deps

# Run development server
npm run dev
```

The app will be available at `http://localhost:3000`

### Build for Production

```bash
# Create production build
npm run build

# Start production server
npm start
```

---

## 📁 Project Structure

```
zerothon/
├── app/                          # Next.js app directory
│   ├── ai-chat/                  # AI assistant page
│   ├── api/                      # API routes
│   ├── contract/                 # Contract details page
│   ├── docs/                     # Documentation page
│   ├── explorer/                 # Blockchain explorer
│   ├── features/                 # Features showcase
│   ├── playground/               # IDE page
│   ├── templates/                # Template gallery
│   └── wizard/                   # Zero Wizard page
├── components/                   # React components
│   ├── bottom-dock-menu.tsx      # Navigation dock
│   ├── ui/                       # UI components (Radix)
│   └── zerothan-ai/              # IDE components
│       └── unified-ide.tsx       # Main IDE component
├── lib/                          # Utilities and libraries
│   ├── pychain/                  # Python smart contract library
│   │   └── std/                  # Standard library
│   │       ├── base/             # Base contracts (Token, NFT)
│   │       └── mixins/           # Composable modules
│   ├── plugins/                  # Compiler plugins
│   └── utils/                    # Helper functions
├── templates/                    # Contract templates
│   ├── python_contracts/         # Basic Python contracts
│   └── wizard_examples/          # Generated examples
├── zerothan_cli/                 # Python to EVM compiler
│   ├── transpiler.py             # AST analyzer & bytecode generator
│   ├── compiler.py               # Compilation orchestration
│   ├── py_contracts.py           # Base contract classes
│   └── deployer.py               # Deployment utilities
├── python-compiler-service/      # Compiler microservice
├── docs/                         # Documentation
│   ├── ZERO_WIZARD_*.md          # Wizard documentation
│   └── *.md                      # Other guides
├── public/                       # Static assets
├── scripts/                      # Build scripts
│   └── sync-cli.js               # CLI sync script
└── package.json                  # Dependencies
```

---

## 🌐 Available Routes

| Route | Description | Features |
|-------|-------------|----------|
| `/` | Home page | Landing, features showcase |
| `/playground` | IDE | Code editor, compiler, deployment |
| `/wizard` | Contract wizard | Interactive contract builder |
| `/templates` | Template gallery | Pre-built contracts |
| `/ai-chat` | AI assistant | Contract generation, help |
| `/explorer` | Blockchain explorer | View contracts, transactions |
| `/contract/[address]` | Contract details | Interact with deployed contracts |
| `/docs` | Documentation | Guides, API reference |
| `/features` | Features page | Platform capabilities |

---

## 📝 Smart Contract Templates

### Python Contracts (`templates/python_contracts/`)

1. **TokenMint.py** (~90 lines)
   - Basic ERC20 token
   - Minting and burning
   - Admin controls

2. **NFTSimple.py** (~95 lines)
   - Basic ERC721 NFT
   - Minting and transfers
   - Approval system

3. **Staking.py** (~95 lines)
   - Token staking
   - Reward calculation
   - Stake/unstake

4. **DeFiSwap.py** (~100 lines)
   - Token swapping
   - Liquidity pools
   - Price calculation

### Wizard Examples (`templates/wizard_examples/`)

1. **MyToken.py** (~500 lines, 30+ functions)
   - Complete ERC20 implementation
   - Minting, burning, pausing
   - Blacklist, transfer controls
   - Statistics tracking

2. **MyNFT.py** (~600 lines, 35+ functions)
   - Complete ERC721 implementation
   - Metadata management
   - Royalty system
   - Operator approvals

3. **SecureVault.py** (~650 lines, 40+ functions)
   - Time-locked withdrawals
   - Fee system
   - Whitelist/blacklist
   - Emergency mode

---

## 🧙‍♂️ Zero Wizard

The Zero Wizard is an interactive contract builder inspired by OpenZeppelin's Contracts Wizard.

### Features

- **4-Step Process**:
  1. Select contract type (Token, NFT, Vault, Governance)
  2. Configure parameters (name, symbol, decimals, supply)
  3. Enable modules (Ownable, Mintable, Burnable, Pausable, etc.)
  4. Preview and export code

- **Module System**:
  - Ownable: Single-owner access control
  - Mintable: Create new tokens/NFTs
  - Burnable: Destroy tokens/NFTs
  - Pausable: Emergency pause
  - ReentrancyGuard: Attack prevention

- **Security Analysis**:
  - Conflict detection
  - Access control checks
  - Reentrancy warnings
  - Best practice suggestions

### Generated Code

All generated contracts:
- ✅ Import from `zerothan.py_contracts`
- ✅ Use `@public_function` and `@view_function` decorators
- ✅ Include comprehensive error handling
- ✅ Emit events for all state changes
- ✅ Are compiler-compatible

---

## 🔧 Python Compiler

The `zerothan_cli` transpiles Python smart contracts to EVM bytecode.

### Architecture

```
Python Source Code
       ↓
AST Analysis (transpiler.py)
       ↓
State Variables & Functions Extraction
       ↓
EVM Bytecode Generation
       ↓
Deployable Contract
```

### Key Components

1. **transpiler.py**: AST analyzer and bytecode generator
2. **compiler.py**: Compilation orchestration
3. **py_contracts.py**: Base contract classes
4. **deployer.py**: Deployment utilities

### Usage

```python
from zerothan.py_contracts import PySmartContract

class MyContract(PySmartContract):
    def __init__(self):
        super().__init__()
        self.my_var = self.state_var("my_var", 0)
    
    @public_function
    def set_value(self, value: int):
        self.my_var = value
        self.event("ValueSet", value)
    
    @view_function
    def get_value(self) -> int:
        return self.my_var
```

---

## 💻 Development

### Scripts

```bash
# Development server (with CLI sync)
npm run dev

# Production build
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

### Environment Variables

Create `.env.local`:

```env
# Optional: Add your environment variables here
NEXT_PUBLIC_APP_NAME=Zerothon
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Adding New Templates

1. Create contract in `templates/python_contracts/` or `templates/wizard_examples/`
2. Follow the compiler-compatible format
3. Add to template gallery in `app/templates/page.tsx`

---

## 🚀 Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in Vercel
3. Deploy automatically

```bash
# Or use Vercel CLI
npm install -g vercel
vercel --prod
```

### Manual Deployment

```bash
# Build
npm run build

# Start
npm start
```

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed instructions.

---

## 📚 Documentation

### Zero Wizard Docs

- [Architecture](docs/ZERO_WIZARD_ARCHITECTURE.md) - System design
- [Modules](docs/ZERO_WIZARD_MODULES.md) - Module composition
- [Security](docs/ZERO_WIZARD_SECURITY.md) - Security best practices
- [Quick Reference](docs/ZERO_WIZARD_QUICK_REFERENCE.md) - Cheat sheet
- [Compiler Compatibility](docs/ZERO_WIZARD_COMPILER_COMPATIBLE.md) - Compiler guide
- [Production Contracts](docs/ZERO_WIZARD_PRODUCTION_CONTRACTS.md) - Contract features

### Other Guides

- [Deployment Guide](DEPLOYMENT.md) - GitHub & Vercel deployment
- [Quick Deploy](DEPLOY_QUICK.md) - Quick reference

---

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

## 📄 License

This project is licensed under the MIT License.

---

## 🙏 Acknowledgments

- **OpenZeppelin**: Inspiration for the Wizard
- **Next.js Team**: Amazing framework
- **Vercel**: Hosting and deployment
- **Monaco Editor**: Code editor
- **Radix UI**: UI components

---

## 📞 Support

- **GitHub**: [ShahiTechnovation/zerothon](https://github.com/ShahiTechnovation/zerothon)
- **Issues**: [Report bugs](https://github.com/ShahiTechnovation/zerothon/issues)
- **Discussions**: [Community forum](https://github.com/ShahiTechnovation/zerothon/discussions)

---

## 🎯 Roadmap

### Current (v1.0)
- ✅ Zero Wizard with 5 modules
- ✅ Production-ready contracts
- ✅ Unified IDE
- ✅ Python compiler
- ✅ Template library

### Upcoming (v1.1)
- [ ] More wizard modules (AccessControl, Permit, Upgradeable)
- [ ] Enhanced compiler optimizations
- [ ] Contract verification
- [ ] Testnet deployment
- [ ] Wallet integration

### Future (v2.0)
- [ ] Multi-chain support
- [ ] Contract marketplace
- [ ] Audit integration
- [ ] Advanced analytics
- [ ] Team collaboration

---

**Built with ❤️ by the Zerothon Team**

*Making Python smart contract development accessible to everyone*

---

**Last Updated**: January 15, 2026  
**Version**: 1.0.0  
**Status**: Production Ready
