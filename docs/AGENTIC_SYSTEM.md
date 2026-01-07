# PyVax Agentic AI System

## Complete Implementation Guide

### Overview

PyVax now features a **fully functional agentic AI system** for building complete full-stack dApps using natural language. The system combines multiple specialized AI agents that work together to generate, audit, test, and deploy smart contracts and frontends.

---

## 🏗️ Architecture

### Multi-Agent System

The system uses **4 specialized AI agents** that collaborate:

1. **ContractGeneratorAgent**
   - Generates Python smart contracts using PyVax syntax
   - Follows OpenZeppelin security patterns
   - Includes comprehensive documentation
   - Optimizes for gas efficiency

2. **FrontendGeneratorAgent**
   - Creates React/Next.js frontends
   - Integrates Web3 functionality (ethers.js)
   - Implements wallet connection
   - Builds responsive UIs with Tailwind CSS

3. **SecurityAuditorAgent**
   - Audits contracts for vulnerabilities
   - Identifies attack vectors (reentrancy, overflow, etc.)
   - Suggests security improvements
   - Provides security scores

4. **TestGeneratorAgent**
   - Generates comprehensive test suites
   - Creates unit and integration tests
   - Tests edge cases and security properties
   - Verifies gas usage

### Agent Orchestrator

The `AgentOrchestrator` manages agent execution:
- Coordinates multi-agent workflows
- Handles dependencies between tasks
- Streams real-time updates
- Manages context and state

---

## 🤖 LLM Provider System

### Supported Providers

The system supports **multiple free and paid AI providers**:

#### Free Providers (No API Key Required)
- **HuggingFace Inference API**
  - Mistral 7B Instruct
  - Llama 3 8B
  - No API key needed
  - Rate limited

#### Free Providers (API Key Required)
- **Groq** (Recommended for speed)
  - Llama 3.3 70B Versatile
  - Llama 3.1 8B Instant
  - Mixtral 8x7B
  - Ultra-fast inference

- **OpenRouter**
  - Llama 3.2 3B (Free)
  - Gemma 2 9B (Free)
  - Qwen 2 7B (Free)
  - Access to many models

- **Together AI**
  - Llama 3.1 8B Turbo
  - Qwen 2.5 7B Turbo
  - Free tier available

- **DeepSeek**
  - DeepSeek Chat
  - DeepSeek Coder
  - Specialized for coding

### Getting API Keys

1. **Groq** (Recommended): https://console.groq.com/
2. **OpenRouter**: https://openrouter.ai/
3. **Together AI**: https://api.together.xyz/
4. **DeepSeek**: https://platform.deepseek.com/

---

## 📁 File Structure

```
lib/
├── llm/
│   ├── providers.ts          # LLM provider definitions
│   └── client.ts              # Universal LLM client with streaming
├── agents/
│   ├── advanced-orchestrator.ts  # Multi-agent orchestration
│   └── pyvax-agent.ts         # Legacy agent system
└── transpiler/
    └── advanced-transpiler.ts # Python → Solidity transpiler

app/api/
├── agent/
│   ├── generate/route.ts      # Streaming generation endpoint
│   └── chat/route.ts          # Chat endpoint
├── transpile/route.ts         # Python transpilation
└── compile/route.ts           # Solidity compilation

components/pyvax-ai/
├── agentic-builder.tsx        # Main builder UI
├── unified-ide.tsx            # IDE component
└── eliza-agent-assistant.tsx  # AI assistant

app/
└── builder/page.tsx           # Builder page
```

---

## 🚀 Usage

### 1. Access the Builder

Navigate to `/builder` in your browser:
```
http://localhost:3000/builder
```

### 2. Configure Settings

Click the **Settings** button to configure:
- **AI Model**: Choose from available models
- **API Key**: Optional (required for better models)

### 3. Create a Project

1. **Select Project Type**:
   - ERC20 Token
   - NFT Collection
   - DeFi Protocol
   - DAO Governance
   - GameFi
   - Custom dApp

2. **Choose Blockchain**:
   - Avalanche C-Chain
   - Ethereum
   - Polygon
   - Arbitrum
   - Optimism
   - Base

3. **Describe Requirements**:
   ```
   Create a staking contract where users can stake tokens and earn rewards.
   
   Features:
   - Stake and unstake functions
   - Reward calculation based on time staked
   - Emergency withdraw function
   - Owner controls for reward rate
   - Pausable functionality
   ```

