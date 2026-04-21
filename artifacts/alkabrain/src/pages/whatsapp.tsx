import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  MessageCircle, Send, Users, Zap, CheckCircle, AlertCircle,
  Phone, Upload, FileText, ArrowRight, Info,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const steps = [
  { n: 1, title: "Connect WhatsApp", desc: "Link your WhatsApp Business number to send campaigns." },
  { n: 2, title: "Add Your Leads", desc: "Upload contacts or use leads from your database." },
  { n: 3, title: "Create Message", desc: "Write your campaign message with personalization." },
  { n: 4, title: "Launch Campaign", desc: "Schedule or send immediately to all your contacts." },
];

const features = [
  { icon: Users, title: "Bulk Messaging", desc: "Send to 1000+ contacts at once with personalization" },
  { icon: FileText, title: "Rich Media", desc: "Send images, PDFs, and documents with messages" },
  { icon: Zap, title: "Auto Follow-ups", desc: "Automated follow-up messages for better engagement" },
  { icon: CheckCircle, title: "Delivery Reports", desc: "Real-time delivery and read receipt tracking" },
];

export default function WhatsApp() {
  const { toast } = useToast();
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [connected] = useState(false);

  const handleSendTest = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    await new Promise((r) => setTimeout(r, 1500));
    setSending(false);
    toast({
      title: "WhatsApp integration coming soon!",
      description: "We're working on direct WhatsApp Business API integration. You'll be notified when it's ready.",
    });
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
            <MessageCircle className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">WhatsApp Campaigns</h1>
            <p className="text-muted-foreground text-sm">Reach customers directly on WhatsApp Business</p>
          </div>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3 mb-6">
        <Info className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-amber-900">WhatsApp Business API Integration</p>
          <p className="text-xs text-amber-700 mt-1">
            Full WhatsApp Business API integration is coming soon! You can use WhatsApp channel in your campaigns now — they'll be queued and sent once the integration is complete.
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="bg-card border rounded-xl p-5">
          <h2 className="font-semibold mb-4 flex items-center gap-2">
            <Phone className="w-4 h-4 text-green-500" /> How It Works
          </h2>
          <div className="space-y-4">
            {steps.map(({ n, title, desc }) => (
              <div key={n} className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-xs font-bold flex-shrink-0">
                  {n}
                </div>
                <div>
                  <p className="text-sm font-medium">{title}</p>
                  <p className="text-xs text-muted-foreground">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-card border rounded-xl p-5">
            <h2 className="font-semibold mb-1 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-orange-500" /> Connection Status
            </h2>
            <p className="text-xs text-muted-foreground mb-3">Link your WhatsApp Business account</p>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 mb-3">
              <div className={`w-2.5 h-2.5 rounded-full ${connected ? "bg-green-500" : "bg-gray-300"}`} />
              <span className="text-sm">{connected ? "Connected" : "Not connected"}</span>
            </div>
            <Button variant="outline" className="w-full gap-2" onClick={() => toast({ title: "Coming soon!", description: "WhatsApp Business API setup will be available soon." })}>
              <MessageCircle className="w-4 h-4 text-green-500" />
              Connect WhatsApp Business
            </Button>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-xl p-4">
            <h3 className="text-sm font-semibold text-green-900 mb-2">WhatsApp Campaign via ALKABRAIN</h3>
            <p className="text-xs text-green-700 mb-3">
              Create a campaign with WhatsApp channel to reach customers. Credits: 2 per message.
            </p>
            <Link href="/campaigns/new">
              <Button size="sm" className="gap-2 bg-green-600 hover:bg-green-700 w-full">
                <MessageCircle className="w-3.5 h-3.5" /> Create WhatsApp Campaign <ArrowRight className="w-3 h-3" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {features.map(({ icon: Icon, title, desc }) => (
          <div key={title} className="bg-card border rounded-xl p-4">
            <div className="w-9 h-9 rounded-lg bg-green-100 flex items-center justify-center mb-3">
              <Icon className="w-4 h-4 text-green-600" />
            </div>
            <p className="text-sm font-semibold mb-1">{title}</p>
            <p className="text-xs text-muted-foreground">{desc}</p>
          </div>
        ))}
      </div>

      <div className="bg-card border rounded-xl p-5">
        <h2 className="font-semibold mb-4">Send Test Message</h2>
        <form onSubmit={handleSendTest} className="space-y-4">
          <div>
            <Label className="text-xs font-medium mb-1.5 block">Phone Number (with country code)</Label>
            <Input
              type="tel"
              placeholder="+91 98765 43210"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>
          <div>
            <Label className="text-xs font-medium mb-1.5 block">Message</Label>
            <Textarea
              placeholder="Hello {name}, great offer from our store!"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
              required
            />
          </div>
          <Button type="submit" className="gap-2 bg-green-600 hover:bg-green-700" disabled={sending}>
            <Send className="w-4 h-4" />
            {sending ? "Sending..." : "Send Test Message"}
          </Button>
        </form>
      </div>
    </div>
  );
}
