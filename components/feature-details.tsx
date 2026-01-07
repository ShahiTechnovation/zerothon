import {
  Code2,
  Zap,
  Shield,
  Cpu,
  GitBranch,
  TestTube,
  Database,
  Globe,
  Layers,
  Settings,
  Users,
  BarChart3,
} from "lucide-react"

export function FeatureDetails() {
  const features = [
    {
      category: "Development",
      items: [
        {
          icon: Code2,
          title: "Python-First Syntax",
          description: "Write smart contracts using familiar Python syntax with full type safety and IDE support.",
          benefits: ["Faster development", "Lower learning curve", "Better code readability"],
        },
        {
          icon: Zap,
          title: "Lightning Compilation",
          description: "Compile Python to optimized Solidity in milliseconds with advanced optimization techniques.",
          benefits: ["Sub-second compilation", "Gas optimization", "Dead code elimination"],
        },
        {
          icon: GitBranch,
          title: "Version Control",
          description: "Seamless Git integration with automated contract versioning and deployment tracking.",
          benefits: ["Automated versioning", "Deployment history", "Rollback capabilities"],
        },
      ],
    },
    {
      category: "Security",
      items: [
        {
          icon: Shield,
          title: "Built-in Security",
          description: "Comprehensive security analysis with vulnerability detection and best practice enforcement.",
          benefits: ["Vulnerability scanning", "Best practice checks", "Real-time analysis"],
        },
        {
          icon: TestTube,
          title: "Automated Testing",
          description: "Generate comprehensive test suites automatically with edge case detection.",
          benefits: ["Auto-generated tests", "Edge case coverage", "Continuous testing"],
        },
        {
          icon: Database,
          title: "Formal Verification",
          description: "Mathematical proof of contract correctness using advanced verification techniques.",
          benefits: ["Mathematical proofs", "Correctness guarantees", "Bug prevention"],
        },
      ],
    },
    {
      category: "Deployment",
      items: [
        {
          icon: Globe,
          title: "Multi-Chain Support",
          description: "Deploy to any EVM-compatible blockchain with optimized configurations for each network.",
          benefits: ["20+ supported chains", "Network optimization", "Cross-chain compatibility"],
        },
        {
          icon: Cpu,
          title: "Gas Optimization",
          description: "Advanced gas optimization techniques to minimize transaction costs and improve efficiency.",
          benefits: ["Up to 30% gas savings", "Bytecode optimization", "Storage optimization"],
        },
        {
          icon: BarChart3,
          title: "Analytics & Monitoring",
          description: "Real-time contract monitoring with detailed analytics and performance metrics.",
          benefits: ["Real-time monitoring", "Performance metrics", "Usage analytics"],
        },
      ],
    },
    {
      category: "Collaboration",
      items: [
        {
          icon: Users,
          title: "Team Collaboration",
          description: "Built-in collaboration tools for teams with role-based access control and code reviews.",
          benefits: ["Role-based access", "Code reviews", "Team workspaces"],
        },
        {
          icon: Layers,
          title: "Template Library",
          description: "Extensive library of pre-built contract templates for common use cases and patterns.",
          benefits: ["50+ templates", "Best practices", "Quick start"],
        },
        {
          icon: Settings,
          title: "Custom Integrations",
          description: "Flexible API and webhook system for integrating with existing development workflows.",
          benefits: ["REST API", "Webhooks", "CI/CD integration"],
        },
      ],
    },
  ]

  return (
    <div className="space-y-16">
      {features.map((category, categoryIndex) => (
        <div key={categoryIndex}>
          <h3 className="text-2xl font-mono font-bold text-white mb-8 text-center">{category.category}</h3>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {category.items.map((feature, index) => (
              <div
                key={index}
                className="group bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl p-6 border border-slate-700 hover:border-blue-500/50 transition-all duration-300"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-red-500 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-lg font-mono font-semibold text-white mb-2">{feature.title}</h4>
                    <p className="text-slate-400 text-sm leading-relaxed">{feature.description}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  {feature.benefits.map((benefit, benefitIndex) => (
                    <div key={benefitIndex} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                      <span className="text-slate-300 text-sm">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
