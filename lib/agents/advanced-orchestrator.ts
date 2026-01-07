/**
 * Advanced Agent Orchestration System
 * Multi-agent collaboration with streaming, tool calling, and autonomous execution
 * Inspired by Replit Agent, bolt.new, and Web3GPT
 */

import { llmClient } from '../llm/client'
import { LLMMessage } from '../llm/providers'

export interface AgentTask {
  id: string
  type: 'generate_contract' | 'generate_frontend' | 'audit_security' | 'optimize_gas' | 'deploy' | 'test'
  description: string
  priority: number
  dependencies?: string[]
  status: 'pending' | 'in_progress' | 'completed' | 'failed'
  result?: any
  error?: string
}

export interface AgentContext {
  projectType: 'token' | 'nft' | 'defi' | 'dao' | 'game' | 'custom'
  chain: 'avalanche' | 'ethereum' | 'polygon' | 'arbitrum' | 'optimism' | 'base'
  requirements: string
  existingCode?: string
  files?: Map<string, string>
  testResults?: any[]
}

export interface AgentCapability {
  name: string
  description: string
  execute: (context: AgentContext, task: AgentTask) => Promise<any>
}

export interface StreamUpdate {
  type: 'thought' | 'action' | 'code' | 'file' | 'test' | 'error' | 'complete'
  agent: string
  content: string
  data?: any
}

/**
 * Base Agent Class
 */
export abstract class BaseAgent {
  protected name: string
  protected systemPrompt: string
  protected capabilities: AgentCapability[]
  protected model: string

  constructor(name: string, systemPrompt: string, model: string = 'llama-3.3-70b-versatile') {
    this.name = name
    this.systemPrompt = systemPrompt
    this.capabilities = []
    this.model = model
  }

  abstract execute(context: AgentContext, task: AgentTask): Promise<any>

  protected async generateWithLLM(messages: LLMMessage[]): Promise<string> {
    const response = await llmClient.generate({
      model: this.model,
      messages: [
        { role: 'system', content: this.systemPrompt },
        ...messages
      ],
      temperature: 0.7,
      maxTokens: 4096,
    })
    return response.content
  }

  protected async *streamWithLLM(messages: LLMMessage[]): AsyncGenerator<string> {
    const stream = llmClient.generateStream({
      model: this.model,
      messages: [
        { role: 'system', content: this.systemPrompt },
        ...messages
      ],
      temperature: 0.7,
      maxTokens: 4096,
      stream: true,
    })

    for await (const chunk of stream) {
      if (!chunk.done && chunk.content) {
        yield chunk.content
      }
    }
  }
}

/**
 * Smart Contract Generator Agent
 */
export class ContractGeneratorAgent extends BaseAgent {
  constructor() {
    super(
      'ContractGenerator',
      `You are an expert smart contract developer specializing in Python-based smart contracts for EVM blockchains.

Your role:
- Generate secure, efficient Python smart contracts using zerothon syntax
- Follow OpenZeppelin security patterns
- Include comprehensive documentation
- Implement proper access control and security measures
- Optimize for gas efficiency

zerothon Syntax:
- Use Python classes with type hints
- Decorators: @contract, @public, @view, @event, @modifier
- Types: address, uint256, string, bool, mapping
- Security: ReentrancyGuard, Ownable, Pausable

Always include:
1. SPDX license and contract documentation
2. State variables with proper types
3. Events for important state changes
4. Access control modifiers
5. Input validation
6. Security best practices`,
      'llama-3.3-70b-versatile'
    )
  }

  async execute(context: AgentContext, task: AgentTask): Promise<any> {
    const prompt = this.buildContractPrompt(context)
    const code = await this.generateWithLLM([
      { role: 'user', content: prompt }
    ])

    return {
      type: 'contract',
      language: 'python',
      code: this.extractCode(code),
      explanation: this.extractExplanation(code),
    }
  }

  async *executeStream(context: AgentContext, task: AgentTask): AsyncGenerator<StreamUpdate> {
    yield {
      type: 'thought',
      agent: this.name,
      content: `Analyzing requirements for ${context.projectType} contract...`
    }

    const prompt = this.buildContractPrompt(context)
    let fullCode = ''

    yield {
      type: 'action',
      agent: this.name,
      content: 'Generating Python smart contract...'
    }

    for await (const chunk of this.streamWithLLM([{ role: 'user', content: prompt }])) {
      fullCode += chunk
      yield {
        type: 'code',
        agent: this.name,
        content: chunk
      }
    }

    yield {
      type: 'complete',
      agent: this.name,
      content: 'Contract generation complete',
      data: {
        type: 'contract',
        language: 'python',
        code: this.extractCode(fullCode),
      }
    }
  }

