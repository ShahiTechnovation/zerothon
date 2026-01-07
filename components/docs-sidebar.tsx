"use client"

import { useState } from "react"
import { ChevronDown, ChevronRight, Book, Code, Zap, Shield, Rocket, Settings } from "lucide-react"

export function DocsSidebar() {
  const [expandedSections, setExpandedSections] = useState<string[]>(["getting-started"])

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) =>
      prev.includes(sectionId) ? prev.filter((id) => id !== sectionId) : [...prev, sectionId],
    )
  }

  const docSections = [
    {
      id: "getting-started",
      title: "Getting Started",
      icon: Rocket,
      items: [
        { id: "introduction", title: "Introduction", href: "#introduction" },
        { id: "installation", title: "Installation", href: "#installation" },
        { id: "quick-start", title: "Quick Start", href: "#quick-start" },
        { id: "first-contract", title: "Your First Contract", href: "#first-contract" },
      ],
    },
    {
      id: "language-guide",
      title: "Language Guide",
      icon: Code,
      items: [
        { id: "syntax", title: "Python Syntax", href: "#syntax" },
        { id: "types", title: "Data Types", href: "#types" },
        { id: "functions", title: "Functions", href: "#functions" },
        { id: "decorators", title: "Decorators", href: "#decorators" },
        { id: "events", title: "Events", href: "#events" },
      ],
    },
    {
      id: "advanced",
      title: "Advanced Topics",
      icon: Zap,
      items: [
        { id: "optimization", title: "Gas Optimization", href: "#optimization" },
        { id: "patterns", title: "Design Patterns", href: "#patterns" },
        { id: "inheritance", title: "Inheritance", href: "#inheritance" },
        { id: "libraries", title: "Libraries", href: "#libraries" },
      ],
    },
    {
      id: "security",
      title: "Security",
      icon: Shield,
      items: [
        { id: "best-practices", title: "Best Practices", href: "#best-practices" },
        { id: "vulnerabilities", title: "Common Vulnerabilities", href: "#vulnerabilities" },
        { id: "auditing", title: "Security Auditing", href: "#auditing" },
        { id: "testing", title: "Security Testing", href: "#testing" },
      ],
    },
    {
      id: "deployment",
      title: "Deployment",
      icon: Rocket,
      items: [
        { id: "networks", title: "Supported Networks", href: "#networks" },
        { id: "deployment-guide", title: "Deployment Guide", href: "#deployment-guide" },
        { id: "verification", title: "Contract Verification", href: "#verification" },
        { id: "monitoring", title: "Monitoring", href: "#monitoring" },
      ],
    },
    {
      id: "api-reference",
      title: "API Reference",
      icon: Book,
      items: [
        { id: "cli", title: "CLI Commands", href: "#cli" },
        { id: "python-api", title: "Python API", href: "#python-api" },
        { id: "rest-api", title: "REST API", href: "#rest-api" },
        { id: "webhooks", title: "Webhooks", href: "#webhooks" },
      ],
    },
    {
      id: "configuration",
      title: "Configuration",
      icon: Settings,
      items: [
        { id: "config-file", title: "Configuration File", href: "#config-file" },
        { id: "environment", title: "Environment Variables", href: "#environment" },
        { id: "plugins", title: "Plugins", href: "#plugins" },
        { id: "integrations", title: "Integrations", href: "#integrations" },
      ],
    },
  ]

  return (
    <nav className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl border border-slate-700 p-6">
      <div className="mb-6">
        <h2 className="text-lg font-mono font-bold text-white">Documentation</h2>
        <p className="text-sm text-slate-400 mt-1">Complete guide to PyVax</p>
      </div>

      <div className="space-y-2">
        {docSections.map((section) => (
          <div key={section.id}>
            <button
              onClick={() => toggleSection(section.id)}
              className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-slate-800 rounded-lg transition-colors group"
            >
              <section.icon className="w-4 h-4 text-slate-400 group-hover:text-blue-400" />
              <span className="text-sm font-medium text-slate-300 group-hover:text-white flex-1">{section.title}</span>
              {expandedSections.includes(section.id) ? (
                <ChevronDown className="w-4 h-4 text-slate-400" />
              ) : (
                <ChevronRight className="w-4 h-4 text-slate-400" />
              )}
            </button>

            {expandedSections.includes(section.id) && (
              <div className="ml-7 mt-2 space-y-1">
                {section.items.map((item) => (
                  <a
                    key={item.id}
                    href={item.href}
                    className="block px-3 py-1.5 text-sm text-slate-400 hover:text-blue-400 hover:bg-slate-800/50 rounded transition-colors"
                  >
                    {item.title}
                  </a>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-8 pt-6 border-t border-slate-700">
        <div className="text-xs text-slate-500 space-y-2">
          <div>Version 2.1.0</div>
          <div>Last updated: Dec 2024</div>
        </div>
      </div>
    </nav>
  )
}
