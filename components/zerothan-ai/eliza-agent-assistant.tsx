'use client'

import { useState, useRef, useEffect } from 'react'
import { Bot, Send, X, Minimize2, Maximize2, Sparkles, Code, Shield, Zap, AlertTriangle, CheckCircle, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  type?: 'suggestion' | 'audit' | 'guidance' | 'monitoring'
}

interface ElizaAgentAssistantProps {
  currentCode?: string
  onCodeSuggestion?: (code: string) => void
}

export function ElizaAgentAssistant({ currentCode, onCodeSuggestion }: ElizaAgentAssistantProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: '👋 Hi! I\'m Eliza, your AI smart contract assistant. I can help you with:\n\n• Code suggestions and improvements\n• Security auditing\n• Deployment guidance\n• Real-time monitoring\n• Best practices\n\nHow can I help you today?',
      timestamp: new Date(),
      type: 'guidance'
    }
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const analyzeCode = (code: string): string => {
    const issues: string[] = []
    const suggestions: string[] = []

    // Security checks
    if (!code.includes('SPDX-License-Identifier')) {
      issues.push('⚠️ Missing SPDX license identifier')
    }
    if (!code.includes('pragma solidity')) {
      issues.push('⚠️ Missing pragma directive')
    }
    if (code.includes('tx.origin')) {
      issues.push('🔴 Security risk: Using tx.origin (use msg.sender instead)')
    }
    if (code.includes('selfdestruct')) {
      issues.push('🔴 Warning: selfdestruct is deprecated')
    }
    if (!code.includes('ReentrancyGuard') && code.includes('external') && code.includes('payable')) {
      suggestions.push('💡 Consider using ReentrancyGuard for external payable functions')
    }

    // Best practices
    if (!code.includes('event ')) {
      suggestions.push('💡 Consider adding events for important state changes')
    }
    if (!code.includes('/// @')) {
      suggestions.push('💡 Add NatSpec documentation for better code clarity')
    }
    if (code.includes('public') && !code.includes('external')) {
      suggestions.push('💡 Use external instead of public for functions only called externally (saves gas)')
    }

    let response = ''
    if (issues.length > 0) {
      response += '**Security Issues Found:**\n' + issues.join('\n') + '\n\n'
    }
    if (suggestions.length > 0) {
      response += '**Suggestions:**\n' + suggestions.join('\n')
    }
    if (issues.length === 0 && suggestions.length === 0) {
      response = '✅ Code looks good! No major issues found.'
    }

    return response
  }

  const getAIResponse = async (userMessage: string): Promise<string> => {
    const lowerMessage = userMessage.toLowerCase()

    // Audit request
    if (lowerMessage.includes('audit') || lowerMessage.includes('check') || lowerMessage.includes('review')) {
      if (currentCode) {
        return analyzeCode(currentCode)
      }
      return '📋 I can audit your smart contract! Please write some code in the editor first, then ask me to review it.'
    }

    // Security suggestions
    if (lowerMessage.includes('security') || lowerMessage.includes('safe') || lowerMessage.includes('secure')) {
      return `🛡️ **Smart Contract Security Best Practices:**

1. **Access Control**
   - Use OpenZeppelin's Ownable or AccessControl
   - Implement role-based permissions
   - Validate all inputs

2. **Reentrancy Protection**
   - Use ReentrancyGuard
   - Follow Checks-Effects-Interactions pattern
   - Use pull over push for payments

3. **Integer Safety**
   - Solidity 0.8+ has built-in overflow protection
   - Still validate input ranges
   - Use SafeMath for older versions

4. **Gas Optimization**
   - Use external over public
   - Pack storage variables
   - Cache storage reads
   - Use calldata for read-only arrays

5. **Error Handling**
   - Use custom errors (saves gas)
   - Provide descriptive error messages
   - Never ignore return values`
    }

    // Deployment guidance
    if (lowerMessage.includes('deploy') || lowerMessage.includes('deployment')) {
      return `🚀 **Deployment Checklist:**

**Before Deployment:**
1. ✅ Test on local network (Hardhat/Ganache)
2. ✅ Deploy to testnet (Sepolia/Goerli)
3. ✅ Verify contract on Etherscan
4. ✅ Test all functions thoroughly
5. ✅ Check gas costs
6. ✅ Security audit (if handling funds)

**Deployment Steps:**
1. Connect wallet to correct network
2. Ensure sufficient ETH for gas
3. Click "Deploy" button
4. Confirm transaction in MetaMask
5. Wait for confirmation
6. Copy contract address
7. Verify on Etherscan

**After Deployment:**
- Monitor contract events
- Set up alerts for important transactions
- Document contract address
- Update frontend with new address`
    }

    // Gas optimization
    if (lowerMessage.includes('gas') || lowerMessage.includes('optimize')) {
      return `⚡ **Gas Optimization Tips:**

1. **Storage Optimization**
   - Pack variables (uint128 + uint128 = 1 slot)
   - Use mappings over arrays when possible
   - Delete unused storage variables

2. **Function Optimization**
   - Use external over public
   - Use calldata for read-only parameters
   - Cache storage variables in memory
   - Avoid loops over unbounded arrays

3. **Data Types**
   - Use uint256 (cheaper than smaller uints)
   - Use bytes32 instead of string when possible
   - Use custom errors instead of require strings

4. **Code Patterns**
   - Batch operations when possible
   - Use events instead of storage for logs
   - Minimize external calls
   - Use view/pure functions when possible

Example:
\`\`\`solidity
// ❌ Expensive
function transfer(address to, uint amount) public {
    balances[msg.sender] -= amount;
    balances[to] += amount;
}

// ✅ Optimized
function transfer(address to, uint256 amount) external {
    uint256 senderBalance = balances[msg.sender];
    require(senderBalance >= amount, "Insufficient balance");
    unchecked {
        balances[msg.sender] = senderBalance - amount;
        balances[to] += amount;
    }
}
\`\`\``
    }

    // ERC standards
    if (lowerMessage.includes('erc20') || lowerMessage.includes('token')) {
      return `🪙 **ERC-20 Token Template:**

\`\`\`solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MyToken is ERC20, Ownable {
    constructor() ERC20("MyToken", "MTK") Ownable(msg.sender) {
        _mint(msg.sender, 1000000 * 10 ** decimals());
    }

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }
}
\`\`\`

**Key Functions:**
- totalSupply() - Total token supply
- balanceOf(address) - Get balance
- transfer(address, uint256) - Send tokens
- approve(address, uint256) - Approve spending
- transferFrom(address, address, uint256) - Transfer from approved

Would you like me to add this to your editor?`
    }

    if (lowerMessage.includes('nft') || lowerMessage.includes('erc721')) {
      return `🎨 **ERC-721 NFT Template:**

\`\`\`solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MyNFT is ERC721, Ownable {
    uint256 private _tokenIdCounter;

    constructor() ERC721("MyNFT", "MNFT") Ownable(msg.sender) {}

    function safeMint(address to) public onlyOwner {
        uint256 tokenId = _tokenIdCounter++;
        _safeMint(to, tokenId);
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        return string(abi.encodePacked("ipfs://YOUR_CID/", tokenId, ".json"));
    }
}
\`\`\`

Would you like me to add this to your editor?`
    }

    // General help
    return `I can help you with:

🔍 **Code Analysis**
- "Audit my code"
- "Check for security issues"
- "Review my contract"

🛡️ **Security**
- "Security best practices"
- "How to prevent reentrancy"
- "Access control patterns"

⚡ **Optimization**
- "Gas optimization tips"
- "How to reduce gas costs"
- "Optimize my contract"

🚀 **Deployment**
- "How to deploy"
- "Deployment checklist"
- "Testnet deployment"

📚 **Templates**
- "ERC-20 token"
- "NFT contract"
- "Staking contract"

Just ask me anything about smart contract development!`
  }

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsTyping(true)

    // Simulate AI thinking
    setTimeout(async () => {
      const response = await getAIResponse(input)
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
        type: input.toLowerCase().includes('audit') ? 'audit' : 
              input.toLowerCase().includes('deploy') ? 'guidance' :
              input.toLowerCase().includes('security') ? 'audit' : 'suggestion'
      }

      setMessages(prev => [...prev, assistantMessage])
      setIsTyping(false)
    }, 1000)
  }

  const quickActions = [
    { label: 'Audit Code', icon: Shield, prompt: 'Audit my smart contract code' },
    { label: 'Gas Tips', icon: Zap, prompt: 'Give me gas optimization tips' },
    { label: 'Security', icon: AlertTriangle, prompt: 'What are security best practices?' },
    { label: 'Deploy Help', icon: CheckCircle, prompt: 'How do I deploy my contract?' }
  ]

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg z-50"
      >
        <Bot className="w-6 h-6" />
      </Button>
    )
  }

  return (
    <div className={`fixed ${isMinimized ? 'bottom-6 right-6' : 'bottom-6 right-6'} z-50 transition-all duration-300`}>
      <div className={`bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl ${isMinimized ? 'w-80 h-16' : 'w-96 h-[600px]'} flex flex-col overflow-hidden`}>
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-purple-900/50 to-pink-900/50 border-b border-slate-700">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Eliza AI Agent</h3>
              <p className="text-xs text-slate-400">Smart Contract Assistant</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setIsMinimized(!isMinimized)}
              className="h-8 w-8 p-0 text-slate-400 hover:text-white"
            >
              {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setIsOpen(false)}
              className="h-8 w-8 p-0 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* Quick Actions */}
            <div className="px-4 py-3 bg-slate-800/50 border-b border-slate-700">
              <div className="grid grid-cols-2 gap-2">
                {quickActions.map((action) => (
                  <Button
                    key={action.label}
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setInput(action.prompt)
                      handleSend()
                    }}
                    className="bg-slate-800 border-slate-600 hover:bg-slate-700 text-xs h-8"
                  >
                    <action.icon className="w-3 h-3 mr-1" />
                    {action.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-2 ${
                      message.role === 'user'
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                        : 'bg-slate-800 text-slate-100 border border-slate-700'
                    }`}
                  >
                    {message.role === 'assistant' && message.type && (
                      <div className="flex items-center gap-1 mb-1 text-xs text-slate-400">
                        {message.type === 'audit' && <Shield className="w-3 h-3" />}
                        {message.type === 'suggestion' && <Sparkles className="w-3 h-3" />}
                        {message.type === 'guidance' && <Code className="w-3 h-3" />}
                        {message.type === 'monitoring' && <Zap className="w-3 h-3" />}
                        <span className="capitalize">{message.type}</span>
                      </div>
                    )}
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    <span className="text-xs opacity-60 mt-1 block">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-slate-800 border border-slate-700 rounded-2xl px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin text-purple-400" />
                      <span className="text-sm text-slate-400">Eliza is thinking...</span>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 bg-slate-800/50 border-t border-slate-700">
              <div className="flex gap-2">
                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      handleSend()
                    }
                  }}
                  placeholder="Ask Eliza anything..."
                  className="flex-1 min-h-[40px] max-h-[100px] bg-slate-900 border-slate-700 text-white resize-none"
                  rows={1}
                />
                <Button
                  onClick={handleSend}
                  disabled={!input.trim() || isTyping}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
