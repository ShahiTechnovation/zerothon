# Real API Integration for PyVax AI

## Overview

PyVax AI now supports real AI model integration with OpenAI, Google Gemini, and Anthropic Claude for generating Python smart contracts.

## Features

### 1. Multi-Model Support
Users can choose from four AI providers:
- **OpenAI GPT-4 Turbo** - Most capable for code generation
- **Google Gemini 1.5 Flash** - Fast and efficient
- **Anthropic Claude 3 Opus** - Excellent for security-focused code
- **OpenRouter** - Access multiple AI models through one API (uses Claude 3.5 Sonnet)

### 2. API Configuration
- User-provided API keys (stored locally in browser)
- Model selection interface
- Visual feedback for configured state
- Secure key storage (localStorage only, never sent to our servers)

### 3. Real Code Generation
- Actual API calls to selected AI model
- Agent-specific system prompts
- Python smart contract generation with PyVax syntax
- Error handling and user feedback

## How It Works

### User Flow

1. **Configure API Settings**
   - Click "AI Settings" button
   - Select AI model (OpenAI/Gemini/Claude)
   - Enter API key
   - Save configuration

2. **Generate Smart Contracts**
   - Select an agent (Core/Security/Token/DApp)
   - Describe the smart contract in natural language
   - AI generates Python code using PyVax syntax
   - View and download generated files

### API Endpoints

#### POST `/api/generate`

Generates smart contract code using the selected AI model.

**Request Body:**
```typescript
{
  prompt: string        // User's description
  agentId: string      // Selected agent (core/security/token/dapp)
  model: string        // AI model (openai/gemini/claude)
  apiKey: string       // User's API key
}
```

**Response:**
```typescript
{
  success: boolean
  code: string         // Generated Python code
  model: string
  agentId: string
}
```

## API Integration Details

### OpenAI GPT-4

```typescript
// Endpoint
POST https://api.openai.com/v1/chat/completions

// Headers
Authorization: Bearer ${apiKey}
Content-Type: application/json

// Body
{
  model: "gpt-4-turbo-preview",
  messages: [
    { role: "system", content: "..." },
    { role: "user", content: "..." }
  ],
  temperature: 0.7,
  max_tokens: 2000
}
```

### Google Gemini 1.5 Flash

```typescript
// Endpoint
POST https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}

// Body
{
  contents: [{
    parts: [{ text: "..." }]
  }],
  generationConfig: {
    temperature: 0.7,
    maxOutputTokens: 2000
  }
}
```

**Note:** Using Gemini 1.5 Flash (v1 API) instead of deprecated Gemini Pro (v1beta)

### Anthropic Claude

```typescript
// Endpoint
POST https://api.anthropic.com/v1/messages

// Headers
x-api-key: ${apiKey}
anthropic-version: 2023-06-01
Content-Type: application/json

// Body
{
  model: "claude-3-opus-20240229",
  max_tokens: 2000,
  system: "...",
  messages: [{
    role: "user",
    content: "..."
  }]
}
```

### OpenRouter

```typescript
// Endpoint
POST https://openrouter.ai/api/v1/chat/completions

// Headers
Authorization: Bearer ${apiKey}
Content-Type: application/json
HTTP-Referer: https://pyvax.ai
X-Title: PyVax AI

// Body
{
  model: "anthropic/claude-3.5-sonnet",
  messages: [
    { role: "system", content: "..." },
    { role: "user", content: "..." }
  ],
  temperature: 0.7,
  max_tokens: 2000
}
```

**Benefits:**
- Access to multiple AI models through one API
- Competitive pricing
- Automatic fallback to alternative models
- No need for multiple API keys

## Agent System Prompts

### Core Agent
```
You are an expert Python smart contract developer. Generate clean, secure 
Python smart contracts using PyVax syntax with @contract, @public, @view 
decorators. Include comprehensive documentation and follow best practices.
```

### Security Agent
```
You are a security expert specializing in smart contract auditing. Generate 
secure Python smart contracts with ReentrancyGuard, Ownable, and Pausable 
patterns. Focus on security best practices.
```

### Token Agent
```
You are a token specialist. Generate ERC20 or ERC721 compliant token contracts 
in Python using PyVax syntax. Include all standard functions and events.
```

### DApp Agent
```
You are a full-stack Web3 developer. Generate complete dApps with Python smart 
contracts and React frontends. Include Web3 integration and wallet connection.
```

## Security

### API Key Storage
- Keys stored in browser's localStorage
- Never transmitted to PyVax servers
- Direct API calls from browser to AI providers
- User has full control over their keys

### Best Practices
1. Never share your API keys
2. Use environment-specific keys (dev/prod)
3. Monitor API usage in provider dashboards
4. Rotate keys regularly
5. Set usage limits in provider settings

