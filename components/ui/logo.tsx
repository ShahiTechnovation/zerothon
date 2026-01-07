import Image from 'next/image'
import { cn } from '@/lib/utils'

interface LogoProps {
  size?: number
  className?: string
  showText?: boolean
}

export function Logo({ size = 40, className, showText = true }: LogoProps) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className="relative" style={{ width: size, height: size }}>
        <Image
          src="/zerothon-logo.svg"
          alt="zerothon Logo"
          width={size}
          height={size}
          className="rounded-lg"
          priority
        />
      </div>
      {showText && (
        <span className="font-mono font-bold text-xl gradient-text whitespace-nowrap">
          zerothon
        </span>
      )}
    </div>
  )
}
