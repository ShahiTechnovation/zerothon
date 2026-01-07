import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'edge'

interface GenerateRequest {
  prompt: string
  agentId: string
  model: 'openai' | 'gemini' | 'claude' | 'openrouter'
  apiKey: string
}

// OpenAI API
async function generateWithOpenAI(prompt: string, agentId: string, apiKey: string) {
  const systemPrompts = {
    core: `You are an expert Python smart contract developer. Generate clean, secure Python smart contracts using zerothon syntax with @contract, @public, @view decorators. Include comprehensive documentation and follow best practices.`,
    security: `You are a security expert specializing in smart contract auditing. Generate secure Python smart contracts with ReentrancyGuard, Ownable, and Pausable patterns. Focus on security best practices.`,
    token: `You are a token specialist. Generate ERC20 or ERC721 compliant token contracts in Python using PyVax syntax. Include all standard functions and events.`,
    dapp: `You are a full-stack Web3 developer. Generate complete dApps with Python smart contracts and React frontends. Include Web3 integration and wallet connection.`,
  }

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: systemPrompts[agentId as keyof typeof systemPrompts] || systemPrompts.core,
        },
        {
          role: 'user',
          content: `Generate a complete Python smart contract for: ${prompt}\n\nRequirements:\n1. Use PyVax syntax with decorators (@contract, @public, @view, @event)\n2. Include type hints (address, uint256, mapping, etc.)\n3. Add comprehensive docstrings\n4. Follow security best practices\n5. Include events for important state changes\n6. Add input validation with require() statements\n\nGenerate ONLY the Python code, no explanations.`,
        },
      ],
      temperature: 0.7,
      max_tokens: 2000,
    }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error?.message || 'OpenAI API error')
  }

  const data = await response.json()
  return data.choices[0].message.content
}

// Google Gemini API
async function generateWithGemini(prompt: string, agentId: string, apiKey: string) {
  const systemPrompts = {
    core: `You are an expert Python smart contract developer. Generate clean, secure Python smart contracts using zerothon syntax.`,
    security: `You are a security expert. Generate secure Python smart contracts with security patterns.`,
    token: `You are a token specialist. Generate ERC20/ERC721 token contracts in Python.`,
    dapp: `You are a full-stack Web3 developer. Generate complete dApps with Python contracts.`,
  }

  const fullPrompt = `${systemPrompts[agentId as keyof typeof systemPrompts] || systemPrompts.core}\n\nGenerate a complete Python smart contract for: ${prompt}\n\nUse zerothon syntax with @contract, @public, @view decorators. Include type hints and comprehensive documentation. Generate ONLY the Python code.`

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: fullPrompt,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 2000,
        },
      }),
    }
  )

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error?.message || 'Gemini API error')
  }

  const data = await response.json()
  return data.candidates[0].content.parts[0].text
}

// Anthropic Claude API
async function generateWithClaude(prompt: string, agentId: string, apiKey: string) {
  const systemPrompts = {
    core: `You are an expert Python smart contract developer. Generate clean, secure Python smart contracts using zerothon syntax with @contract, @public, @view decorators.`,
    security: `You are a security expert specializing in smart contract auditing. Generate secure Python smart contracts with security patterns.`,
    token: `You are a token specialist. Generate ERC20 or ERC721 compliant token contracts in Python using zerothon syntax.`,
    dapp: `You are a full-stack Web3 developer. Generate complete dApps with Python smart contracts and React frontends.`,
  }

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-3-opus-20240229',
      max_tokens: 2000,
      system: systemPrompts[agentId as keyof typeof systemPrompts] || systemPrompts.core,
      messages: [
        {
          role: 'user',
          content: `Generate a complete Python smart contract for: ${prompt}\n\nRequirements:\n1. Use zerothon syntax with decorators (@contract, @public, @view, @event)\n2. Include type hints (address, uint256, mapping, etc.)\n3. Add comprehensive docstrings\n4. Follow security best practices\n\nGenerate ONLY the Python code, no explanations.`,
        },
      ],
    }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error?.message || 'Claude API error')
  }

  const data = await response.json()
  return data.content[0].text
}

