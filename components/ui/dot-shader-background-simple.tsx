'use client'

import { useEffect, useState } from 'react'

export const DotScreenShader = () => {
  const [mounted, setMounted] = useState(false)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  useEffect(() => {
    setMounted(true)
    
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY })
    }
    
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  if (!mounted) {
    return <div className="w-full h-full bg-[#0a0a0f]" />
  }

  return (
    <div className="w-full h-full relative overflow-hidden bg-[#0a0a0f]">
      {/* Base dot grid */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.08) 1px, transparent 1px)`,
          backgroundSize: '30px 30px',
          backgroundPosition: 'center center'
        }}
      />
      
      {/* Animated gradient overlay */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          background: `radial-gradient(circle 600px at ${mousePos.x}px ${mousePos.y}px, rgba(0, 102, 255, 0.15), transparent 70%)`
        }}
      />
      
      {/* Center glow */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          background: `radial-gradient(ellipse 800px 600px at 50% 50%, rgba(220, 20, 60, 0.1), transparent 70%)`
        }}
      />
    </div>
  )
}
