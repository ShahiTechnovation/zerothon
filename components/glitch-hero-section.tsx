'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Send, Sparkles, Code, Zap } from 'lucide-react'

export function GlitchHeroSection() {
  const router = useRouter()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // Binary waterfall effect (same as intro screen)
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

    const fontSize = 14
    const columns = Math.floor(canvas.width / fontSize)
    const drops: number[] = Array(columns).fill(1).map(() => Math.random() * -100)
    const speeds: number[] = Array(columns).fill(1).map(() => Math.random() * 2 + 1)
    const chars = '01'

    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.08)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.font = `${fontSize}px "Courier New", monospace`

      for (let i = 0; i < drops.length; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)]
        const x = i * fontSize
        const y = drops[i] * fontSize

        const opacity = Math.random() * 0.5 + 0.5
        ctx.fillStyle = `rgba(${150 + Math.random() * 105}, ${150 + Math.random() * 105}, ${150 + Math.random() * 105}, ${opacity})`
        ctx.fillText(char, x, y)

        if (y > canvas.height && Math.random() > 0.95) {
          drops[i] = 0
          speeds[i] = Math.random() * 2 + 1
        }

        drops[i] += speeds[i]
      }
    }

    const interval = setInterval(draw, 33)

    return () => {
      clearInterval(interval)
      window.removeEventListener('resize', resizeCanvas)
    }
  }, [])

  const handleSend = () => {
    if (!message.trim()) return

    setIsLoading(true)
    // Navigate to AI chat page with the message
    setTimeout(() => {
      router.push(`/ai-chat?message=${encodeURIComponent(message)}`)
      setIsLoading(false)
    }, 300)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const quickActions = [
    { icon: Sparkles, label: 'AI Chat', path: '/ai-chat' },
    { icon: Zap, label: 'Playground', path: '/playground' },
  ]

  return (
    <div className="relative w-full h-screen bg-black text-white overflow-hidden">
      {/* Binary Waterfall Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ zIndex: 1 }}
      />

      {/* VHS Noise Overlay */}
      <div className="vhs-noise" />

      {/* CRT Scanlines */}
      <div className="scanlines" />

      {/* Main Content */}
      <div className="relative z-20 h-full flex flex-col items-center justify-center px-4">
        {/* Glitchy Logo */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-12 text-center flex flex-col items-center"
        >
          {/* Logo Image */}
          <div className="mb-6 w-32 h-32 md:w-40 md:h-40 relative">
            <div className="absolute inset-0 bg-gray-800/30 backdrop-blur-sm border border-gray-600/50 rounded-2xl flex items-center justify-center p-6">
              <img
                src="/zerothon-logo.svg"
                alt="zerothon Logo"
                className="w-full h-full object-contain filter drop-shadow-lg"
              />
            </div>
          </div>

          <h1 className="glitch-text text-7xl md:text-9xl font-bold tracking-wider mb-4">
            zerothon
          </h1>
          <p className="text-gray-400 text-lg md:text-xl tracking-widest font-mono">
            PYTHON → EVM SMART CONTRACT DEVELOPMENT
          </p>
        </motion.div>

        {/* Chat Input Box */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="w-full max-w-3xl"
        >
          <div className="relative group">
            {/* Glowing border effect */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-gray-600 via-gray-400 to-gray-600 rounded-lg opacity-30 group-hover:opacity-50 blur transition duration-300" />

            <div className="relative bg-black/80 backdrop-blur-sm border border-gray-600 rounded-lg p-4 shadow-2xl">
              <div className="flex items-start gap-3">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask zerothon AI about smart contracts..."
                  className="flex-1 bg-transparent text-white placeholder-gray-500 outline-none text-lg font-mono"
                  disabled={isLoading}
                />
                <button
                  onClick={handleSend}
                  disabled={isLoading || !message.trim()}
                  className="p-3 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:opacity-50 rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Send className="w-5 h-5 text-gray-300" />
                  )}
                </button>
              </div>

              {/* Quick Action Icons */}
              <div className="flex gap-2 mt-4 pt-4 border-t border-gray-700">
                {quickActions.map((action) => (
                  <button
                    key={action.label}
                    onClick={() => router.push(action.path)}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-800/50 hover:bg-gray-700/50 rounded-md transition-all duration-200 text-sm font-mono text-gray-400 hover:text-gray-200"
                  >
                    <action.icon className="w-4 h-4" />
                    <span>{action.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Bottom Text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-12 text-center"
        >
          <p className="text-gray-500 text-sm font-mono tracking-wider">
            POWERED BY AI AGENTS • MULTI-CHAIN DEPLOYMENT • REAL-TIME COMPILATION
          </p>
        </motion.div>
      </div>

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
              rgba(255, 255, 255, 0.03) 2px,
              rgba(255, 255, 255, 0.03) 4px
            );
          opacity: 0.5;
          animation: vhs-noise 0.2s infinite;
          pointer-events: none;
          z-index: 15;
        }

        @keyframes vhs-noise {
          0%, 100% { 
            transform: translateY(0); 
            opacity: 0.5;
          }
          50% { 
            transform: translateY(2px); 
            opacity: 0.3;
          }
        }

        /* CRT Scanlines */
        .scanlines {
          position: absolute;
          inset: 0;
          background: repeating-linear-gradient(
            0deg,
            rgba(0, 0, 0, 0.15),
            rgba(0, 0, 0, 0.15) 1px,
            transparent 1px,
            transparent 2px
          );
          pointer-events: none;
          z-index: 16;
          animation: scanline-flicker 0.1s infinite;
        }

        @keyframes scanline-flicker {
          0%, 100% { opacity: 0.8; }
          50% { opacity: 0.6; }
        }

        /* Glitch Text Effect */
        .glitch-text {
          position: relative;
          color: #fff;
          text-shadow: 
            2px 0 #ff0000,
            -2px 0 #00ffff,
            0 0 20px rgba(255, 255, 255, 0.5);
          animation: glitch-anim 3s infinite;
        }

        @keyframes glitch-anim {
          0%, 90%, 100% {
            text-shadow: 
              2px 0 #ff0000,
              -2px 0 #00ffff,
              0 0 20px rgba(255, 255, 255, 0.5);
          }
          91% {
            text-shadow: 
              5px 0 #ff0000,
              -5px 0 #00ffff,
              0 0 30px rgba(255, 255, 255, 0.8);
          }
          92% {
            text-shadow: 
              -5px 0 #ff0000,
              5px 0 #00ffff,
              0 0 30px rgba(255, 255, 255, 0.8);
          }
          93% {
            text-shadow: 
              2px 0 #ff0000,
              -2px 0 #00ffff,
              0 0 20px rgba(255, 255, 255, 0.5);
          }
        }

        /* RGB Split Effect */
        .rgb-split {
          position: absolute;
          inset: 0;
          background: 
            radial-gradient(circle at 20% 50%, rgba(255, 0, 0, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 50%, rgba(0, 255, 255, 0.1) 0%, transparent 50%);
          mix-blend-mode: screen;
          animation: rgb-shift 0.5s infinite;
          pointer-events: none;
          z-index: 17;
        }

        @keyframes rgb-shift {
          0%, 100% {
            transform: translate(0);
            opacity: 0.3;
          }
          25% {
            transform: translate(2px, -2px);
            opacity: 0.5;
          }
          50% {
            transform: translate(-2px, 2px);
            opacity: 0.4;
          }
          75% {
            transform: translate(2px, 2px);
            opacity: 0.6;
          }
        }
      `}</style>
    </div>
  )
}