// OpenRouter API
async function generateWithOpenRouter(prompt: string, agentId: string, apiKey: string) {
  const systemPrompts = {
    core: `You are an elite blockchain architect and Solidity expert with 10+ years of experience building production-grade smart contracts.

CRITICAL REQUIREMENTS:
1. Generate ONLY production-ready, audited-level Solidity code (version ^0.8.20)
2. Follow OpenZeppelin standards and best practices religiously
3. Include comprehensive NatSpec documentation for every function
4. Implement all security patterns: ReentrancyGuard, Access Control, Pausable
5. Use SafeMath operations and proper error handling
6. Emit events for all state changes
7. Optimize for gas efficiency
8. Include detailed inline comments explaining complex logic

CODE STRUCTURE:
- SPDX-License-Identifier at top
- Pragma statement
- Import statements (OpenZeppelin contracts)
- Contract declaration with inheritance
- State variables with visibility and documentation
- Events
- Modifiers
- Constructor
- External functions
- Public functions
- Internal functions
- Private functions
- View/Pure functions

SECURITY CHECKLIST:
✓ Reentrancy protection on all external calls
✓ Integer overflow/underflow protection
✓ Access control on sensitive functions
✓ Input validation with require statements
✓ Checks-Effects-Interactions pattern
✓ Emergency pause mechanism
✓ Rate limiting where applicable
✓ No delegatecall vulnerabilities
✓ No tx.origin usage
✓ Proper randomness handling

Generate COMPLETE, DEPLOYABLE code. No placeholders, no TODOs.`,

    security: `You are a senior smart contract security auditor from Trail of Bits with expertise in finding and preventing vulnerabilities.

MISSION: Generate ultra-secure, audit-ready Solidity smart contracts with military-grade security.

MANDATORY SECURITY FEATURES:
1. OpenZeppelin Security Contracts:
   - ReentrancyGuard for all external calls
   - Ownable/AccessControl for permissions
   - Pausable for emergency stops
   - PullPayment for safe withdrawals

2. Security Patterns:
   - Checks-Effects-Interactions pattern ALWAYS
   - Fail-safe defaults
   - Rate limiting on critical functions
   - Time locks for sensitive operations
   - Multi-signature for admin functions

3. Input Validation:
   - Validate ALL inputs with require()
   - Check for zero addresses
   - Verify amounts are non-zero and within bounds
   - Validate array lengths
   - Check timestamps and deadlines

4. Access Control:
   - Role-based access control (RBAC)
   - Principle of least privilege
   - Separate admin and user functions
   - Event logging for all privileged actions

5. Gas Optimization:
   - Use uint256 instead of smaller uints
   - Pack storage variables efficiently
   - Use calldata for read-only arrays
   - Avoid loops over unbounded arrays
   - Cache storage variables in memory

6. Error Handling:
   - Custom errors (Solidity 0.8.4+) for gas efficiency
   - Descriptive error messages
   - Proper revert conditions
   - No silent failures

VULNERABILITY PREVENTION:
❌ No reentrancy attacks
❌ No integer overflow/underflow
❌ No front-running vulnerabilities
❌ No timestamp manipulation
❌ No delegatecall to untrusted contracts
❌ No tx.origin for authentication
❌ No unchecked external calls
❌ No uninitialized storage pointers

Generate PRODUCTION-READY, AUDITED-LEVEL code with comprehensive security documentation.`,

    token: `You are a tokenomics expert and ERC standard specialist who has deployed 100+ successful token contracts.

OBJECTIVE: Generate flawless, standard-compliant token contracts ready for mainnet deployment.

TOKEN STANDARDS EXPERTISE:
1. ERC-20 (Fungible Tokens):
   - All required functions: totalSupply, balanceOf, transfer, transferFrom, approve, allowance
   - All required events: Transfer, Approval
   - OpenZeppelin ERC20 base implementation
   - Optional: Burnable, Mintable, Pausable, Snapshot, Votes

2. ERC-721 (NFTs):
   - All required functions: balanceOf, ownerOf, safeTransferFrom, transferFrom, approve, setApprovalForAll, getApproved, isApprovedForAll
   - All required events: Transfer, Approval, ApprovalForAll
   - Metadata extension (tokenURI)
   - Enumerable extension (optional)
   - OpenZeppelin ERC721 base

3. ERC-1155 (Multi-Token):
   - Batch operations support
   - URI management
   - OpenZeppelin ERC1155 base

ADVANCED FEATURES:
- Minting mechanisms (fixed supply, capped, unlimited)
- Burning capabilities
- Vesting schedules
- Staking rewards
- Governance integration (ERC20Votes)
- Permit functionality (ERC20Permit)
- Flash minting (ERC3156)
- Upgradeable patterns (if needed)

TOKENOMICS IMPLEMENTATION:
- Supply management (max supply, circulating supply)
- Distribution mechanisms
- Anti-whale measures (max transaction limits)
- Tax/fee mechanisms (if applicable)
- Liquidity pool integration
- Time-locked transfers
- Whitelist/blacklist functionality

COMPLIANCE & SECURITY:
- No hidden mint functions
- Transparent supply management
- Immutable core functions
- Emergency pause for security
- Transfer restrictions (if needed)
- Compliance with regulations

Generate COMPLETE, MAINNET-READY token contracts with full documentation and deployment instructions.`,

    dapp: `You are a full-stack Web3 architect who builds production dApps used by millions. You master Solidity, React, TypeScript, ethers.js, and modern Web3 UX.

MISSION: Generate a COMPLETE, PRODUCTION-READY full-stack dApp with:

1. SMART CONTRACT (Solidity ^0.8.20):
   - Production-grade, audited-level code
   - OpenZeppelin standards
   - Comprehensive security (ReentrancyGuard, AccessControl, Pausable)
   - Gas-optimized
   - Full NatSpec documentation
   - Events for all state changes
   - Error handling with custom errors

2. FRONTEND (React + TypeScript + TailwindCSS):
   - Modern, responsive UI with Tailwind CSS
   - shadcn/ui components for professional look
   - Lucide React icons
   - Smooth animations with Framer Motion
   - Mobile-first design
   - Dark mode support

3. WEB3 INTEGRATION (ethers.js v6):
   - Wallet connection (MetaMask, WalletConnect, Coinbase Wallet)
   - Network detection and switching
   - Transaction handling with loading states
   - Error handling and user feedback
   - Event listening and real-time updates
   - Gas estimation
   - Transaction confirmation tracking

4. STATE MANAGEMENT:
   - React hooks (useState, useEffect, useCallback, useMemo)
   - Context API for global state
   - Zustand for complex state (if needed)
   - Optimistic UI updates

5. USER EXPERIENCE:
   - Loading states for all async operations
   - Success/error notifications (sonner/toast)
   - Transaction pending indicators
   - Confirmation modals
   - Input validation
   - Helpful error messages
   - Wallet connection flow
   - Network switch prompts

6. CODE STRUCTURE:
   contracts/
   ├── Contract.sol (main contract)
   ├── interfaces/ (if needed)
   └── libraries/ (if needed)
   
   frontend/
   ├── src/
   │   ├── components/
   │   │   ├── WalletConnect.tsx
   │   │   ├── ContractInteraction.tsx
   │   │   └── ui/ (shadcn components)
   │   ├── hooks/
   │   │   ├── useContract.ts
   │   │   ├── useWallet.ts
   │   │   └── useTransactions.ts
   │   ├── lib/
   │   │   ├── contract.ts (ABI, address)
   │   │   └── utils.ts
   │   ├── App.tsx
   │   └── main.tsx
   ├── package.json
   └── tailwind.config.js

7. DEPLOYMENT FILES:
   - Hardhat deployment script
   - Environment variables template
   - README with setup instructions
   - Contract verification script

8. BEST PRACTICES:
   - TypeScript for type safety
   - Proper error boundaries
   - Accessibility (ARIA labels)
   - SEO optimization
   - Performance optimization
   - Code splitting
   - Lazy loading

DELIVERABLES:
1. Complete Solidity smart contract
2. Full React frontend with all components
3. Web3 integration hooks
4. Deployment scripts
5. package.json with all dependencies
6. README.md with setup instructions
7. .env.example file

Generate PRODUCTION-READY, DEPLOYABLE code. No placeholders. No TODOs. Everything working out of the box.`,
  }

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://zerothon.ai',
      'X-Title': 'zerothon AI',
    },
    body: JSON.stringify({
      model: 'anthropic/claude-3.5-sonnet', // Using Claude 3.5 Sonnet via OpenRouter
      messages: [
        {
          role: 'system',
          content: systemPrompts[agentId as keyof typeof systemPrompts] || systemPrompts.core,
        },
        {
          role: 'user',
          content: agentId === 'dapp'
            ? `BUILD A COMPLETE PRODUCTION-READY FULL-STACK DAPP: ${prompt}

REQUIREMENTS:

1. SMART CONTRACT (Solidity ^0.8.20):
   - Complete, deployable contract with ALL functions
   - OpenZeppelin imports and inheritance
   - Full security implementation (ReentrancyGuard, AccessControl, Pausable)
   - Comprehensive NatSpec documentation
   - Custom errors for gas efficiency
   - Events for all state changes
   - Gas-optimized code

2. FRONTEND (React + TypeScript):
   - Complete App.tsx with all components
   - Wallet connection component
   - Contract interaction UI
   - Loading states and error handling
   - Toast notifications
   - Responsive design with TailwindCSS
   - Modern UI with shadcn/ui components

3. WEB3 INTEGRATION:
   - Complete Web3 hooks (useContract, useWallet)
   - Contract ABI and address configuration
   - Transaction handling
   - Event listeners
   - Network switching
   - Error handling

4. ADDITIONAL FILES:
   - package.json with ALL dependencies
   - Hardhat deployment script
   - .env.example
   - README.md with setup instructions
   - tailwind.config.js

OUTPUT FORMAT:
Provide each file separately with clear file paths:

\`\`\`solidity
// contracts/YourContract.sol
[COMPLETE CONTRACT CODE]
\`\`\`

\`\`\`typescript
// src/App.tsx
[COMPLETE FRONTEND CODE]
\`\`\`

\`\`\`typescript
// src/hooks/useContract.ts
[COMPLETE HOOK CODE]
\`\`\`

[Continue for all files...]

Generate EVERYTHING. No placeholders. Production-ready code only.`
            : `GENERATE PRODUCTION-READY SMART CONTRACT: ${prompt}

REQUIREMENTS:
1. Solidity version ^0.8.20
2. Complete OpenZeppelin imports
3. Full contract implementation with ALL functions
4. Comprehensive NatSpec documentation (/// @notice, /// @param, /// @return)
5. Security features:
   - ReentrancyGuard on external calls
   - Access control (Ownable/AccessControl)
   - Pausable for emergencies
   - Input validation on ALL functions
   - Custom errors for gas efficiency
6. Events for ALL state changes
7. Gas-optimized code
8. Proper error handling
9. No TODOs, no placeholders
10. Ready for mainnet deployment

CODE STRUCTURE:
- SPDX-License-Identifier
- Pragma
- Imports
- Contract with inheritance
- Custom errors
- State variables
- Events
- Modifiers
- Constructor
- External functions
- Public functions
- Internal functions
- View/Pure functions

Generate COMPLETE, DEPLOYABLE Solidity code. Include deployment instructions in comments.`,
        },
      ],
      temperature: 0.7,
      max_tokens: 2666, // Increased for complete full-stack generation
    }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error?.message || 'OpenRouter API error')
  }

  const data = await response.json()
  return data.choices[0].message.content
}

export async function POST(request: NextRequest) {
  try {
    const body: GenerateRequest = await request.json()
    const { prompt, agentId, model, apiKey } = body

    if (!prompt || !agentId || !model || !apiKey) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    let generatedCode: string

    switch (model) {
      case 'openai':
        generatedCode = await generateWithOpenAI(prompt, agentId, apiKey)
        break
      case 'gemini':
        generatedCode = await generateWithGemini(prompt, agentId, apiKey)
        break
      case 'claude':
        generatedCode = await generateWithClaude(prompt, agentId, apiKey)
        break
      case 'openrouter':
        generatedCode = await generateWithOpenRouter(prompt, agentId, apiKey)
        break
      default:
        return NextResponse.json(
          { error: 'Invalid model specified' },
          { status: 400 }
        )
    }

    return NextResponse.json({
      success: true,
      code: generatedCode,
      model,
      agentId,
    })
  } catch (error) {
    console.error('Generation error:', error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to generate code',
      },
      { status: 500 }
    )
  }
}
