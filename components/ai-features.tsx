import { Brain, Code, Shield, Zap, GitBranch, TestTube } from "lucide-react"

export function AiFeatures() {
  const features = [
    {
      icon: Brain,
      title: "Intelligent Code Generation",
      description: "Generate complete smart contracts from natural language descriptions with context-aware AI.",
      gradient: "from-purple-500 to-pink-500",
    },
    {
      icon: Code,
      title: "Code Optimization",
      description: "Automatically optimize your Python contracts for gas efficiency and performance.",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      icon: Shield,
      title: "Security Analysis",
      description: "Real-time vulnerability detection and security best practice recommendations.",
      gradient: "from-green-500 to-emerald-500",
    },
    {
      icon: Zap,
      title: "Instant Compilation",
      description: "Lightning-fast Python to Solidity compilation with detailed error reporting.",
      gradient: "from-yellow-500 to-orange-500",
    },
    {
      icon: GitBranch,
      title: "Version Control Integration",
      description: "Seamless integration with Git workflows and automated contract versioning.",
      gradient: "from-indigo-500 to-purple-500",
    },
    {
      icon: TestTube,
      title: "Automated Testing",
      description: "Generate comprehensive test suites for your smart contracts automatically.",
      gradient: "from-red-500 to-pink-500",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {features.map((feature, index) => (
        <div
          key={index}
          className="group relative bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl p-6 border border-slate-700 hover:border-slate-600 transition-all duration-300 overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-red-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />

          <div className="relative z-10">
            <div
              className={`w-12 h-12 bg-gradient-to-r ${feature.gradient} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
            >
              <feature.icon className="w-6 h-6 text-white" />
            </div>

            <h3 className="text-lg font-mono font-semibold text-white mb-3">{feature.title}</h3>

            <p className="text-slate-400 text-sm leading-relaxed">{feature.description}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
