"use client"

import { useEffect, useState } from "react"

export function StatsSection() {
  const [counts, setCounts] = useState({
    contracts: 0,
    developers: 0,
    deployments: 0,
    savings: 0,
  })

  const finalCounts = {
    contracts: 10000,
    developers: 2500,
    deployments: 50000,
    savings: 75,
  }

  useEffect(() => {
    const duration = 2000 // 2 seconds
    const steps = 60
    const stepDuration = duration / steps

    let step = 0
    const timer = setInterval(() => {
      step++
      const progress = step / steps
      const easeOut = 1 - Math.pow(1 - progress, 3)

      setCounts({
        contracts: Math.floor(finalCounts.contracts * easeOut),
        developers: Math.floor(finalCounts.developers * easeOut),
        deployments: Math.floor(finalCounts.deployments * easeOut),
        savings: Math.floor(finalCounts.savings * easeOut),
      })

      if (step >= steps) {
        clearInterval(timer)
        setCounts(finalCounts)
      }
    }, stepDuration)

    return () => clearInterval(timer)
  }, [])

  const stats = [
    {
      label: "Smart Contracts to Compile",
      value: counts.contracts.toLocaleString(),
      suffix: "+",
    },
    {
      label: "Developers to Empower",
      value: counts.developers.toLocaleString(),
      suffix: "+",
    },
    {
      label: "Deployments to Enable",
      value: counts.deployments.toLocaleString(),
      suffix: "+",
    },
    {
      label: "Development Time to Save",
      value: counts.savings,
      suffix: "%",
    },
  ]

  return (
    <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-xl p-8 border border-slate-700">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((stat, index) => (
          <div key={index} className="text-center">
            <div className="text-3xl lg:text-4xl font-mono font-bold text-white mb-2">
              <span className="text-blue-400">{stat.value}</span>
              <span className="text-red-400">{stat.suffix}</span>
            </div>
            <div className="text-slate-400 text-sm font-medium">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
