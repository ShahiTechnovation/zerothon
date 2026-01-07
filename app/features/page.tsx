import { Footer } from "@/components/footer"
import { BottomDockMenu } from "@/components/bottom-dock-menu"
import { FeaturesContentNew } from "@/components/features-content-new"

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-background">
      <BottomDockMenu />
      <div className="pt-20 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FeaturesContentNew />
        </div>
      </div>
      <Footer />
    </div>
  )
}
