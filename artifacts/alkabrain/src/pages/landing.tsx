import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Brain, Megaphone, Users, MessageCircle, BarChart3,
  Zap, Shield, TrendingUp, CheckCircle, ArrowRight, Star,
} from "lucide-react";

const features = [
  { icon: Megaphone, title: "Smart Campaigns", desc: "Launch targeted email & WhatsApp campaigns in minutes. Reach the right customers automatically." },
  { icon: Users, title: "Lead Discovery", desc: "Find local business leads by keyword and location. Build your prospect list effortlessly." },
  { icon: MessageCircle, title: "WhatsApp Automation", desc: "Send bulk WhatsApp messages with personalization. Connect with customers where they are." },
  { icon: BarChart3, title: "Analytics Dashboard", desc: "Track opens, clicks, and conversions in real-time. Make data-driven marketing decisions." },
  { icon: Zap, title: "Credits System", desc: "Pay only for what you use. Flexible credit packs for businesses of all sizes." },
  { icon: Shield, title: "Secure & Reliable", desc: "Enterprise-grade security with 99.9% uptime. Your data is always protected." },
];

const plans = [
  { name: "Starter", price: "₹499", credits: "500", popular: false, features: ["500 Credits", "Email Campaigns", "Lead Discovery", "Basic Analytics"] },
  { name: "Growth", price: "₹1,299", credits: "2,000", popular: true, features: ["2,000 Credits", "Email + WhatsApp", "Advanced Analytics", "Priority Support", "Custom Templates"] },
  { name: "Pro", price: "₹2,999", credits: "6,000", popular: false, features: ["6,000 Credits", "All Channels", "API Access", "Dedicated Manager", "White-label"] },
];

const testimonials = [
  { name: "Rahul Sharma", biz: "Sharma Electronics, Delhi", text: "ALKABRAIN helped us get 3x more customers in just 2 months. Amazing tool for local business!", rating: 5 },
  { name: "Priya Patel", biz: "Patel Textiles, Surat", text: "WhatsApp campaigns doubled our festive season sales. Best investment for our shop!", rating: 5 },
  { name: "Amit Kumar", biz: "Kumar Sweets, Mumbai", text: "Very easy to use. Even my staff can run campaigns now. Customer support is excellent.", rating: 5 },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b sticky top-0 bg-white/95 backdrop-blur z-40">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg">ALKABRAIN</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/sign-in">
              <Button variant="ghost" size="sm">Sign In</Button>
            </Link>
            <Link href="/sign-up">
              <Button size="sm">Get Started Free</Button>
            </Link>
          </div>
        </div>
      </header>

      <section className="py-20 px-4 text-center bg-gradient-to-b from-accent to-white">
        <div className="max-w-4xl mx-auto">
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">#1 Marketing Tool for Indian SMBs</Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
            Boost Your Business with
            <span className="text-primary block mt-1">AI-Powered Campaigns</span>
          </h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Send targeted email & WhatsApp campaigns, discover local leads, and grow your small business with ALKABRAIN's Campaign Booster Suite — built for Indian entrepreneurs.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/sign-up">
              <Button size="lg" className="gap-2 px-8">
                Start Free Trial <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/sign-in">
              <Button size="lg" variant="outline" className="px-8">Sign In</Button>
            </Link>
          </div>
          <div className="flex items-center justify-center gap-6 mt-8 text-sm text-muted-foreground">
            <span className="flex items-center gap-1"><CheckCircle className="w-4 h-4 text-green-500" /> No credit card required</span>
            <span className="flex items-center gap-1"><CheckCircle className="w-4 h-4 text-green-500" /> 100 free credits</span>
            <span className="flex items-center gap-1"><CheckCircle className="w-4 h-4 text-green-500" /> Hindi support</span>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">Everything You Need to Grow</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">Powerful tools designed for Indian small and medium businesses to reach more customers and increase sales.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="p-6 rounded-xl border bg-card hover:shadow-md transition-shadow">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">Simple, Affordable Pricing</h2>
            <p className="text-muted-foreground">Start small, scale as you grow. All plans include core features.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <div key={plan.name} className={`p-6 rounded-xl border bg-white ${plan.popular ? "border-primary shadow-lg ring-2 ring-primary/20" : ""}`}>
                {plan.popular && <Badge className="mb-4 bg-primary text-primary-foreground">Most Popular</Badge>}
                <h3 className="text-xl font-bold mb-1">{plan.name}</h3>
                <div className="flex items-end gap-1 mb-1">
                  <span className="text-3xl font-bold text-primary">{plan.price}</span>
                  <span className="text-muted-foreground text-sm mb-1">/month</span>
                </div>
                <p className="text-sm text-muted-foreground mb-5">{plan.credits} credits included</p>
                <ul className="space-y-2 mb-6">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href="/sign-up">
                  <Button className="w-full" variant={plan.popular ? "default" : "outline"}>
                    Get Started
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">Trusted by 10,000+ Indian Businesses</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="p-6 rounded-xl border bg-card">
                <div className="flex gap-1 mb-3">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground mb-4 italic">"{t.text}"</p>
                <div>
                  <p className="font-semibold text-sm">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.biz}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-primary">
        <div className="max-w-3xl mx-auto text-center">
          <TrendingUp className="w-12 h-12 text-white/80 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Boost Your Business?</h2>
          <p className="text-white/80 mb-8">Join thousands of Indian entrepreneurs growing with ALKABRAIN. Start your free trial today.</p>
          <Link href="/sign-up">
            <Button size="lg" variant="secondary" className="gap-2 px-10">
              Start Free — No Credit Card <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>

      <footer className="py-8 px-4 border-t bg-white">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-primary flex items-center justify-center">
              <Brain className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-semibold text-foreground">ALKABRAIN</span>
          </div>
          <p>© 2025 ALKABRAIN. Made with ❤️ for Indian businesses.</p>
        </div>
      </footer>
    </div>
  );
}
