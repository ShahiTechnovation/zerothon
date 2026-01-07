"use client"

import { SpiralAnimation } from "@/components/ui/spiral-animation"
import { useState, useEffect } from "react"

export default function SpiralPage() {
  const [startVisible, setStartVisible] = useState(false)

  // Fade in the start button after animation loads
  useEffect(() => {
    const timer = setTimeout(() => {
      setStartVisible(true)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden bg-black">
      {/* Spiral Animation Background */}
      <div className="absolute inset-0">
        <SpiralAnimation />
      </div>

      {/* Overlay Content */}
      <div
        className={`
          absolute inset-0 flex flex-col items-center justify-center z-10
          transition-all duration-1500 ease-out
          ${startVisible ? "opacity-100" : "opacity-0"}
        `}
      >
        <div className="text-center space-y-6">
          <h1 className="text-5xl md:text-6xl font-bold text-white tracking-tight">zerothon</h1>
          <p className="text-xl md:text-2xl text-slate-300 max-w-2xl mx-auto">
            Python to EVM Smart Contract Development
          </p>
          <div className="flex gap-4 justify-center pt-8">
            <a
              href="/"
              className="px-8 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-colors"
            >
              Explore
            </a>
            <a
              href="/ai-chat"
              className="px-8 py-3 border border-primary text-primary rounded-lg font-semibold hover:bg-primary/10 transition-colors"
            >
              AI Chat
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
