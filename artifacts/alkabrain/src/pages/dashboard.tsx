import { useState, useEffect } from "react";
import { Link } from "wouter";
import { useAuth } from "@/lib/auth";
import { getCampaigns, getLeads, getTemplates, Campaign, Lead } from "@/lib/firestore";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import {
  Megaphone, Users, FileText, MessageCircle, Plus,
  TrendingUp, Send, Clock, CheckCircle2, XCircle, PauseCircle, ArrowRight,
  Zap, CreditCard,
} from "lucide-react";

const statusConfig = {
  draft: { label: "Draft", icon: Clock, color: "bg-gray-100 text-gray-700" },
  running: { label: "Running", icon: TrendingUp, color: "bg-blue-100 text-blue-700" },
  paused: { label: "Paused", icon: PauseCircle, color: "bg-yellow-100 text-yellow-700" },
  completed: { label: "Completed", icon: CheckCircle2, color: "bg-green-100 text-green-700" },
  failed: { label: "Failed", icon: XCircle, color: "bg-red-100 text-red-700" },
};

export default function Dashboard() {
  const { user } = useAuth();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [templates, setTemplates] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      try {
        const [c, l, t] = await Promise.all([
          getCampaigns(user.uid),
          getLeads(user.uid),
          getTemplates(user.uid),
        ]);
        setCampaigns(c);
        setLeads(l);
        setTemplates(t.length);
      } catch {}
      setLoading(false);
    };
    load();
  }, [user]);

  const totalSent = campaigns.reduce((sum, c) => sum + c.sentCount, 0);
  const activeCampaigns = campaigns.filter((c) => c.status === "running").length;

  const stats = [
    { label: "Total Campaigns", value: campaigns.length, icon: Megaphone, color: "text-primary bg-primary/10", link: "/campaigns" },
    { label: "Total Leads", value: leads.length, icon: Users, color: "text-blue-600 bg-blue-100", link: "/leads" },
    { label: "Messages Sent", value: totalSent, icon: Send, color: "text-green-600 bg-green-100", link: "/campaigns" },
    { label: "Templates", value: templates, icon: FileText, color: "text-orange-600 bg-orange-100", link: "/templates" },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">
          Welcome back, {user?.displayName?.split(" ")[0] || "there"} 👋
        </h1>
        <p className="text-muted-foreground text-sm mt-1">Here's an overview of your marketing activity.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(({ label, value, icon: Icon, color, link }) => (
          <Link key={label} href={link}>
            <div className="bg-card rounded-xl border p-4 hover:shadow-md transition-shadow cursor-pointer">
              <div className={`w-9 h-9 rounded-lg ${color} flex items-center justify-center mb-3`}>
                <Icon className="w-4 h-4" />
              </div>
              <p className="text-2xl font-bold">{value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2 bg-card rounded-xl border p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">Recent Campaigns</h2>
            <Link href="/campaigns">
              <Button variant="ghost" size="sm" className="gap-1 text-xs">
                View all <ArrowRight className="w-3 h-3" />
              </Button>
            </Link>
          </div>
          {campaigns.length === 0 ? (
            <div className="text-center py-10">
              <Megaphone className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground mb-4">No campaigns yet. Create your first one!</p>
              <Link href="/campaigns/new">
                <Button size="sm" className="gap-2">
                  <Plus className="w-4 h-4" /> New Campaign
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {campaigns.slice(0, 5).map((c) => {
                const sc = statusConfig[c.status] || statusConfig.draft;
                const StatusIcon = sc.icon;
                return (
                  <div key={c.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Megaphone className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{c.name}</p>
                      <p className="text-xs text-muted-foreground">{c.channel} · {c.sentCount} sent</p>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full flex items-center gap-1 ${sc.color}`}>
                      <StatusIcon className="w-3 h-3" />
                      {sc.label}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="bg-gradient-to-br from-primary to-purple-700 rounded-xl p-5 text-white">
            <Zap className="w-8 h-8 text-white/80 mb-3" />
            <p className="font-bold text-lg">100 Credits</p>
            <p className="text-white/70 text-xs mb-4">Free credits remaining</p>
            <Link href="/billing">
              <Button size="sm" variant="secondary" className="w-full gap-2 text-xs">
                <CreditCard className="w-3.5 h-3.5" /> Buy More Credits
              </Button>
            </Link>
          </div>

          <div className="bg-card rounded-xl border p-5">
            <h3 className="font-semibold text-sm mb-3">Quick Actions</h3>
            <div className="space-y-2">
              <Link href="/campaigns/new">
                <Button variant="outline" size="sm" className="w-full justify-start gap-2 text-xs">
                  <Megaphone className="w-3.5 h-3.5 text-primary" /> New Campaign
                </Button>
              </Link>
              <Link href="/leads">
                <Button variant="outline" size="sm" className="w-full justify-start gap-2 text-xs">
                  <Users className="w-3.5 h-3.5 text-blue-500" /> Add Leads
                </Button>
              </Link>
              <Link href="/templates">
                <Button variant="outline" size="sm" className="w-full justify-start gap-2 text-xs">
                  <FileText className="w-3.5 h-3.5 text-orange-500" /> Create Template
                </Button>
              </Link>
              <Link href="/whatsapp">
                <Button variant="outline" size="sm" className="w-full justify-start gap-2 text-xs">
                  <MessageCircle className="w-3.5 h-3.5 text-green-500" /> WhatsApp Campaign
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {activeCampaigns > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
            <TrendingUp className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-blue-900">{activeCampaigns} campaign{activeCampaigns > 1 ? "s" : ""} currently running</p>
            <p className="text-xs text-blue-700">Your campaigns are active and reaching customers right now.</p>
          </div>
        </div>
      )}
    </div>
  );
}
