"use client"

import { motion } from "framer-motion"
import { DAPP_TEMPLATES } from "@/lib/dapp-templates"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"

interface TemplateShowcaseProps {
  onSelectTemplate?: (templateId: string) => void
}

export function TemplateShowcase({ onSelectTemplate }: TemplateShowcaseProps) {
  const complexityColors = {
    beginner: "bg-green-500/20 text-green-300",
    intermediate: "bg-yellow-500/20 text-yellow-300",
    advanced: "bg-red-500/20 text-red-300",
  }

  const gasColors = {
    Low: "bg-green-500/20 text-green-300",
    Medium: "bg-yellow-500/20 text-yellow-300",
    High: "bg-red-500/20 text-red-300",
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {DAPP_TEMPLATES.map((template, index) => (
        <motion.div
          key={template.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          onClick={() => onSelectTemplate?.(template.id)}
          className="cursor-pointer"
        >
          <Card className="h-full bg-slate-800/50 border-slate-700 hover:border-blue-500 transition-all hover:shadow-lg hover:shadow-blue-500/20">
            <div className="p-6 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-4xl mb-2">{template.icon}</div>
                  <h3 className="text-xl font-semibold text-white">{template.name}</h3>
                  <p className="text-sm text-slate-400 mt-1">{template.description}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <Badge className={complexityColors[template.complexity]}>{template.complexity}</Badge>
                <Badge className={gasColors[template.estimatedGasUsage]}>{template.estimatedGasUsage} Gas</Badge>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-semibold text-slate-300">Key Features:</p>
                <ul className="text-xs text-slate-400 space-y-1">
                  {template.features.slice(0, 3).map((feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      <span className="w-1 h-1 bg-blue-500 rounded-full"></span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-semibold text-slate-300">Smart Contracts:</p>
                <div className="flex flex-wrap gap-1">
                  {template.contracts.map((contract) => (
                    <Badge key={contract} variant="outline" className="text-xs">
                      {contract}
                    </Badge>
                  ))}
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold transition-all"
              >
                Use Template
              </motion.button>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}
