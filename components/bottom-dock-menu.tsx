"use client"

import Link from "next/link"
import { Home, Zap, Layout, BookOpen, Code2, MessageSquare, Sparkles } from "lucide-react"
import { Dock, DockIcon, DockItem, DockLabel } from "@/components/ui/dock"

const menuItems = [
  {
    title: "Home",
    icon: Home,
    href: "/",
  },
  {
    title: "AI Chat",
    icon: MessageSquare,
    href: "/ai-chat",
  },
  {
    title: "Zero Wizard",
    icon: Sparkles,
    href: "/wizard",
  },
  {
    title: "Features",
    icon: Zap,
    href: "/features",
  },
  {
    title: "Templates",
    icon: Layout,
    href: "/templates",
  },
  {
    title: "Documentation",
    icon: BookOpen,
    href: "/docs",
  },
  {
    title: "Playground",
    icon: Code2,
    href: "/playground",
  },
]

export function BottomDockMenu() {
  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40">
      <Dock className="items-end pb-3">
        {menuItems.map((item, idx) => {
          const Icon = item.icon
          return (
            <DockItem
              key={idx}
              className="aspect-square rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 hover:from-primary/40 hover:to-secondary/40 transition-all duration-300 border border-primary/30 hover:border-primary/60"
            >
              <DockLabel>{item.title}</DockLabel>
              <Link href={item.href} className="flex items-center justify-center w-full h-full">
                <DockIcon>
                  <Icon className="h-full w-full text-primary dark:text-primary" />
                </DockIcon>
              </Link>
            </DockItem>
          )
        })}
      </Dock>
    </div>
  )
}
