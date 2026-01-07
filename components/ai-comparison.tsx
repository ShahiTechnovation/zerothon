"use client"

import { motion } from "framer-motion"
import { X, Check, Sparkles } from "lucide-react"

const comparisonData = [
  {
    feature: "Development Time",
    traditional: "Weeks to months",
    pyvax: "Minutes to hours",
    highlight: true,
  },
  {
    feature: "Required Skills",
    traditional: "Solidity, Web3.js, React, Security",
    pyvax: "Natural language + Python basics",
    highlight: true,
  },
  {
    feature: "Smart Contract Language",
    traditional: "Solidity (steep learning curve)",
    pyvax: "Python (familiar & intuitive)",
    highlight: false,
  },
  {
    feature: "Security Auditing",
    traditional: "Manual + expensive audits",
    pyvax: "Automated AI security checks",
    highlight: false,
  },
  {
    feature: "Frontend Development",
    traditional: "Manual React development",
    pyvax: "AI-generated full-stack",
    highlight: false,
  },
  {
    feature: "Deployment Process",
    traditional: "Complex multi-step setup",
    pyvax: "One-click deployment",
    highlight: false,
  },
  {
    feature: "Code Understanding",
    traditional: "Complex Solidity syntax",
    pyvax: "Readable Python code",
    highlight: false,
  },
  {
    feature: "Iteration Speed",
    traditional: "Slow (manual changes)",
    pyvax: "Fast (AI-powered updates)",
    highlight: true,
  },
]

export function AIComparison() {
  return (
    <section className="relative z-10 py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-900/80 to-slate-950/80">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-full px-4 py-2 mb-6">
            <Sparkles className="w-4 h-4 text-green-400" />
            <span className="text-sm text-green-300 font-medium">The PyVax Advantage</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Traditional Development vs{" "}
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">PyVax AI</span>
          </h2>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto">
            See how PyVax AI accelerates your Web3 development journey
          </p>
        </motion.div>

        {/* Comparison Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 blur-3xl" />
          
          <div className="relative bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl overflow-hidden">
            {/* Table Header */}
            <div className="grid grid-cols-3 gap-4 p-6 bg-slate-900/50 border-b border-slate-700">
              <div className="text-slate-400 font-semibold">Feature</div>
              <div className="text-center">
                <div className="inline-flex items-center gap-2 text-slate-400 font-semibold">
                  <X className="w-4 h-4 text-red-400" />
                  Traditional
                </div>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center gap-2 text-white font-semibold">
                  <Check className="w-4 h-4 text-green-400" />
                  PyVax AI
                </div>
              </div>
            </div>

            {/* Table Body */}
            <div className="divide-y divide-slate-700">
              {comparisonData.map((row, index) => (
                <motion.div
                  key={row.feature}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  className={`grid grid-cols-3 gap-4 p-6 ${row.highlight ? "bg-blue-500/5" : ""}`}
                >
                  <div className="flex items-center">
                    <span className="text-white font-medium">{row.feature}</span>
                    {row.highlight && (
                      <span className="ml-2 px-2 py-0.5 bg-blue-500/20 text-blue-300 text-xs rounded-full">
                        Key
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-center text-center">
                    <span className="text-slate-400 text-sm">{row.traditional}</span>
                  </div>
                  <div className="flex items-center justify-center text-center">
                    <span className="text-green-400 font-semibold text-sm">{row.pyvax}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Bottom Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700 rounded-xl p-6 text-center">
            <div className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
              10x
            </div>
            <div className="text-slate-400">Faster Development</div>
          </div>
          <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700 rounded-xl p-6 text-center">
            <div className="text-4xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent mb-2">
              75%
            </div>
            <div className="text-slate-400">Cost Reduction</div>
          </div>
          <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700 rounded-xl p-6 text-center">
            <div className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent mb-2">
              Zero
            </div>
            <div className="text-slate-400">Solidity Required</div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