4. **Click "Generate Full-Stack dApp"**

### 4. Watch Agents Work

The system will stream real-time updates showing:
- Agent thoughts and reasoning
- Actions being taken
- Code being generated
- Files being created
- Tests being run

### 5. Review Generated Code

The builder generates:
- **contract.py**: Python smart contract
- **App.tsx**: React frontend
- **tests.js**: Test suite
- **deployment.ts**: Deployment scripts

### 6. Download or Deploy

- **Download All**: Get all files as separate downloads
- **Copy Code**: Copy individual files
- **Deploy**: Deploy directly to blockchain (coming soon)

---

## 🔧 API Endpoints

### Generate Full-Stack dApp

**POST** `/api/agent/generate`

```typescript
{
  "requirements": "Create a staking contract...",
  "projectType": "defi",
  "chain": "avalanche",
  "model": "llama-3.3-70b-versatile",
  "apiKey": "optional-api-key"
}
```

**Response**: Server-Sent Events (SSE) stream

```typescript
data: {"type":"thought","agent":"ContractGenerator","content":"Analyzing requirements..."}
data: {"type":"action","agent":"ContractGenerator","content":"Generating contract..."}
data: {"type":"code","agent":"ContractGenerator","content":"class StakingContract:"}
data: {"type":"complete","agent":"ContractGenerator","data":{...}}
data: [DONE]
```

### Chat with AI

**POST** `/api/agent/chat`

```typescript
{
  "messages": [
    {"role": "user", "content": "Explain this contract"}
  ],
  "model": "llama-3.3-70b-versatile",
  "stream": true
}
```

### Transpile Python to Solidity

**POST** `/api/transpile`

```typescript
{
  "source": "class MyContract:\n    ...",
  "compile": true
}
```

**Response**:
```typescript
{
  "success": true,
  "solidity": "contract MyContract {...}",
  "bytecode": "0x608060...",
  "abi": [...],
  "metadata": {...}
}
```

---

## 💻 Code Examples

### Using the LLM Client

```typescript
import { llmClient } from '@/lib/llm/client'

// Set API key
llmClient.setApiKey('groq', 'your-api-key')

// Generate completion
const response = await llmClient.generate({
  model: 'llama-3.3-70b-versatile',
  messages: [
    { role: 'system', content: 'You are a smart contract expert' },
    { role: 'user', content: 'Generate an ERC20 token' }
  ],
  temperature: 0.7,
  maxTokens: 4096
})

console.log(response.content)
```

### Using Streaming

```typescript
for await (const chunk of llmClient.generateStream({
  model: 'llama-3.3-70b-versatile',
  messages: [...],
  stream: true
})) {
  if (!chunk.done) {
    process.stdout.write(chunk.content)
  }
}
```

### Using the Orchestrator

```typescript
import { orchestrator } from '@/lib/agents/advanced-orchestrator'

// Set context
orchestrator.setContext({
  projectType: 'token',
  chain: 'avalanche',
  requirements: 'Create an ERC20 token with minting'
})

// Execute workflow
for await (const update of orchestrator.executeWorkflow('Create token')) {
  console.log(update.type, update.content)
}
```

### Using the Transpiler

```typescript
import { advancedTranspiler } from '@/lib/transpiler/advanced-transpiler'

const pythonCode = `
class MyToken:
    def __init__(self):
        self.name: str = "MyToken"
        self.symbol: str = "MTK"
        self.total_supply: int = 1000000
    
    def balance_of(self, account: address) -> int:
        return 0
`

const result = advancedTranspiler.transpile(pythonCode)
console.log(result.solidity)
```

---

## 🎨 Features

### Real-Time Streaming
- Live updates as agents work
- See code being generated character by character
- Track agent thoughts and actions

### Multi-Agent Collaboration
- Agents work together on complex tasks
- Automatic task dependency management
- Parallel execution where possible

### Security-First
- Automatic security audits
- OpenZeppelin pattern integration
- Vulnerability detection

### Full-Stack Generation
- Smart contracts in Python
- React frontends with Web3
- Complete test suites
- Deployment scripts

### Multi-Chain Support
- Avalanche C-Chain
- Ethereum
- Polygon
- Arbitrum
- Optimism
- Base