  private buildContractPrompt(context: AgentContext): string {
    return `Generate a ${context.projectType} smart contract for ${context.chain} blockchain.

Requirements:
${context.requirements}

Generate a complete Python smart contract using zerothon syntax. Include:
1. All necessary imports and decorators
2. State variables with proper types
3. Events for important actions
4. Constructor with initialization
5. Public functions with access control
6. View functions for reading state
7. Security measures (reentrancy guard, access control)
8. Comprehensive documentation

Provide the complete contract code with explanations.`
  }

  private extractCode(response: string): string {
    const codeMatch = response.match(/\`\`\`python\n([\s\S]*?)\n\`\`\`/)
    return codeMatch ? codeMatch[1] : response
  }

  private extractExplanation(response: string): string {
    return response.replace(/\`\`\`python[\s\S]*?\`\`\`/g, '').trim()
  }
}

/**
 * Frontend Generator Agent
 */
export class FrontendGeneratorAgent extends BaseAgent {
  constructor() {
    super(
      'FrontendGenerator',
      `You are an expert full-stack Web3 developer specializing in React and Next.js frontends.

Your role:
- Generate modern, responsive React/Next.js frontends for dApps
- Integrate Web3 functionality with ethers.js
- Create beautiful UIs with Tailwind CSS and shadcn/ui
- Implement wallet connection and transaction handling
- Follow React best practices and hooks patterns

Always include:
1. Wallet connection logic (MetaMask, WalletConnect)
2. Contract interaction hooks
3. Transaction state management
4. Error handling and loading states
5. Responsive design with Tailwind
6. Type-safe TypeScript code`,
      'llama-3.3-70b-versatile'
    )
  }

  async execute(context: AgentContext, task: AgentTask): Promise<any> {
    const prompt = `Generate a React/Next.js frontend for a ${context.projectType} dApp on ${context.chain}.

Requirements:
${context.requirements}

${context.existingCode ? `Contract code:\n${context.existingCode}` : ''}

Generate a complete frontend with:
1. Main App component with wallet connection
2. Contract interaction hooks
3. UI components for all contract functions
4. Transaction handling and state management
5. Responsive design with Tailwind CSS

Provide complete TypeScript/React code.`

    const code = await this.generateWithLLM([
      { role: 'user', content: prompt }
    ])

    return {
      type: 'frontend',
      language: 'typescript',
      code: this.extractCode(code, 'typescript'),
      files: this.extractFiles(code),
    }
  }

  private extractCode(response: string, lang: string): string {
    const codeMatch = response.match(new RegExp(`\`\`\`${lang}\\n([\\s\\S]*?)\\n\`\`\``))
    return codeMatch ? codeMatch[1] : response
  }

  private extractFiles(response: string): Map<string, string> {
    const files = new Map<string, string>()
    const fileRegex = /\/\/ File: (.+?)\n```(\w+)\n([\s\S]*?)\n```/g
    let match

    while ((match = fileRegex.exec(response)) !== null) {
      files.set(match[1], match[3])
    }

    return files
  }
}

/**
 * Security Auditor Agent
 */
export class SecurityAuditorAgent extends BaseAgent {
  constructor() {
    super(
      'SecurityAuditor',
      `You are a smart contract security expert specializing in vulnerability detection and security auditing.

Your role:
- Audit smart contracts for security vulnerabilities
- Identify common attack vectors (reentrancy, overflow, access control)
- Suggest security improvements
- Verify OpenZeppelin pattern usage
- Check for gas optimization issues

Focus on:
1. Reentrancy vulnerabilities
2. Access control issues
3. Integer overflow/underflow
4. Front-running risks
5. Gas optimization
6. Best practice violations`,
      'llama-3.3-70b-versatile'
    )
  }

  async execute(context: AgentContext, task: AgentTask): Promise<any> {
    const prompt = `Audit this smart contract for security vulnerabilities:

${context.existingCode}

Provide:
1. Security score (0-100)
2. List of vulnerabilities found
3. Severity levels (Critical, High, Medium, Low)
4. Recommended fixes
5. Gas optimization suggestions`

    const audit = await this.generateWithLLM([
      { role: 'user', content: prompt }
    ])

    return {
      type: 'audit',
      report: audit,
      vulnerabilities: this.parseVulnerabilities(audit),
    }
  }

