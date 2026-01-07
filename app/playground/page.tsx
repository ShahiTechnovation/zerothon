"use client"

import { useRef, useEffect } from 'react'
import { BottomDockMenu } from "@/components/bottom-dock-menu"
import { UnifiedIDE } from "@/components/zerothan-ai/unified-ide"
import { motion } from "framer-motion"

export default function PlaygroundPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Binary waterfall background effect
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    const fontSize = 12
    const columns = Math.floor(canvas.width / fontSize)
    const drops: number[] = Array(columns).fill(1).map(() => Math.random() * -100)
    const speeds: number[] = Array(columns).fill(1).map(() => Math.random() * 1.5 + 0.5)
    const chars = '01'

    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.08)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.font = `${fontSize}px "Courier New", monospace`

      for (let i = 0; i < drops.length; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)]
        const x = i * fontSize
        const y = drops[i] * fontSize

        const opacity = Math.random() * 0.2 + 0.1
        ctx.fillStyle = `rgba(${150 + Math.random() * 105}, ${150 + Math.random() * 105}, ${150 + Math.random() * 105}, ${opacity})`
        ctx.fillText(char, x, y)

        if (y > canvas.height && Math.random() > 0.95) {
          drops[i] = 0
          speeds[i] = Math.random() * 1.5 + 0.5
        }

        drops[i] += speeds[i]
      }
    }

    const interval = setInterval(draw, 40)

    return () => {
      clearInterval(interval)
      window.removeEventListener('resize', resizeCanvas)
    }
  }, [])

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Binary Waterfall Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full opacity-20"
        style={{ zIndex: 1 }}
      />

      {/* VHS Noise Overlay */}
      <div className="vhs-noise" />

      {/* CRT Scanlines */}
      <div className="scanlines" />

      <BottomDockMenu />

      <main className="relative min-h-screen pt-4 px-4 pb-4" style={{ zIndex: 10 }}>
        <div className="max-w-[1800px] mx-auto flex flex-col h-[calc(100vh-2rem)]">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 shrink-0"
          >
            <div className="flex items-center gap-4 mb-2">
              <div className="relative">
                <div className="w-12 h-12 bg-gray-800/50 backdrop-blur-sm border border-gray-600 rounded-lg flex items-center justify-center p-2">
                  <img
                    src="/zerothon-logo.svg"
                    alt="zerothon Logo"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white glitch-text tracking-wider">
                  Smart Contract <span className="text-gray-400">Playground</span>
                </h1>
                <p className="text-gray-500 text-sm font-mono">
                  WRITE • COMPILE • DEPLOY • INTERACT
                </p>
              </div>
            </div>
          </motion.div>

          {/* IDE */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="flex-1 min-h-0 shadow-2xl border border-gray-800 rounded-lg overflow-hidden"
          >
            <UnifiedIDE />
          </motion.div>
        </div>
      </main>

      {/* RGB Split Overlay */}
      <div className="rgb-split" />

      <style jsx>{`
        /* VHS Noise Effect */
        .vhs-noise {
          position: absolute;
          inset: 0;
          background-image: 
            repeating-linear-gradient(
              0deg,
              transparent,
              transparent 2px,
              rgba(255, 255, 255, 0.02) 2px,
              rgba(255, 255, 255, 0.02) 4px
            );
          opacity: 0.3;
          animation: vhs-noise 0.2s infinite;
          pointer-events: none;
          z-index: 5;
        }

        @keyframes vhs-noise {
          0%, 100% { 
            transform: translateY(0); 
            opacity: 0.3;
          }
          50% { 
            transform: translateY(2px); 
            opacity: 0.2;
          }
        }

        /* CRT Scanlines */
        .scanlines {
          position: absolute;
          inset: 0;
          background: repeating-linear-gradient(
            0deg,
            rgba(0, 0, 0, 0.1),
            rgba(0, 0, 0, 0.1) 1px,
            transparent 1px,
            transparent 2px
          );
          pointer-events: none;
          z-index: 6;
          animation: scanline-flicker 0.1s infinite;
        }

        @keyframes scanline-flicker {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 0.3; }
        }

        /* Glitch Text Effect */
        .glitch-text {
          position: relative;
          color: #fff;
          text-shadow: 
            1px 0 #ff0000,
            -1px 0 #00ffff,
            0 0 10px rgba(255, 255, 255, 0.3);
          animation: glitch-anim 3s infinite;
        }

        @keyframes glitch-anim {
          0%, 90%, 100% {
            text-shadow: 
              1px 0 #ff0000,
              -1px 0 #00ffff,
              0 0 10px rgba(255, 255, 255, 0.3);
          }
          91% {
            text-shadow: 
              3px 0 #ff0000,
              -3px 0 #00ffff,
              0 0 20px rgba(255, 255, 255, 0.5);
          }
          92% {
            text-shadow: 
              -3px 0 #ff0000,
              3px 0 #00ffff,
              0 0 20px rgba(255, 255, 255, 0.5);
          }
          93% {
            text-shadow: 
              1px 0 #ff0000,
              -1px 0 #00ffff,
              0 0 10px rgba(255, 255, 255, 0.3);
          }
        }

        /* RGB Split Effect */
        .rgb-split {
          position: absolute;
          inset: 0;
          background: 
            radial-gradient(circle at 20% 50%, rgba(255, 0, 0, 0.05) 0%, transparent 50%),
            radial-gradient(circle at 80% 50%, rgba(0, 255, 255, 0.05) 0%, transparent 50%);
          mix-blend-mode: screen;
          animation: rgb-shift 0.5s infinite;
          pointer-events: none;
          z-index: 7;
        }

        @keyframes rgb-shift {
          0%, 100% {
            transform: translate(0);
            opacity: 0.2;
          }
          25% {
            transform: translate(1px, -1px);
            opacity: 0.3;
          }
          50% {
            transform: translate(-1px, 1px);
            opacity: 0.25;
          }
          75% {
            transform: translate(1px, 1px);
            opacity: 0.35;
          }
        }
      `}</style>
    </div>
  )
}