---

## 🔒 Security

### Best Practices

1. **Never commit API keys** to version control
2. **Use environment variables** for sensitive data
3. **Validate all generated code** before deployment
4. **Run security audits** on production contracts
5. **Test thoroughly** on testnets first

### Environment Variables

Create `.env.local`:

```bash
# LLM API Keys (optional)
GROQ_API_KEY=your-groq-key
OPENROUTER_API_KEY=your-openrouter-key
TOGETHER_API_KEY=your-together-key
DEEPSEEK_API_KEY=your-deepseek-key

# Default model
DEFAULT_MODEL=llama-3.3-70b-versatile
```

---

## 🧪 Testing

### Running the System

1. **Install dependencies**:
```bash
npm install
```

2. **Start development server**:
```bash
npm run dev
```

3. **Open builder**:
```
http://localhost:3000/builder
```

### Testing Without API Keys

The system works with **HuggingFace's free inference API** (no key required):
- Model: `mistralai/Mistral-7B-Instruct-v0.2`
- No authentication needed
- Rate limited but functional

---

## 📊 Performance

### Model Comparison

| Provider | Model | Speed | Quality | Free |
|----------|-------|-------|---------|------|
| Groq | Llama 3.3 70B | ⚡⚡⚡ | ⭐⭐⭐⭐⭐ | ✅ |
| Groq | Llama 3.1 8B | ⚡⚡⚡⚡⚡ | ⭐⭐⭐⭐ | ✅ |
| DeepSeek | DeepSeek Coder | ⚡⚡⚡ | ⭐⭐⭐⭐⭐ | ✅ |
| Together | Llama 3.1 8B | ⚡⚡⚡ | ⭐⭐⭐⭐ | ✅ |
| HuggingFace | Mistral 7B | ⚡⚡ | ⭐⭐⭐ | ✅ |

### Recommended Setup

**For Best Results**:
- Provider: **Groq**
- Model: **Llama 3.3 70B Versatile**
- Reason: Best balance of speed and quality

**For Maximum Speed**:
- Provider: **Groq**
- Model: **Llama 3.1 8B Instant**
- Reason: Ultra-fast responses

**For Coding Tasks**:
- Provider: **DeepSeek**
- Model: **DeepSeek Coder**
- Reason: Specialized for code generation

---

## 🚀 Deployment

### Production Checklist

- [ ] Set up environment variables
- [ ] Configure API keys
- [ ] Test all agents
- [ ] Verify transpiler output
- [ ] Run security audits
- [ ] Test on testnets
- [ ] Monitor rate limits
- [ ] Set up error tracking

### Environment Setup

```bash
# Production
GROQ_API_KEY=prod-key
NODE_ENV=production
NEXT_PUBLIC_CHAIN_ID=43114  # Avalanche Mainnet
```

---

## 📚 Resources

### Documentation
- [Groq Documentation](https://console.groq.com/docs)
- [OpenRouter Docs](https://openrouter.ai/docs)
- [Vercel AI SDK](https://sdk.vercel.ai/docs)
- [OpenZeppelin Contracts](https://docs.openzeppelin.com/contracts)

### Examples
- See `/examples` directory for sample projects
- Check `/docs` for more guides
- Visit `/playground` for interactive demos

---

## 🤝 Contributing

We welcome contributions! Areas to improve:

1. **Add more agents**: Testing, deployment, optimization
2. **Support more LLM providers**: Anthropic, OpenAI, etc.
3. **Enhance transpiler**: Better Python parsing
4. **Add more templates**: Common contract patterns
5. **Improve UI/UX**: Better visualization

---

## 📝 License

MIT License - See LICENSE file for details

---

## 🎯 Roadmap

### Phase 1: Core System ✅
- [x] Multi-agent orchestration
- [x] LLM provider system
- [x] Streaming generation
- [x] Python transpiler
- [x] Builder UI

### Phase 2: Enhanced Features 🚧
- [ ] Automated testing
- [ ] One-click deployment
- [ ] Version control integration
- [ ] Collaborative editing
- [ ] Template marketplace

### Phase 3: Advanced Features 📋
- [ ] AI-powered debugging
- [ ] Gas optimization agent
- [ ] Multi-language support
- [ ] Visual contract builder
- [ ] Blockchain analytics

---

**Built with ❤️ by the PyVax Team**
