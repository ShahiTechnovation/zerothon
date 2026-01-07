import { generateText } from "ai"

interface AgentContext {
  template: string
  userPrompt: string
  previousOutput?: string
}

interface AgentResult {
  agentId: string
  agentName: string
  output: string
  timestamp: number
}

class AgentOrchestrator {
  private agents = [
    {
      id: "architect",
      name: "Architect Agent",
      role: "Smart Contract Design",
      systemPrompt: `You are a smart contract architect. Your role is to design the architecture and data structures for a Web3 dApp.
      
Analyze the user's request and provide:
1. Contract architecture overview
2. Key data structures and state variables
3. Main functions and their purposes
4. Security considerations
5. Gas optimization strategies

Be concise and technical. Output should be structured as a design document.`,
    },
    {
      id: "developer",
      name: "Developer Agent",
      role: "Code Generation",
      systemPrompt: `You are an expert Solidity developer. Your role is to generate production-ready smart contract code.

Based on the architecture provided, generate:
1. Complete Solidity contract code
2. Proper error handling and validation
3. NatSpec documentation
4. OpenZeppelin imports where needed
5. Event definitions

Output only the Solidity code with comments. Make it production-ready.`,
    },
    {
      id: "auditor",
      name: "Security Auditor",
      role: "Vulnerability Detection",
      systemPrompt: `You are a Web3 security auditor. Your role is to review smart contract code for vulnerabilities.

Analyze the provided code and identify:
1. Potential security vulnerabilities
2. Best practice violations
3. Access control issues
4. Reentrancy risks
5. Recommendations for fixes

Provide a security audit report with severity levels.`,
    },
    {
      id: "optimizer",
      name: "Gas Optimizer",
      role: "Performance Tuning",
      systemPrompt: `You are a gas optimization expert. Your role is to optimize smart contracts for efficiency.

Review the code and provide:
1. Gas optimization opportunities
2. Storage layout improvements
3. Function optimization suggestions
4. Batch operation recommendations
5. Optimized code snippets

Focus on practical, implementable optimizations.`,
    },
  ]

  async orchestrate(template: string, userPrompt: string): Promise<AgentResult[]> {
    const results: AgentResult[] = []
    const context: AgentContext = {
      template,
      userPrompt,
    }

    for (const agent of this.agents) {
      console.log(`[v0] Starting ${agent.name}...`)

      const prompt = this.buildAgentPrompt(agent, context)

      const { text } = await generateText({
        model: "openai/gpt-4-turbo",
        system: agent.systemPrompt,
        prompt,
        maxTokens: 2000,
        temperature: 0.7,
      })

      const result: AgentResult = {
        agentId: agent.id,
        agentName: agent.name,
        output: text,
        timestamp: Date.now(),
      }

      results.push(result)
      context.previousOutput = text

      console.log(`[v0] ${agent.name} completed`)
    }

    return results
  }

  private buildAgentPrompt(agent: any, context: AgentContext): string {
    let prompt = `Template: ${context.template}\nUser Request: ${context.userPrompt}\n\n`

    if (context.previousOutput) {
      prompt += `Previous Agent Output:\n${context.previousOutput}\n\n`
    }

    prompt += `Please provide your analysis and output for this dApp.`

    return prompt
  }
}

export const agentOrchestrator = new AgentOrchestrator()
