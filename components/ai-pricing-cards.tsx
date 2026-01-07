import { Check, Sparkles, Crown } from "lucide-react"
import { Button } from "@/components/ui/button"

export function AiPricingCards() {
  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      description: "Perfect for getting started with PyVax AI",
      features: [
        "5 AI generations per day",
        "Basic code optimization",
        "Community support",
        "Standard compilation speed",
      ],
      buttonText: "Get Started",
      buttonVariant: "outline" as const,
      popular: false,
    },
    {
      name: "Pro",
      price: "$29",
      period: "per month",
      description: "For serious developers and small teams",
      features: [
        "Unlimited AI generations",
        "Advanced code optimization",
        "Priority support",
        "Fast compilation",
        "Security analysis",
        "Version control integration",
      ],
      buttonText: "Start Free Trial",
      buttonVariant: "default" as const,
      popular: true,
    },
    {
      name: "Enterprise",
      price: "$99",
      period: "per month",
      description: "For large teams and organizations",
      features: [
        "Everything in Pro",
        "Custom AI model training",
        "Dedicated support",
        "SLA guarantees",
        "Advanced analytics",
        "Team collaboration tools",
        "Custom integrations",
      ],
      buttonText: "Contact Sales",
      buttonVariant: "outline" as const,
      popular: false,
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {plans.map((plan, index) => (
        <div
          key={index}
          className={`relative bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl p-8 border transition-all duration-300 ${
            plan.popular
              ? "border-blue-500 scale-105 shadow-2xl shadow-blue-500/20"
              : "border-slate-700 hover:border-slate-600"
          }`}
        >
          {plan.popular && (
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <div className="bg-gradient-to-r from-blue-500 to-red-500 text-white px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Most Popular
              </div>
            </div>
          )}

          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              {plan.name === "Enterprise" && <Crown className="w-6 h-6 text-yellow-500 mr-2" />}
              <h3 className="text-2xl font-mono font-bold text-white">{plan.name}</h3>
            </div>

            <div className="mb-4">
              <span className="text-4xl font-mono font-bold text-white">{plan.price}</span>
              <span className="text-slate-400 ml-2">/{plan.period}</span>
            </div>

            <p className="text-slate-400 text-sm">{plan.description}</p>
          </div>

          <ul className="space-y-4 mb-8">
            {plan.features.map((feature, featureIndex) => (
              <li key={featureIndex} className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <span className="text-slate-300 text-sm">{feature}</span>
              </li>
            ))}
          </ul>

          <Button
            className={`w-full py-3 font-medium ${
              plan.popular
                ? "bg-gradient-to-r from-blue-500 to-red-500 hover:from-blue-600 hover:to-red-600 text-white"
                : "border border-slate-600 hover:border-blue-500 text-slate-300 hover:text-white bg-transparent"
            }`}
            variant={plan.buttonVariant}
          >
            {plan.buttonText}
          </Button>
        </div>
      ))}
    </div>
  )
}
