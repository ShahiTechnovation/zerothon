import { Footer } from "@/components/footer"
import { GlitchHeroSection } from "@/components/glitch-hero-section"
import { BottomDockMenu } from "@/components/bottom-dock-menu"

export default function HomePage() {
  return (
    <div className="relative min-h-screen bg-black">
      <BottomDockMenu />
      <main className="relative z-10">
        <GlitchHeroSection />
      </main>
      <Footer />
    </div>
  )
}
