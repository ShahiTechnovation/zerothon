import { Check, X } from "lucide-react"

export function ComparisonTable() {
  const comparisons = [
    {
      feature: "Learning Curve",
      pyvax: "Familiar Python syntax",
      traditional: "Learn Solidity from scratch",
      pyvaxAdvantage: true,
    },
    {
      feature: "Development Speed",
      pyvax: "2-3x faster development",
      traditional: "Standard development pace",
      pyvaxAdvantage: true,
    },
    {
      feature: "Security Analysis",
      pyvax: "Built-in automated analysis",
      traditional: "Manual security audits",
      pyvaxAdvantage: true,
    },
    {
      feature: "Gas Optimization",
      pyvax: "Automatic optimization",
      traditional: "Manual optimization required",
      pyvaxAdvantage: true,
    },
    {
      feature: "Testing",
      pyvax: "Auto-generated test suites",
      traditional: "Manual test writing",
      pyvaxAdvantage: true,
    },
    {
      feature: "IDE Support",
      pyvax: "Full Python IDE integration",
      traditional: "Limited Solidity tooling",
      pyvaxAdvantage: true,
    },
    {
      feature: "Type Safety",
      pyvax: "Strong Python typing",
      traditional: "Solidity type system",
      pyvaxAdvantage: false,
    },
    {
      feature: "Community",
      pyvax: "Growing Python Web3 community",
      traditional: "Large Solidity ecosystem",
      pyvaxAdvantage: false,
    },
    {
      feature: "Debugging",
      pyvax: "Python debugging tools",
      traditional: "Solidity debugging tools",
      pyvaxAdvantage: true,
    },
    {
      feature: "Documentation",
      pyvax: "Python-style documentation",
      traditional: "Solidity documentation",
      pyvaxAdvantage: true,
    },
  ]

  return (
    <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl border border-slate-700 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-700">
              <th className="text-left p-6 text-slate-400 font-mono text-sm">Feature</th>
              <th className="text-center p-6 text-white font-mono text-lg">
                <span className="gradient-text">PyVax</span>
              </th>
              <th className="text-center p-6 text-slate-400 font-mono text-lg">Traditional Solidity</th>
            </tr>
          </thead>
          <tbody>
            {comparisons.map((comparison, index) => (
              <tr key={index} className="border-b border-slate-700/50 hover:bg-slate-800/30 transition-colors">
                <td className="p-6 text-white font-medium">{comparison.feature}</td>
                <td className="p-6 text-center">
                  <div className="flex items-center justify-center gap-3">
                    {comparison.pyvaxAdvantage ? (
                      <Check className="w-5 h-5 text-green-400" />
                    ) : (
                      <div className="w-5 h-5 bg-slate-600 rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-slate-400 rounded-full"></div>
                      </div>
                    )}
                    <span className="text-slate-300 text-sm">{comparison.pyvax}</span>
                  </div>
                </td>
                <td className="p-6 text-center">
                  <div className="flex items-center justify-center gap-3">
                    {!comparison.pyvaxAdvantage ? (
                      <Check className="w-5 h-5 text-green-400" />
                    ) : (
                      <X className="w-5 h-5 text-red-400" />
                    )}
                    <span className="text-slate-400 text-sm">{comparison.traditional}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="p-6 bg-slate-900/50 border-t border-slate-700">
        <div className="text-center">
          <p className="text-slate-400 text-sm mb-4">Ready to experience the PyVax advantage?</p>
          <button className="bg-gradient-to-r from-blue-500 to-red-500 hover:from-blue-600 hover:to-red-600 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105">
            Get Started Today
          </button>
        </div>
      </div>
    </div>
  )
}
