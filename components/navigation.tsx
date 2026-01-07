"use client"

import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import { Logo } from "@/components/ui/logo"

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/features", label: "Features" },
    { href: "/ai-chat", label: "AI Chat", premium: true, new: true },
    { href: "/docs", label: "Documentation" },
    { href: "/templates", label: "Templates" },
    { href: "/playground", label: "Playground" },
    { href: "/ai", label: "AI Agent", premium: true, new: true },
  ]

  return (
    <nav className="fixed top-0 w-full z-50 bg-background/95 backdrop-blur-md border-b border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center flex-shrink-0">
            <Logo size={40} />
          </Link>

          <div className="hidden lg:flex items-center space-x-6 flex-1 justify-center">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="relative text-foreground/80 hover:text-primary transition-all duration-200 flex items-center space-x-1 px-3 py-2 rounded-md hover:bg-accent/50"
              >
                <span className="text-sm font-medium">{item.label}</span>
                {item.premium && (
                  <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs px-2 py-0.5 rounded-full font-medium">
                    PRO
                  </span>
                )}
                {item.new && (
                  <span className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs px-2 py-0.5 rounded-full font-medium animate-pulse">
                    NEW
                  </span>
                )}
              </Link>
            ))}
          </div>

          <div className="hidden lg:flex items-center space-x-3 flex-shrink-0">
            <Link href="/ai-chat">
              <Button variant="outline" size="sm" className="glow-border bg-transparent text-sm">
                Try AI Chat
              </Button>
            </Link>
            <Link href="/ai">
              <Button size="sm" className="gradient-primary text-white font-medium text-sm">
                AI Agent
              </Button>
            </Link>
          </div>

          <div className="lg:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
              className="text-foreground hover:bg-accent/50 transition-colors"
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {isOpen && (
          <div className="lg:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-card/95 backdrop-blur-sm rounded-lg mt-2 border border-border/50 shadow-lg">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block px-3 py-2 text-foreground/80 hover:text-primary hover:bg-accent/50 transition-all duration-200 rounded-md flex items-center justify-between"
                  onClick={() => setIsOpen(false)}
                >
                  <span className="text-sm font-medium">{item.label}</span>
                  {item.premium && (
                    <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs px-2 py-0.5 rounded-full font-medium">
                      PRO
                    </span>
                  )}
                </Link>
              ))}
              <div className="px-3 py-2 space-y-2 border-t border-border/50 mt-2 pt-3">
                <Button variant="outline" size="sm" className="w-full glow-border bg-transparent text-sm">
                  Get Started
                </Button>
                <Link href="/ai">
                  <Button size="sm" className="w-full gradient-primary text-white font-medium text-sm">
                    AI Agent
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
