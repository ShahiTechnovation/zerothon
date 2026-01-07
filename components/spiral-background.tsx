'use client'

import { DotScreenShader } from "@/components/ui/dot-shader-background-simple"
import { ReactNode } from 'react'

interface SpiralBackgroundProps {
  children: ReactNode
  opacity?: number
}

export function SpiralBackground({ children, opacity = 1 }: SpiralBackgroundProps) {
  return (
    <div className="relative min-h-screen w-full">
      {/* Dot Shader Background */}
      <div 
        className="fixed inset-0 w-full h-full pointer-events-none z-0"
        style={{ opacity }}
      >
        <DotScreenShader />
      </div>
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  )
}
