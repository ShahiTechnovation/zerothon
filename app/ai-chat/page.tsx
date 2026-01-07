'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, Maximize2, Minimize2, Check, Zap, Crown, Sparkles, Rocket } from 'lucide-react'

export default function AIChatPage() {
  const router = useRouter()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showPricing, setShowPricing] = useState(false)

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
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.font = `${fontSize}px "Courier New", monospace`

      for (let i = 0; i < drops.length; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)]
        const x = i * fontSize
        const y = drops[i] * fontSize

        const opacity = Math.random() * 0.3 + 0.2
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

  const pricingPlans = [
    {
      name: 'Free',
      price: '$0',
      period: '/month',
      description: 'Perfect for getting started',
      icon: Sparkles,
      features: [
        '50 messages per month',
        'Basic smart contract help',
        'Code suggestions',
        'Community support',
        'Standard response time',
        'View generated contracts'
      ],
      buttonText: 'Current Plan',
      buttonStyle: 'bg-gray-700 hover:bg-gray-600 border border-gray-600',
      popular: false
    },
    {
      name: 'Pro',
      price: '$29',
      period: '/month',
      description: 'For serious developers',
      icon: Zap,
      features: [
        'Unlimited messages',
        'Advanced AI assistance',
        'Code generation',
        '🚀 Direct deployment from chat',
        'Multi-chain deployment',
        'Priority support',
        'Fast response time',
        'Custom training',
        'API access'
      ],
      buttonText: 'Upgrade to Pro',
      buttonStyle: 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700',
      popular: true
    },
    {
      name: 'Enterprise',
      price: '$99',
      period: '/month',
      description: 'For teams and organizations',
      icon: Crown,
      features: [
        'Everything in Pro',
        '🚀 One-click deployment',
        'Team collaboration',
        'Dedicated support',
        'Custom integrations',
        'SLA guarantee',
        'Advanced analytics',
        'White-label option',
        'On-premise deployment'
      ],
      buttonText: 'Contact Sales',
      buttonStyle: 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700',
      popular: false
    }
  ]

  return (
    <div className="relative w-full h-screen bg-black text-white overflow-hidden">
      {/* Binary Waterfall Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full opacity-30"
        style={{ zIndex: 1 }}
      />

      {/* VHS Noise Overlay */}
      <div className="vhs-noise" />

      {/* CRT Scanlines */}
      <div className="scanlines" />

      {/* Main Content */}
      <div className="relative z-20 h-full flex flex-col">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between p-6 border-b border-gray-800 bg-black/50 backdrop-blur-sm"
        >
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/')}
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-800/50 backdrop-blur-sm border border-gray-600 rounded-lg flex items-center justify-center p-2">
                <img
                  src="/zerothon-logo.svg"
                  alt="zerothon Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h1 className="glitch-text text-2xl font-bold tracking-wider">
                  zerothon AI
                </h1>
                <p className="text-gray-500 text-sm font-mono">
                  Smart Contract Assistant
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Deploy Button - Shows when contract is detected */}
            <motion.button
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              onClick={() => setShowPricing(true)}
              className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 rounded-lg transition-all duration-200 text-sm font-mono flex items-center gap-2 shadow-lg"
              title="Deploy contract (Premium feature)"
            >
              <Rocket className="w-4 h-4" />
              Deploy Contract
            </motion.button>

            <button
              onClick={() => setShowPricing(!showPricing)}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg transition-all duration-200 text-sm font-mono flex items-center gap-2"
            >
              <Crown className="w-4 h-4" />
              Upgrade
            </button>
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
            >
              {isFullscreen ? (
                <Minimize2 className="w-5 h-5" />
              ) : (
                <Maximize2 className="w-5 h-5" />
              )}
            </button>
          </div>
        </motion.div>

        {/* Pricing Modal */}
        {showPricing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-6 overflow-y-auto"
          >
            <div className="max-w-7xl w-full">
              {/* Close Button */}
              <button
                onClick={() => setShowPricing(false)}
                className="absolute top-6 right-6 p-2 hover:bg-gray-800 rounded-lg transition-colors"
              >
                <span className="text-2xl">×</span>
              </button>

              {/* Pricing Header */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-12"
              >
                <h2 className="glitch-text text-4xl md:text-5xl font-bold mb-4">
                  Upgrade to Deploy
                </h2>
                <p className="text-gray-400 text-lg font-mono mb-2">
                  Deploy smart contracts directly from AI chat
                </p>
                <p className="text-gray-500 text-sm font-mono">
                  Pro and Enterprise plans include one-click deployment to any chain
                </p>
              </motion.div>

              {/* Pricing Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {pricingPlans.map((plan, index) => {
                  const Icon = plan.icon
                  return (
                    <motion.div
                      key={plan.name}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`relative group ${plan.popular ? 'md:scale-105' : ''}`}
                    >
                      {/* Popular Badge */}
                      {plan.popular && (
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full text-xs font-bold">
                          MOST POPULAR
                        </div>
                      )}

                      {/* Glowing Border */}
                      <div className={`absolute -inset-0.5 bg-gradient-to-r ${plan.popular ? 'from-blue-600 via-purple-600 to-pink-600' : 'from-gray-700 to-gray-600'} rounded-lg opacity-30 group-hover:opacity-50 blur transition duration-300`} />

                      {/* Card Content */}
                      <div className="relative bg-black/90 backdrop-blur-sm border border-gray-700 rounded-lg p-8">
                        {/* Icon */}
                        <div className="w-12 h-12 bg-gray-800/50 rounded-lg flex items-center justify-center mb-4">
                          <Icon className="w-6 h-6 text-gray-400" />
                        </div>

                        {/* Plan Name */}
                        <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                        <p className="text-gray-500 text-sm mb-6">{plan.description}</p>

                        {/* Price */}
                        <div className="mb-6">
                          <span className="text-4xl font-bold">{plan.price}</span>
                          <span className="text-gray-500">{plan.period}</span>
                        </div>

                        {/* Features */}
                        <ul className="space-y-3 mb-8">
                          {plan.features.map((feature) => (
                            <li key={feature} className="flex items-start gap-3">
                              <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                              <span className="text-gray-300 text-sm">{feature}</span>
                            </li>
                          ))}
                        </ul>

                        {/* Button */}
                        <button className={`w-full py-3 rounded-lg font-medium transition-all duration-200 ${plan.buttonStyle}`}>
                          {plan.buttonText}
                        </button>
                      </div>
                    </motion.div>
                  )
                })}
              </div>

              {/* Bottom Info */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-center mt-12"
              >
                <p className="text-gray-500 text-sm font-mono">
                  All plans include 14-day money-back guarantee • Cancel anytime
                </p>
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* Chat Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className={`flex-1 ${isFullscreen ? 'p-0' : 'p-6'}`}
        >
          <div className="h-full max-w-6xl mx-auto">
            {/* Glowing border effect */}
            <div className="relative h-full group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-gray-700 via-gray-500 to-gray-700 rounded-lg opacity-20 group-hover:opacity-30 blur transition duration-300" />

              <div className="relative h-full bg-black/80 backdrop-blur-sm border border-gray-700 rounded-lg overflow-hidden shadow-2xl">
                {/* Chatbase Help Page - ChatGPT Style */}
                <iframe
                  src="https://www.chatbase.co/NvAPH2KZUE58uo14cOsIj/help"
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  className="w-full h-full"
                  style={{
                    border: 'none',
                    background: '#000'
                  }}
                  title="zerothon AI Assistant"
                  allow="clipboard-write"
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Footer Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="p-4 border-t border-gray-800 bg-black/50 backdrop-blur-sm"
        >
          <p className="text-center text-gray-600 text-xs font-mono">
            zerothon AI • POWERED BY CHATBASE • REAL-TIME SMART CONTRACT ASSISTANCE
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
              rgba(255, 255, 255, 0.02) 2px,
              rgba(255, 255, 255, 0.02) 4px
            );
          opacity: 0.3;
          animation: vhs-noise 0.2s infinite;
          pointer-events: none;
          z-index: 15;
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
          z-index: 16;
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
          z-index: 17;
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
