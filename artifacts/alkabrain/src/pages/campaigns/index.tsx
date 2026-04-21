import { useState, useEffect } from "react";
import { Link } from "wouter";
import { useAuth } from "@/lib/auth";
import { getCampaigns, deleteCampaign, Campaign } from "@/lib/firestore";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { Input } from "@/components/ui/input";
import {
  Plus, Search, Megaphone, Trash2, Play, Pause,
  Clock, TrendingUp, CheckCircle2, XCircle, PauseCircle, MoreHorizontal,
} from "lucide-react";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { updateCampaign } from "@/lib/firestore";

const statusConfig: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  draft: { label: "Draft", color: "bg-gray-100 text-gray-700", icon: Clock },
  running: { label: "Running", color: "bg-blue-100 text-blue-700", icon: TrendingUp },
  paused: { label: "Paused", color: "bg-yellow-100 text-yellow-700", icon: PauseCircle },
  completed: { label: "Completed", color: "bg-green-100 text-green-700", icon: CheckCircle2 },
  failed: { label: "Failed", color: "bg-red-100 text-red-700", icon: XCircle },
};

const channelConfig: Record<string, { label: string; color: string }> = {
  email: { label: "Email", color: "bg-blue-50 text-blue-600" },
  whatsapp: { label: "WhatsApp", color: "bg-green-50 text-green-600" },
  both: { label: "Email + WA", color: "bg-purple-50 text-purple-600" },
};

export default function Campaigns() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!user) return;
    getCampaigns(user.uid).then((c) => { setCampaigns(c); setLoading(false); }).catch(() => setLoading(false));
  }, [user]);

  const filtered = campaigns.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    try {
      await deleteCampaign(id);
      setCampaigns((prev) => prev.filter((c) => c.id !== id));
      toast({ title: "Campaign deleted" });
    } catch {
      toast({ title: "Failed to delete", variant: "destructive" });
    }
  };

  const handleToggle = async (campaign: Campaign) => {
    const newStatus = campaign.status === "running" ? "paused" : "running";
    try {
      await updateCampaign(campaign.id, { status: newStatus });
      setCampaigns((prev) => prev.map((c) => c.id === campaign.id ? { ...c, status: newStatus } : c));
    } catch {
      toast({ title: "Failed to update", variant: "destructive" });
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Campaigns</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage and track all your marketing campaigns.</p>
        </div>
        <Link href="/campaigns/new">
          <Button className="gap-2">
            <Plus className="w-4 h-4" /> New Campaign
          </Button>
        </Link>
      </div>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search campaigns..."
          className="pl-10"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Spinner size="lg" /></div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16">
          <Megaphone className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">{search ? "No campaigns found" : "No campaigns yet"}</h3>
          <p className="text-sm text-muted-foreground mb-6">
            {search ? "Try a different search term." : "Create your first campaign to start reaching customers."}
          </p>
          {!search && (
            <Link href="/campaigns/new">
              <Button className="gap-2"><Plus className="w-4 h-4" /> Create First Campaign</Button>
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((c) => {
            const sc = statusConfig[c.status] || statusConfig.draft;
            const cc = channelConfig[c.channel] || channelConfig.email;
            const StatusIcon = sc.icon;
            return (
              <div key={c.id} className="bg-card border rounded-xl p-4 hover:shadow-sm transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Megaphone className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h3 className="font-semibold text-sm">{c.name}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full flex items-center gap-1 ${sc.color}`}>
                        <StatusIcon className="w-3 h-3" />{sc.label}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${cc.color}`}>{cc.label}</span>
                    </div>
                    {c.description && <p className="text-xs text-muted-foreground mb-2 line-clamp-1">{c.description}</p>}
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>{c.totalLeads} leads</span>
                      <span>{c.sentCount} sent</span>
                      <span>{c.creditsUsed} credits used</span>
                      {c.targetLocation && <span>📍 {c.targetLocation}</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {(c.status === "running" || c.status === "draft" || c.status === "paused") && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="gap-1.5 text-xs h-8"
                        onClick={() => handleToggle(c)}
                      >
                        {c.status === "running" ? (
                          <><Pause className="w-3 h-3" /> Pause</>
                        ) : (
                          <><Play className="w-3 h-3" /> Run</>
                        )}
                      </Button>
                    )}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          className="text-destructive gap-2"
                          onClick={() => handleDelete(c.id)}
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
