import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CreditCard, Zap, CheckCircle, TrendingUp, Package, Receipt,
  Mail, MessageCircle, Users, Star,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const plans = [
  {
    id: "starter",
    name: "Starter",
    price: 499,
    credits: 500,
    popular: false,
    features: [
      "500 Credits",
      "Email Campaigns",
      "Lead Discovery (50/month)",
      "Basic Analytics",
      "Email Support",
    ],
  },
  {
    id: "growth",
    name: "Growth",
    price: 1299,
    credits: 2000,
    popular: true,
    features: [
      "2,000 Credits",
      "Email + WhatsApp Campaigns",
      "Lead Discovery (200/month)",
      "Advanced Analytics",
      "Priority Support",
      "Custom Templates",
      "Campaign Scheduling",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    price: 2999,
    credits: 6000,
    popular: false,
    features: [
      "6,000 Credits",
      "All Channels",
      "Unlimited Lead Discovery",
      "Full Analytics Suite",
      "Dedicated Account Manager",
      "API Access",
      "White-label Reports",
      "Custom Integrations",
    ],
  },
];

const creditUsage = [
  { icon: Mail, label: "Email send", cost: "1 credit" },
  { icon: MessageCircle, label: "WhatsApp message", cost: "2 credits" },
  { icon: Users, label: "Lead discovery (per lead)", cost: "1 credit" },
  { icon: TrendingUp, label: "Campaign analytics", cost: "Free" },
];

export default function Billing() {
  const { toast } = useToast();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const handlePurchase = (planId: string) => {
    setSelectedPlan(planId);
    toast({
      title: "Payment gateway coming soon!",
      description: "We're integrating Razorpay for easy UPI & card payments. You'll be notified when it's ready.",
    });
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Billing & Credits</h1>
        <p className="text-muted-foreground text-sm mt-1">Choose a plan that fits your business needs.</p>
      </div>

      <div className="bg-gradient-to-r from-primary to-purple-700 rounded-2xl p-6 mb-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white/70 text-sm mb-1">Current Balance</p>
            <div className="flex items-end gap-2">
              <p className="text-4xl font-bold">100</p>
              <p className="text-white/80 mb-1">credits remaining</p>
            </div>
            <p className="text-white/60 text-xs mt-1">Free starter credits · No expiry</p>
          </div>
          <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center">
            <Zap className="w-8 h-8 text-white" />
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4">Choose Your Plan</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`bg-card rounded-2xl border-2 p-5 relative ${plan.popular ? "border-primary shadow-lg" : "border-border"}`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-primary text-white gap-1 px-3">
                    <Star className="w-3 h-3 fill-current" /> Most Popular
                  </Badge>
                </div>
              )}
              <div className="mb-4">
                <h3 className="font-bold text-lg">{plan.name}</h3>
                <div className="flex items-end gap-1 mt-1">
                  <span className="text-3xl font-bold text-primary">₹{plan.price.toLocaleString()}</span>
                  <span className="text-muted-foreground text-sm mb-1">/month</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">{plan.credits.toLocaleString()} credits per month</p>
              </div>

              <ul className="space-y-2 mb-5">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <Button
                className="w-full"
                variant={plan.popular ? "default" : "outline"}
                onClick={() => handlePurchase(plan.id)}
              >
                {plan.popular ? "Get Growth Plan" : `Get ${plan.name}`}
              </Button>
            </div>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-card border rounded-xl p-5">
          <h2 className="font-semibold mb-4 flex items-center gap-2">
            <Package className="w-4 h-4 text-primary" /> Credit Usage Guide
          </h2>
          <div className="space-y-3">
            {creditUsage.map(({ icon: Icon, label, cost }) => (
              <div key={label} className="flex items-center justify-between py-2 border-b last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Icon className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-sm">{label}</span>
                </div>
                <span className={`text-sm font-medium ${cost === "Free" ? "text-green-600" : "text-foreground"}`}>
                  {cost}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card border rounded-xl p-5">
          <h2 className="font-semibold mb-4 flex items-center gap-2">
            <Receipt className="w-4 h-4 text-primary" /> Payment Methods
          </h2>
          <div className="space-y-3">
            <div className="p-3 rounded-lg bg-muted/50 flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-orange-100 flex items-center justify-center text-lg">₹</div>
              <div>
                <p className="text-sm font-medium">UPI</p>
                <p className="text-xs text-muted-foreground">Google Pay, PhonePe, Paytm, BHIM</p>
              </div>
            </div>
            <div className="p-3 rounded-lg bg-muted/50 flex items-center gap-3">
              <CreditCard className="w-8 h-8 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Credit / Debit Card</p>
                <p className="text-xs text-muted-foreground">Visa, Mastercard, RuPay</p>
              </div>
            </div>
            <div className="p-3 rounded-lg bg-muted/50 flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-blue-100 flex items-center justify-center text-xs font-bold text-blue-700">NB</div>
              <div>
                <p className="text-sm font-medium">Net Banking</p>
                <p className="text-xs text-muted-foreground">All major Indian banks supported</p>
              </div>
            </div>
          </div>
          <div className="mt-4 p-3 rounded-lg bg-primary/5 border border-primary/20">
            <p className="text-xs text-primary font-medium">🔒 Powered by Razorpay — 100% secure payments</p>
          </div>
        </div>
      </div>
    </div>
  );
}