## Getting API Keys

### OpenAI
1. Visit https://platform.openai.com/api-keys
2. Sign in or create account
3. Click "Create new secret key"
4. Copy key (starts with `sk-`)
5. Paste into PyVax AI settings

### Google Gemini
1. Visit https://makersuite.google.com/app/apikey
2. Sign in with Google account
3. Click "Create API key"
4. Copy key (starts with `AIza`)
5. Paste into PyVax AI settings

### Anthropic Claude
1. Visit https://console.anthropic.com/settings/keys
2. Sign in or create account
3. Click "Create Key"
4. Copy key (starts with `sk-ant-`)
5. Paste into PyVax AI settings

### OpenRouter
1. Visit https://openrouter.ai/keys
2. Sign in or create account
3. Click "Create Key"
4. Copy key (starts with `sk-or-`)
5. Paste into PyVax AI settings

**Why use OpenRouter?**
- Access to 100+ AI models with one API key
- Competitive pricing (often cheaper than direct APIs)
- Automatic failover if a model is unavailable
- Pay-as-you-go with no monthly fees
- Supports latest models including Claude 3.5 Sonnet, GPT-4, and more

## Code Generation Examples

### Input
```
Create an ERC20 token with staking rewards
```

### Output (Python Smart Contract)
```python
from pyvax import contract, public, view, event
from pyvax.types import address, uint256, mapping

@contract
class StakingToken:
    """
    ERC20 token with staking rewards
    
    Features:
    - Standard ERC20 functionality
    - Staking mechanism
    - Reward distribution
    """
    
    # Token metadata
    name: string = "StakingToken"
    symbol: string = "STK"
    decimals: uint256 = 18
    total_supply: uint256
    
    # Balances and allowances
    balances: mapping[address, uint256]
    allowances: mapping[address, mapping[address, uint256]]
    
    # Staking data
    staked_balances: mapping[address, uint256]
    rewards: mapping[address, uint256]
    
    @event
    def Transfer(from_addr: address, to_addr: address, value: uint256):
        pass
    
    @event
    def Staked(user: address, amount: uint256):
        pass
    
    def __init__(self, initial_supply: uint256):
        self.total_supply = initial_supply * (10 ** self.decimals)
        self.balances[msg.sender] = self.total_supply
        emit Transfer(address(0), msg.sender, self.total_supply)
    
    @public
    def stake(self, amount: uint256) -> bool:
        require(self.balances[msg.sender] >= amount, "Insufficient balance")
        
        self.balances[msg.sender] -= amount
        self.staked_balances[msg.sender] += amount
        
        emit Staked(msg.sender, amount)
        return True
    
    @view
    def get_staked_balance(self, account: address) -> uint256:
        return self.staked_balances.get(account, 0)
```

## Error Handling

### Common Errors

1. **"Please configure your API settings first"**
   - Solution: Click "AI Settings" and configure your API key

2. **"Invalid API key"**
   - Solution: Check your API key is correct and active

3. **"Rate limit exceeded"**
   - Solution: Wait a moment or upgrade your API plan

4. **"Failed to generate code"**
   - Solution: Check your internet connection and API key

## UI Improvements

### Fixed Issues
1. **Code Box Overflow** - Added `whitespace-pre-wrap` and `break-words` to wrap long lines
2. **API Configuration** - Added visual settings dialog with model selection
3. **Status Indicators** - Shows active model and connection status
4. **Error Display** - Clear error messages for troubleshooting

### New Components
- `APISettings` - Configuration dialog for API keys and model selection
- Status bar showing active model
- Error notification system
- Visual feedback for API configuration state

## Future Enhancements

1. **API Key Encryption** - Encrypt keys before storing in localStorage
2. **Multiple Keys** - Support multiple API keys per model
3. **Usage Tracking** - Track API usage and costs
4. **Model Comparison** - Compare outputs from different models
5. **Streaming Responses** - Real-time code generation display
6. **Caching** - Cache common prompts to reduce API calls
7. **Fine-tuning** - Support for fine-tuned models
8. **Batch Generation** - Generate multiple contracts at once

## Cost Considerations

### Approximate Costs per Generation

- **OpenAI GPT-4 Turbo**: ~$0.01-0.03 per generation
- **Google Gemini Pro**: Free tier available, then ~$0.001 per generation
- **Anthropic Claude**: ~$0.015-0.04 per generation

*Costs vary based on prompt length and output size*

## Support

For issues or questions:
- Check API provider status pages
- Verify API key permissions
- Review error messages
- Contact PyVax support

---

Built with ❤️ for Python developers entering Web3
