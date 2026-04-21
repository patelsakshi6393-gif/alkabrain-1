import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/lib/auth";
import { createCampaign } from "@/lib/firestore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft, Megaphone, Mail, MessageCircle, Layers,
  MapPin, Tag, Wand2,
} from "lucide-react";
import { cn } from "@/lib/utils";

const channels = [
  { value: "email", label: "Email", icon: Mail, desc: "Send professional emails to your leads", cost: "1 credit/email" },
  { value: "whatsapp", label: "WhatsApp", icon: MessageCircle, desc: "Send messages via WhatsApp Business", cost: "2 credits/msg" },
  { value: "both", label: "Both Channels", icon: Layers, desc: "Reach via email and WhatsApp", cost: "3 credits/lead" },
] as const;

export default function NewCampaign() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
    channel: "email" as "email" | "whatsapp" | "both",
    targetLocation: "",
    targetKeyword: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    try {
      await createCampaign({
        userId: user.uid,
        name: form.name,
        description: form.description,
        channel: form.channel,
        status: "draft",
        targetLocation: form.targetLocation,
        targetKeyword: form.targetKeyword,
        totalLeads: 0,
        sentCount: 0,
        creditsUsed: 0,
      });
      toast({ title: "Campaign created!", description: "Your campaign is ready. Click Run to launch it." });
      navigate("/campaigns");
    } catch (err: unknown) {
      toast({ title: "Failed to create campaign", description: (err as { message?: string })?.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="mb-6">
        <button
          onClick={() => navigate("/campaigns")}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Campaigns
        </button>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Megaphone className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold">New Campaign</h1>
            <p className="text-sm text-muted-foreground">Set up your marketing campaign</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-card border rounded-xl p-5 space-y-4">
          <h2 className="font-semibold text-sm flex items-center gap-2">
            <Wand2 className="w-4 h-4 text-primary" /> Campaign Details
          </h2>

          <div>
            <Label htmlFor="name" className="text-sm font-medium mb-1.5 block">Campaign Name *</Label>
            <Input
              id="name"
              placeholder="e.g., Diwali Offer Campaign"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="description" className="text-sm font-medium mb-1.5 block">Description</Label>
            <Textarea
              id="description"
              placeholder="What's this campaign about? Who is your target audience?"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
            />
          </div>
        </div>

        <div className="bg-card border rounded-xl p-5">
          <h2 className="font-semibold text-sm mb-4">Choose Channel *</h2>
          <div className="space-y-3">
            {channels.map(({ value, label, icon: Icon, desc, cost }) => (
              <button
                key={value}
                type="button"
                onClick={() => setForm({ ...form, channel: value })}
                className={cn(
                  "w-full flex items-center gap-4 p-4 rounded-lg border-2 transition-all text-left",
                  form.channel === value
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/40 hover:bg-muted/30"
                )}
              >
                <div className={cn(
                  "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0",
                  form.channel === value ? "bg-primary/20" : "bg-muted"
                )}>
                  <Icon className={cn("w-5 h-5", form.channel === value ? "text-primary" : "text-muted-foreground")} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm">{label}</p>
                  <p className="text-xs text-muted-foreground">{desc}</p>
                </div>
                <span className="text-xs bg-muted px-2 py-1 rounded-full text-muted-foreground flex-shrink-0">{cost}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-card border rounded-xl p-5 space-y-4">
          <h2 className="font-semibold text-sm flex items-center gap-2">
            <MapPin className="w-4 h-4 text-primary" /> Lead Targeting (Optional)
          </h2>
          <p className="text-xs text-muted-foreground">We'll discover leads matching these criteria for your campaign.</p>

          <div>
            <Label htmlFor="location" className="text-sm font-medium mb-1.5 block">
              <MapPin className="w-3.5 h-3.5 inline mr-1" /> Target Location
            </Label>
            <Input
              id="location"
              placeholder="e.g., Mumbai, Delhi, Surat, Pune"
              value={form.targetLocation}
              onChange={(e) => setForm({ ...form, targetLocation: e.target.value })}
            />
          </div>

          <div>
            <Label htmlFor="keyword" className="text-sm font-medium mb-1.5 block">
              <Tag className="w-3.5 h-3.5 inline mr-1" /> Business Type / Keyword
            </Label>
            <Input
              id="keyword"
              placeholder="e.g., restaurants, mobile shops, clothing stores"
              value={form.targetKeyword}
              onChange={(e) => setForm({ ...form, targetKeyword: e.target.value })}
            />
          </div>
        </div>

        <div className="flex gap-3">
          <Button type="button" variant="outline" className="flex-1" onClick={() => navigate("/campaigns")}>
            Cancel
          </Button>
          <Button type="submit" className="flex-1 gap-2" disabled={loading}>
            <Megaphone className="w-4 h-4" />
            {loading ? "Creating..." : "Create Campaign"}
          </Button>
        </div>
      </form>
    </div>
  );
}
