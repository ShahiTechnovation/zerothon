import Link from "next/link"
import { Github, Twitter, Diamond as Discord, Zap } from "lucide-react"

export function Footer() {
  const footerSections = [
    {
      title: "Product",
      links: [
        { href: "/features", label: "Features" },
        { href: "/playground", label: "Playground" },
        { href: "/templates", label: "Templates" },
      ],
    },
    {
      title: "Resources",
      links: [
        { href: "/docs", label: "Documentation" },
        { href: "/docs/getting-started", label: "Getting Started" },
        { href: "/docs/api", label: "API Reference" },
        { href: "/docs/tutorials", label: "Tutorials" },
      ],
    },
    {
      title: "Community",
      links: [
        { href: "#", label: "GitHub" },
        { href: "#", label: "Discord" },
        { href: "#", label: "Twitter" },
        { href: "#", label: "Blog" },
      ],
    },
    {
      title: "Company",
      links: [
        { href: "/about", label: "About" },
        { href: "/careers", label: "Careers" },
        { href: "/privacy", label: "Privacy" },
        { href: "/terms", label: "Terms" },
      ],
    },
  ]

  return (
    <footer className="relative z-10 bg-card border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="font-mono font-bold text-xl gradient-text">zerothon</span>
            </Link>
            <p className="text-muted-foreground text-sm mb-4">
              Bridge the gap between Web2 and Web3 with Python-to-EVM smart contract development.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Github className="w-5 h-5" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter className="w-5 h-5" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Discord className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* Footer Sections */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="font-mono font-semibold text-foreground mb-4">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-muted-foreground hover:text-primary transition-colors text-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-border mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-muted-foreground text-sm">© 2025 zerothon. All rights reserved.</p>
          <p className="text-muted-foreground text-sm mt-2 md:mt-0">Built for Python developers entering Web3</p>
        </div>
      </div>
    </footer>
  )
}
