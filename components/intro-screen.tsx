'use client'

import { useState, useEffect, useRef } from 'react'

interface IntroScreenProps {
  onComplete: () => void
}

export function IntroScreen({ onComplete }: IntroScreenProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [startVisible, setStartVisible] = useState(false)
  const [canProceed, setCanProceed] = useState(false)
  const startTimeRef = useRef<number>(Date.now())

  // Binary waterfall effect
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // Binary rain configuration
    const fontSize = 14
    const columns = Math.floor(canvas.width / fontSize)
    const drops: number[] = Array(columns).fill(1).map(() => Math.random() * -100)
    const speeds: number[] = Array(columns).fill(1).map(() => Math.random() * 2 + 1)
    const chars = '01'

    // Animation loop
    const draw = () => {
      // Create trailing effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.08)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Set text style with varying opacity for depth
      ctx.font = `${fontSize}px "Courier New", monospace`

      // Draw characters
      for (let i = 0; i < drops.length; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)]
        const x = i * fontSize
        const y = drops[i] * fontSize

        // Varying shades of gray for waterfall effect
        const opacity = Math.random() * 0.5 + 0.5
        ctx.fillStyle = `rgba(${150 + Math.random() * 105}, ${150 + Math.random() * 105}, ${150 + Math.random() * 105}, ${opacity})`

        ctx.fillText(char, x, y)

        // Reset drop to top when it goes off screen
        if (y > canvas.height && Math.random() > 0.95) {
          drops[i] = 0
          speeds[i] = Math.random() * 2 + 1
        }

        drops[i] += speeds[i]
      }
    }

    const interval = setInterval(draw, 33) // ~30fps

    // Fade in the start button
    const timer = setTimeout(() => {
      setStartVisible(true)
    }, 2000)

    // Enable proceed after 2 seconds minimum
    const proceedTimer = setTimeout(() => {
      setCanProceed(true)
    }, 2000)

    return () => {
      clearInterval(interval)
      clearTimeout(timer)
      clearTimeout(proceedTimer)
      window.removeEventListener('resize', resizeCanvas)
    }
  }, [])

  const handleEnter = () => {
    if (!canProceed) {
      // If not enough time has passed, wait for remaining time
      const elapsed = Date.now() - startTimeRef.current
      const remaining = Math.max(0, 2000 - elapsed)

      setTimeout(() => {
        onComplete()
      }, remaining)
    } else {
      onComplete()
    }
  }

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden bg-black z-50">
      {/* Binary Waterfall Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ zIndex: 5 }}
      />

      {/* VHS Noise Overlay */}
      <div className="vhs-noise" />

      {/* CRT Scanlines */}
      <div className="scanlines" />

      {/* YouTube Video Background */}
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden" style={{ zIndex: 1 }}>
        <div className="video-container">
          <div className="youtube-wrapper">
            <iframe
              className="youtube-video"
              src="https://www.youtube.com/embed/KhtZoJUG6HM?autoplay=1&mute=1&loop=1&playlist=KhtZoJUG6HM&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1&enablejsapi=1&start=0&iv_load_policy=3&disablekb=1"
              title="ZEROTHON Loading"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              loading="eager"
            />
          </div>

          {/* Glitch layers for datamosh effect */}
          <div className="youtube-wrapper glitch-layer-1">
            <iframe
              className="youtube-video"
              src="https://www.youtube.com/embed/KhtZoJUG6HM?autoplay=1&mute=1&loop=1&playlist=KhtZoJUG6HM&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1&enablejsapi=1&start=0&iv_load_policy=3&disablekb=1"
              title="ZEROTHON Loading Glitch 1"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              loading="eager"
            />
          </div>

          <div className="youtube-wrapper glitch-layer-2">
            <iframe
              className="youtube-video"
              src="https://www.youtube.com/embed/KhtZoJUG6HM?autoplay=1&mute=1&loop=1&playlist=KhtZoJUG6HM&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1&enablejsapi=1&start=0&iv_load_policy=3&disablekb=1"
              title="ZEROTHON Loading Glitch 2"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              loading="eager"
            />
          </div>
        </div>
      </div>

      {/* RGB Split Overlay for extra corruption */}
      <div className="rgb-split" />

      {/* Enter Button */}
      <button
        onClick={handleEnter}
        className={`
          absolute left-1/2 bottom-8 -translate-x-1/2 z-20
          text-white text-xl tracking-[0.2em] uppercase font-extralight
          transition-all duration-700 px-8 py-3 border border-white/50 rounded-sm
          hover:tracking-[0.3em] hover:border-white/80 hover:bg-white/10
          font-mono
          ${startVisible ? 'opacity-100' : 'opacity-0'}
        `}
        style={{
          textShadow: '2px 0 #ff0000, -2px 0 #00ffff',
          filter: 'contrast(1.2)',
        }}
      >
        ENTER SYSTEM
      </button>

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

        /* Video Container */
        .video-container {
          position: relative;
          width: 100%;
          height: 100%;
          animation: signal-flicker 0.15s infinite, shake 0.2s infinite;
          filter: grayscale(100%) contrast(1.3);
        }

        @keyframes signal-flicker {
          0%, 100% { 
            opacity: 1;
            filter: grayscale(100%) contrast(1.3) brightness(1);
          }
          10% { 
            opacity: 0.85;
            filter: grayscale(100%) contrast(1.5) brightness(1.2);
          }
          20% { 
            opacity: 1;
            filter: grayscale(100%) contrast(1.1) brightness(0.9);
          }
          30% { 
            opacity: 0.9;
            filter: grayscale(100%) contrast(1.4) brightness(1.1);
          }
          50% { 
            opacity: 1;
            filter: grayscale(100%) contrast(1.3) brightness(1);
          }
          75% { 
            opacity: 0.95;
            filter: grayscale(100%) contrast(1.2) brightness(0.95);
          }
        }

        @keyframes shake {
          0%, 100% { transform: translate(0, 0); }
          10% { transform: translate(-2px, 1px); }
          20% { transform: translate(2px, -1px); }
          30% { transform: translate(-1px, 2px); }
          40% { transform: translate(1px, -2px); }
          50% { transform: translate(-2px, -1px); }
          60% { transform: translate(2px, 1px); }
          70% { transform: translate(-1px, -2px); }
          80% { transform: translate(1px, 2px); }
          90% { transform: translate(-2px, -2px); }
        }

        /* YouTube Wrapper */
        .youtube-wrapper {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
        }

        .youtube-video {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 100vw;
          height: 100vh;
          transform: translate(-50%, -50%);
          pointer-events: none;
          border: none;
        }

        /* Scale video to cover screen */
        @media (min-aspect-ratio: 16/9) {
          .youtube-video {
            height: 56.25vw;
          }
        }
        @media (max-aspect-ratio: 16/9) {
          .youtube-video {
            width: 177.78vh;
          }
        }

        .glitch-layer-1,
        .glitch-layer-2 {
          mix-blend-mode: screen;
        }

        .glitch-layer-1 {
          animation: glitch-anim-1 0.3s infinite;
          opacity: 0.8;
          filter: grayscale(100%) contrast(1.4) hue-rotate(90deg);
        }

        .glitch-layer-2 {
          animation: glitch-anim-2 0.4s infinite;
          opacity: 0.6;
          filter: grayscale(100%) contrast(1.4) hue-rotate(180deg);
        }

        @keyframes glitch-anim-1 {
          0%, 100% {
            transform: translate(0);
            clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
          }
          10% {
            transform: translate(-5px, 3px);
            clip-path: polygon(0 0, 100% 0, 100% 25%, 0 25%);
          }
          20% {
            transform: translate(5px, -3px);
            clip-path: polygon(0 25%, 100% 25%, 100% 50%, 0 50%);
          }
          30% {
            transform: translate(-3px, 5px);
            clip-path: polygon(0 50%, 100% 50%, 100% 75%, 0 75%);
          }
          40% {
            transform: translate(3px, -5px);
            clip-path: polygon(0 75%, 100% 75%, 100% 100%, 0 100%);
          }
          50% {
            transform: translate(-5px, -3px);
            clip-path: polygon(0 0, 100% 0, 100% 33%, 0 33%);
          }
        }

        @keyframes glitch-anim-2 {
          0%, 100% {
            transform: translate(0);
            clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
          }
          15% {
            transform: translate(4px, -4px);
            clip-path: polygon(0 20%, 100% 20%, 100% 40%, 0 40%);
          }
          25% {
            transform: translate(-4px, 4px);
            clip-path: polygon(0 40%, 100% 40%, 100% 60%, 0 60%);
          }
          35% {
            transform: translate(4px, 4px);
            clip-path: polygon(0 60%, 100% 60%, 100% 80%, 0 80%);
          }
          45% {
            transform: translate(-4px, -4px);
            clip-path: polygon(0 0%, 100% 0%, 100% 20%, 0 20%);
          }
          55% {
            transform: translate(3px, 3px);
            clip-path: polygon(0 80%, 100% 80%, 100% 100%, 0 100%);
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

        /* Grain texture overlay */
        .video-container::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='6.5' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
          opacity: 0.15;
          mix-blend-mode: overlay;
          pointer-events: none;
          animation: grain 0.2s infinite;
          z-index: 10;
        }

        @keyframes grain {
          0%, 100% { transform: translate(0, 0); }
          10% { transform: translate(-5%, -5%); }
          20% { transform: translate(5%, 5%); }
          30% { transform: translate(-5%, 5%); }
          40% { transform: translate(5%, -5%); }
          50% { transform: translate(-5%, 0); }
          60% { transform: translate(5%, 0); }
          70% { transform: translate(0, -5%); }
          80% { transform: translate(0, 5%); }
          90% { transform: translate(-5%, -5%); }
        }

        @media (max-width: 768px) {
          .video-container {
            width: 100%;
            height: 100%;
          }
        }
      `}</style>
    </div>
  )
}
