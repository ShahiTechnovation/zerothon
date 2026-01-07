# 🚀 ZEROTHON - Agentic AI for Full-Stack dApp Development

> **Build production-ready dApps using natural language and Python smart contracts**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8)](https://tailwindcss.com/)

---

## 🌟 What is ZEROTHON?

ZEROTHON is a **revolutionary agentic AI platform** that transforms natural language descriptions into complete, production-ready decentralized applications (dApps). It combines:

- 🤖 **Multi-Agent AI System** - Specialized agents for contracts, frontends, security, and testing
- 🐍 **Python Smart Contracts** - Write contracts in Python, deploy to any EVM blockchain
- ⚡ **Real-Time Streaming** - Watch AI agents work in real-time
- 🔒 **Security-First** - Automatic audits and OpenZeppelin patterns
- 🌐 **Multi-Chain** - Deploy to Avalanche, Ethereum, Polygon, and more

---

## ✨ Key Features

### 🤖 Agentic AI System

**4 Specialized AI Agents** working together:

1. **ContractGeneratorAgent** - Generates secure Python smart contracts
2. **FrontendGeneratorAgent** - Creates React/Next.js frontends with Web3
3. **SecurityAuditorAgent** - Audits code for vulnerabilities
4. **TestGeneratorAgent** - Generates comprehensive test suites

### 🎯 What You Can Build

- **ERC20 Tokens** - Custom tokens with advanced features
- **NFT Collections** - Complete NFT marketplaces
- **DeFi Protocols** - Staking, lending, DEXs
- **DAO Governance** - Decentralized organizations
- **GameFi** - Blockchain games
- **Custom dApps** - Anything you can imagine

### 🔧 Technical Features

- ✅ **Python → Solidity Transpiler** - Advanced Python to EVM compilation
- ✅ **Multi-Provider LLM Support** - Groq, OpenRouter, DeepSeek, HuggingFace
- ✅ **Streaming Code Generation** - Real-time updates
- ✅ **Monaco Editor Integration** - VS Code-like editing experience
- ✅ **MetaMask Integration** - One-click deployment
- ✅ **IndexedDB File System** - Local project management

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or pnpm
- MetaMask wallet (for deployment)

### Installation

```bash
# Clone the repository
git clone https://github.com/ShahiTechnovation/ZEROTHON.git
cd ZEROTHON

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Using the AI Builder

1. Navigate to `/builder`
2. Describe your dApp in natural language
3. Watch AI agents generate your code
4. Download or deploy your dApp

**No API key required!** The system works with free models out of the box.

---

## 🎨 Usage Examples

### Example 1: Create a Staking Contract

```
Describe your dApp:

Create a staking contract where users can:
- Stake tokens and earn rewards
- Unstake at any time
- Claim accumulated rewards
- Owner can set reward rate
- Emergency pause functionality
```

**Generated Output:**
- ✅ `contract.py` - Python smart contract
- ✅ `App.tsx` - React frontend with Web3
- ✅ `tests.js` - Complete test suite
- ✅ `deployment.ts` - Deployment scripts

### Example 2: NFT Marketplace

```
Build an NFT marketplace with:
- Mint NFTs with metadata
- List NFTs for sale
- Buy and sell functionality
- Royalty payments to creators
- Auction system
```

### Example 3: DAO Governance

```
Create a DAO with:
- Proposal creation
- Voting mechanism
- Timelock for execution
- Treasury management
- Member management
```

---

## 🔌 API Endpoints

### Generate Full-Stack dApp

```typescript
POST /api/agent/generate

{
  "requirements": "Create a token staking contract...",
  "projectType": "defi",
  "chain": "avalanche",
  "model": "llama-3.3-70b-versatile"
}

// Response: Server-Sent Events stream
data: {"type":"thought","agent":"ContractGenerator","content":"..."}
data: {"type":"code","agent":"ContractGenerator","content":"..."}
data: [DONE]
```

### Chat with AI

```typescript
POST /api/agent/chat

{
  "messages": [
    {"role": "user", "content": "Explain this contract"}
  ],
  "model": "llama-3.3-70b-versatile",
  "stream": true
}
```

### Transpile Python to Solidity

```typescript
POST /api/transpile

{
  "source": "class MyContract:\n    ...",
  "compile": true
}

// Response
{
  "success": true,
  "solidity": "contract MyContract {...}",
  "bytecode": "0x608060...",
  "abi": [...]
}
```

---

## 🤖 Supported AI Models

### Free Models (No API Key)

- **HuggingFace Mistral 7B** - No key required
- **HuggingFace Llama 3 8B** - No key required

### Free Models (API Key Required)

| Provider | Model | Speed | Quality | Best For |
|----------|-------|-------|---------|----------|
| **Groq** | Llama 3.3 70B | ⚡⚡⚡ | ⭐⭐⭐⭐⭐ | General use |
| **Groq** | Llama 3.1 8B | ⚡⚡⚡⚡⚡ | ⭐⭐⭐⭐ | Speed |
| **DeepSeek** | DeepSeek Coder | ⚡⚡⚡ | ⭐⭐⭐⭐⭐ | Coding |
| **Together** | Llama 3.1 8B | ⚡⚡⚡ | ⭐⭐⭐⭐ | Balance |
| **OpenRouter** | Various | ⚡⚡ | ⭐⭐⭐⭐ | Variety |

### Getting API Keys

1. **Groq** (Recommended): https://console.groq.com/
2. **DeepSeek**: https://platform.deepseek.com/
3. **Together AI**: https://api.together.xyz/
4. **OpenRouter**: https://openrouter.ai/

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────┐
│                   User Interface                     │
│  (Next.js + React + Tailwind + Monaco Editor)       │
└─────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────┐
│              Agent Orchestrator                      │
│  (Multi-agent coordination & streaming)              │
└─────────────────────────────────────────────────────┘
                         │
        ┌────────────────┼────────────────┐
        ▼                ▼                ▼
┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│  Contract    │ │  Frontend    │ │  Security    │
│  Generator   │ │  Generator   │ │  Auditor     │
└──────────────┘ └──────────────┘ └──────────────┘
        │                │                │
        └────────────────┼────────────────┘
                         ▼
┌─────────────────────────────────────────────────────┐
│              LLM Provider System                     │
│  (Groq, OpenRouter, DeepSeek, HuggingFace)         │
└─────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────┐
│         Python → Solidity Transpiler                 │
│  (Advanced parsing & code generation)                │
└─────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────┐
│            Solidity Compiler (solc)                  │
│  (Bytecode & ABI generation)                         │
└─────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────┐
│         Blockchain Deployment (ethers.js)            │
│  (MetaMask + Multi-chain support)                    │
└─────────────────────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS 4** - Styling
- **shadcn/ui** - UI components
- **Monaco Editor** - Code editing
- **Framer Motion** - Animations

### Backend
- **Next.js API Routes** - Serverless functions
- **Edge Runtime** - Fast, global deployment
- **Server-Sent Events** - Real-time streaming

### Blockchain
- **ethers.js** - Ethereum library
- **solc** - Solidity compiler
- **MetaMask** - Wallet integration

### AI/ML
- **Multiple LLM Providers** - Groq, OpenRouter, etc.
- **Streaming APIs** - Real-time generation
- **Multi-agent System** - Specialized agents

### Storage
- **IndexedDB** - Local file system
- **Dexie.js** - IndexedDB wrapper

---

## 🌐 Supported Blockchains

- ✅ **Avalanche C-Chain** (Primary)
- ✅ **Ethereum** (Mainnet & Sepolia)
- ✅ **Polygon** (Mainnet & Amoy)
- ✅ **Arbitrum** (One & Sepolia)
- ✅ **Optimism** (Mainnet & Sepolia)
- ✅ **Base** (Mainnet & Sepolia)

---

## 📁 Project Structure

```
ZEROTHON/
├── app/                          # Next.js app directory
│   ├── api/                      # API routes
│   │   ├── agent/               # Agent endpoints
│   │   │   ├── generate/        # Code generation
│   │   │   └── chat/            # Chat interface
│   │   ├── transpile/           # Python transpilation
│   │   └── compile/             # Solidity compilation
│   ├── builder/                 # AI Builder page
│   ├── playground/              # Interactive playground
│   └── pyvax-ai/                # ZEROTHON AI page
├── components/                   # React components
│   ├── pyvax-ai/                # AI-specific components
│   │   ├── agentic-builder.tsx  # Main builder UI
│   │   ├── unified-ide.tsx      # IDE component
│   │   └── eliza-agent-assistant.tsx
│   └── ui/                      # shadcn/ui components
├── lib/                         # Core libraries
│   ├── llm/                     # LLM provider system
│   │   ├── providers.ts         # Provider definitions
│   │   └── client.ts            # Universal client
│   ├── agents/                  # Agent system
│   │   └── advanced-orchestrator.ts
│   ├── transpiler/              # Python transpiler
│   │   └── advanced-transpiler.ts
│   └── indexeddb-filesystem.ts  # File system
└── public/                      # Static assets
```

---

## 🧪 Development

### Running Tests

```bash
npm run test
```

### Building for Production

```bash
npm run build
npm run start
```

### Environment Variables

Create `.env.local`:

```bash
# Optional: LLM API Keys
GROQ_API_KEY=your-groq-key
OPENROUTER_API_KEY=your-openrouter-key
TOGETHER_API_KEY=your-together-key
DEEPSEEK_API_KEY=your-deepseek-key

# Default model
DEFAULT_MODEL=llama-3.3-70b-versatile
```

---

## 🤝 Contributing

We welcome contributions! Here's how:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit changes**: `git commit -m 'Add amazing feature'`
4. **Push to branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Areas to Contribute

- 🤖 Add more AI agents
- 🔧 Improve transpiler
- 🎨 Enhance UI/UX
- 📚 Write documentation
- 🧪 Add tests
- 🌐 Add blockchain support

---

## 📝 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **OpenZeppelin** - Security patterns
- **Vercel** - AI SDK inspiration
- **Groq** - Ultra-fast inference
- **StackBlitz** - bolt.new architecture
- **Web3GPT** - Multi-agent inspiration
- **Replit** - Agent architecture

---

## 📞 Support

- **Documentation**: [docs/](./docs/)
- **Issues**: [GitHub Issues](https://github.com/ShahiTechnovation/ZEROTHON/issues)
- **Repository**: [ZEROTHON](https://github.com/ShahiTechnovation/ZEROTHON)

---

## 🗺️ Roadmap

### ✅ Phase 1: Core System (Complete)
- [x] Multi-agent orchestration
- [x] LLM provider system
- [x] Streaming generation
- [x] Python transpiler
- [x] Builder UI

### 🚧 Phase 2: Enhanced Features (In Progress)
- [ ] Automated testing
- [ ] One-click deployment
- [ ] Version control integration
- [ ] Collaborative editing
- [ ] Template marketplace

### 📋 Phase 3: Advanced Features (Planned)
- [ ] AI-powered debugging
- [ ] Gas optimization agent
- [ ] Multi-language support
- [ ] Visual contract builder
- [ ] Blockchain analytics

---

<div align="center">

**Built with ❤️ by the ZEROTHON Team**

[GitHub](https://github.com/ShahiTechnovation/ZEROTHON) • [Documentation](./docs/)

</div># zerothon
