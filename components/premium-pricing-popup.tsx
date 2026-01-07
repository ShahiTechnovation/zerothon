"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Check, Crown, Rocket } from "lucide-react"

interface PremiumPricingPopupProps {
  isOpen: boolean
  onClose: () => void
  feature?: string
}

export function PremiumPricingPopup({ isOpen, onClose, feature = "deployment" }: PremiumPricingPopupProps) {
  const [selectedPlan, setSelectedPlan] = useState<"monthly" | "yearly">("monthly")

  const plans = {
    monthly: {
      price: "$29",
      period: "/month",
      yearlyPrice: null,
    },
    yearly: {
      price: "$290",
      period: "/year",
      yearlyPrice: "$24.17/month",
      savings: "Save 17%",
    },
  }

  const features = [
    "Native Python Contract Deployment",
    "Advanced AST Parser & Optimization",
    "Real-time Gas Estimation",
    "Multi-network Deployment (Avalanche, Ethereum)",
    "Contract Verification & Auditing",
    "Priority Support & Documentation",
    "Custom Template Library",
    "Team Collaboration Tools",
  ]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-gradient-to-br from-background via-background to-accent/5 border-2 border-primary/20">
        <DialogHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
            <Crown className="w-8 h-8 text-white" />
          </div>
          <DialogTitle className="text-2xl font-bold gradient-text">Unlock Premium Features</DialogTitle>
          <p className="text-muted-foreground">
            {feature === "deployment"
              ? "Deploy your Python smart contracts natively with our premium deployment engine"
              : "Access advanced PyVax AI features and tools"}
          </p>
        </DialogHeader>

        <div className="space-y-6">
          {/* Plan Toggle */}
          <div className="flex items-center justify-center space-x-4">
            <Button
              variant={selectedPlan === "monthly" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedPlan("monthly")}
              className={selectedPlan === "monthly" ? "gradient-primary text-white" : ""}
            >
              Monthly
            </Button>
            <Button
              variant={selectedPlan === "yearly" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedPlan("yearly")}
              className={selectedPlan === "yearly" ? "gradient-primary text-white" : ""}
            >
              Yearly
              {plans.yearly.savings && (
                <Badge variant="secondary" className="ml-2 text-xs">
                  {plans.yearly.savings}
                </Badge>
              )}
            </Button>
          </div>

          {/* Pricing Card */}
          <div className="bg-card/50 border border-border/50 rounded-lg p-6 text-center">
            <div className="space-y-2">
              <div className="text-4xl font-bold gradient-text">{plans[selectedPlan].price}</div>
              <div className="text-muted-foreground">
                {plans[selectedPlan].period}
                {plans[selectedPlan].yearlyPrice && <div className="text-sm">({plans[selectedPlan].yearlyPrice})</div>}
              </div>
            </div>
          </div>

          {/* Features List */}
          <div className="space-y-3">
            <h4 className="font-semibold text-center">What's included:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-2 text-sm">
                  <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button className="flex-1 gradient-primary text-white font-medium" size="lg">
              <Rocket className="w-4 h-4 mr-2" />
              Upgrade to Premium
            </Button>
            <Button variant="outline" size="lg" onClick={onClose} className="flex-1 bg-transparent">
              Maybe Later
            </Button>
          </div>

          <p className="text-xs text-muted-foreground text-center">
            30-day money-back guarantee • Cancel anytime • Secure payment
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
