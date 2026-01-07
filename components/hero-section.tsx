"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { PromptInputBox } from "@/components/ui/ai-prompt-box"
import Orb from "@/components/ui/Orb"

export function HeroSection() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [orbHue, setOrbHue] = useState(220)

  const handleAIInput = (message: string, files?: File[]) => {
    setIsLoading(true)
    setTimeout(() => {
      router.push(`/ai-chat?prompt=${encodeURIComponent(message)}`)
      setIsLoading(false)
    }, 300)
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  }

  return (
    <div className="relative w-full bg-black/90 text-white overflow-hidden">
      {/* Orb Background */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="absolute inset-0 z-0"
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div style={{ width: '100%', height: '100vh', position: 'relative' }}>
            <Orb
              hoverIntensity={0.5}
              rotateOnHover={true}
              hue={orbHue}
              forceHoverState={false}
            />
          </div>
        </div>
      </motion.div>

      {/* Main content */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 h-screen flex flex-col items-center justify-center">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full flex flex-col items-center text-center max-w-4xl mx-auto"
        >
          {/* PyVax heading */}
          <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6">
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              zerothon
            </span>
          </motion.h1>

          {/* AI Input Box */}
          <motion.div variants={itemVariants} className="max-w-2xl mx-auto w-full mt-12">
            <PromptInputBox
              onSend={handleAIInput}
              isLoading={isLoading}
              placeholder="Ask zerothon AI anything about smart contracts..."
              className="w-full"
            />
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce z-20">
        <div className="w-6 h-10 border-2 border-blue-400 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-blue-400 rounded-full mt-2 animate-pulse" />
        </div>
      </div>
    </div>
  )
}
