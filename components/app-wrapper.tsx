'use client'

import { useState, useEffect, ReactNode } from 'react'
import { IntroScreen } from './intro-screen'

interface AppWrapperProps {
  children: ReactNode
}

export function AppWrapper({ children }: AppWrapperProps) {
  const [showIntro, setShowIntro] = useState(true)
  const [hasSeenIntro, setHasSeenIntro] = useState(false)

  // Check if user has already seen the intro in this session
  useEffect(() => {
    const seen = sessionStorage.getItem('zerothon-intro-seen')
    if (seen === 'true') {
      setShowIntro(false)
      setHasSeenIntro(true)
    }
  }, [])

  const handleIntroComplete = () => {
    sessionStorage.setItem('zerothon-intro-seen', 'true')
    setShowIntro(false)
    setHasSeenIntro(true)
  }

  return (
    <>
      {/* Intro Screen */}
      {showIntro && <IntroScreen onComplete={handleIntroComplete} />}

      {/* Main Content */}
      {!showIntro && children}
    </>
  )
}
