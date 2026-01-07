import { Code, Zap, Shield, Cpu } from "lucide-react"

export function FeatureHighlights() {
  const features = [
    {
      icon: Code,
      title: "Python-First Development",
      description: "Write smart contracts in familiar Python syntax with full type safety and IDE support.",
    },
    {
      icon: Zap,
      title: "Lightning Fast Compilation",
      description: "Compile Python to optimized EVM bytecode in milliseconds, not minutes.",
    },
    {
      icon: Shield,
      title: "Built-in Security",
      description: "Automatic security checks and vulnerability detection during compilation.",
    },
    {
      icon: Cpu,
      title: "EVM Compatible",
      description: "Deploy to any EVM-compatible blockchain with full compatibility guarantees.",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {features.map((feature, index) => (
        <div
          key={index}
          className="group relative bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl p-6 border border-slate-700 hover:border-blue-500/50 transition-all duration-300"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-red-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />

          <div className="relative z-10">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-red-500 rounded-lg flex items-center justify-center mb-4">
              <feature.icon className="w-6 h-6 text-white" />
            </div>

            <h3 className="text-lg font-mono text-white mb-2">{feature.title}</h3>

            <p className="text-slate-400 text-sm leading-relaxed">{feature.description}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
