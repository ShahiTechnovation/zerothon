import { Footer } from "@/components/footer"
import { BottomDockMenu } from "@/components/bottom-dock-menu"
import { DocsContentNew } from "@/components/docs-content-new"

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-background">
      <BottomDockMenu />
      <div className="pt-20 pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <DocsContentNew />
        </div>
      </div>
      <Footer />
    </div>
  )
}
