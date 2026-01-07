"use client"

import type React from "react"
import { useState } from "react"
import { Lightning, ElasticHueSlider } from "@/components/ui/hero-odyssey"
import { motion } from "framer-motion"

interface BackgroundAnimationWrapperProps {
  children: React.ReactNode
}

export function BackgroundAnimationWrapper({ children }: BackgroundAnimationWrapperProps) {
  const [lightningHue, setLightningHue] = useState(220)

  return (
    <div className="relative w-full min-h-screen bg-black text-white overflow-hidden">
      {/* Background animation - fixed position */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="fixed inset-0 z-0 pointer-events-none"
      >
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/80"></div>

        {/* Glowing circle */}
        <div className="absolute top-[55%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-gradient-to-b from-blue-500/20 to-purple-600/10 blur-3xl"></div>

        {/* Central light beam */}
        <div className="absolute top-0 w-full left-1/2 transform -translate-x-1/2 h-full">
          <Lightning hue={lightningHue} xOffset={0} speed={1.6} intensity={0.6} size={2} />
        </div>

        {/* Planet/sphere */}
        <div className="absolute top-[55%] left-1/2 transform -translate-x-1/2 w-[600px] h-[600px] backdrop-blur-3xl rounded-full bg-[radial-gradient(circle_at_25%_90%,_#1e386b_15%,_#000000de_70%,_#000000ed_100%)]"></div>
      </motion.div>

      {/* Content - relative positioning to appear above background */}
      <div className="relative z-10">{children}</div>

      {/* Hue slider - fixed position at bottom */}
      
    </div>
  )
}