  private parseVulnerabilities(audit: string): any[] {
    // Simple parsing - can be enhanced
    return []
  }
}

/**
 * Test Generator Agent
 */
export class TestGeneratorAgent extends BaseAgent {
  constructor() {
    super(
      'TestGenerator',
      `You are a testing expert specializing in smart contract testing.

Your role:
- Generate comprehensive test suites
- Create unit tests for all functions
- Test edge cases and failure scenarios
- Verify security properties
- Generate integration tests

Use:
- Hardhat/Foundry testing frameworks
- Chai assertions
- Coverage for all code paths`,
      'llama-3.3-70b-versatile'
    )
  }

  async execute(context: AgentContext, task: AgentTask): Promise<any> {
    const prompt = `Generate comprehensive tests for this contract:

${context.existingCode}

Create:
1. Unit tests for all functions
2. Edge case tests
3. Security tests
4. Integration tests
5. Gas usage tests`

    const tests = await this.generateWithLLM([
      { role: 'user', content: prompt }
    ])

    return {
      type: 'tests',
      code: this.extractCode(tests, 'javascript'),
    }
  }

  private extractCode(response: string, lang: string): string {
    const codeMatch = response.match(new RegExp(`\`\`\`${lang}\\n([\\s\\S]*?)\\n\`\`\``))
    return codeMatch ? codeMatch[1] : response
  }
}

/**
 * Agent Orchestrator
 * Manages multiple agents and coordinates their execution
 */
export class AgentOrchestrator {
  private agents: Map<string, BaseAgent>
  private tasks: AgentTask[]
  private context: AgentContext

  constructor() {
    this.agents = new Map()
    this.tasks = []
    this.context = {
      projectType: 'custom',
      chain: 'avalanche',
      requirements: '',
      files: new Map(),
    }

    // Register agents
    this.registerAgent('contract', new ContractGeneratorAgent())
    this.registerAgent('frontend', new FrontendGeneratorAgent())
    this.registerAgent('security', new SecurityAuditorAgent())
    this.registerAgent('test', new TestGeneratorAgent())
  }

  registerAgent(id: string, agent: BaseAgent) {
    this.agents.set(id, agent)
  }

  setContext(context: Partial<AgentContext>) {
    this.context = { ...this.context, ...context }
  }

  addTask(task: Omit<AgentTask, 'id' | 'status'>): string {
    const id = `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    this.tasks.push({
      ...task,
      id,
      status: 'pending',
    })
    return id
  }

  async *executeWorkflow(requirements: string): AsyncGenerator<StreamUpdate> {
    this.context.requirements = requirements

    // Step 1: Generate contract
    yield* this.executeAgentStream('contract', {
      id: 'contract_gen',
      type: 'generate_contract',
      description: 'Generate smart contract',
      priority: 1,
      status: 'in_progress',
    })

    // Step 2: Audit security
    yield* this.executeAgentStream('security', {
      id: 'security_audit',
      type: 'audit_security',
      description: 'Audit contract security',
      priority: 2,
      status: 'in_progress',
    })

    // Step 3: Generate frontend
    yield* this.executeAgentStream('frontend', {
      id: 'frontend_gen',
      type: 'generate_frontend',
      description: 'Generate frontend',
      priority: 3,
      status: 'in_progress',
    })

    // Step 4: Generate tests
    yield* this.executeAgentStream('test', {
      id: 'test_gen',
      type: 'test',
      description: 'Generate tests',
      priority: 4,
      status: 'in_progress',
    })
  }

  private async *executeAgentStream(agentId: string, task: AgentTask): AsyncGenerator<StreamUpdate> {
    const agent = this.agents.get(agentId)
    if (!agent) {
      yield {
        type: 'error',
        agent: agentId,
        content: `Agent ${agentId} not found`,
      }
      return
    }

    if ('executeStream' in agent && typeof agent.executeStream === 'function') {
      yield* (agent as any).executeStream(this.context, task)
    } else {
      const result = await agent.execute(this.context, task)
      yield {
        type: 'complete',
        agent: agentId,
        content: 'Task completed',
        data: result,
      }
    }
  }
}

// Export singleton
export const orchestrator = new AgentOrchestrator()
