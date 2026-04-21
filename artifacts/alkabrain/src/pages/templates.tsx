import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { getTemplates, createTemplate, deleteTemplate, Template } from "@/lib/firestore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Spinner } from "@/components/ui/spinner";
import { FileText, Plus, Trash2, Search, Mail, MessageCircle, Layers } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const channelConfig: Record<string, { label: string; icon: React.ElementType; color: string }> = {
  email: { label: "Email", icon: Mail, color: "bg-blue-50 text-blue-600" },
  whatsapp: { label: "WhatsApp", icon: MessageCircle, color: "bg-green-50 text-green-600" },
  both: { label: "Both", icon: Layers, color: "bg-purple-50 text-purple-600" },
};

const defaultTemplates = [
  { name: "Welcome Offer", channel: "email" as const, subject: "Special Welcome Offer Just for You! 🎉", body: "Dear {name},\n\nWelcome! We are excited to offer you a special discount on your first purchase.\n\nUse code WELCOME20 to get 20% off.\n\nVisit us today!\n\nBest regards,\n{business_name}" },
  { name: "Festival Greetings", channel: "whatsapp" as const, body: "🙏 Namaste {name}!\n\nWishing you and your family a very Happy Diwali! 🪔✨\n\nThis festive season, enjoy 30% off on all our products.\n\nOffer valid till {date}.\n\nClick here to shop: {link}\n\n- {business_name}" },
];

export default function Templates() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [form, setForm] = useState({ name: "", subject: "", body: "", channel: "email" as "email" | "whatsapp" | "both" });

  useEffect(() => {
    if (!user) return;
    getTemplates(user.uid).then((t) => { setTemplates(t); setLoading(false); }).catch(() => setLoading(false));
  }, [user]);

  const filtered = templates.filter((t) =>
    t.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setAddLoading(true);
    try {
      const t = await createTemplate({ userId: user.uid, ...form });
      setTemplates((prev) => [t, ...prev]);
      setShowAdd(false);
      setForm({ name: "", subject: "", body: "", channel: "email" });
      toast({ title: "Template created!" });
    } catch {
      toast({ title: "Failed to create template", variant: "destructive" });
    } finally {
      setAddLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteTemplate(id);
      setTemplates((prev) => prev.filter((t) => t.id !== id));
      toast({ title: "Template deleted" });
    } catch {
      toast({ title: "Failed to delete", variant: "destructive" });
    }
  };

  const useDefaultTemplate = (dt: typeof defaultTemplates[0]) => {
    setForm({ name: dt.name, subject: dt.subject || "", body: dt.body, channel: dt.channel });
    setShowAdd(true);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Templates</h1>
          <p className="text-muted-foreground text-sm mt-1">Create and manage your message templates.</p>
        </div>
        <Button className="gap-2" onClick={() => setShowAdd(true)}>
          <Plus className="w-4 h-4" /> New Template
        </Button>
      </div>

      {templates.length === 0 && !loading && (
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-muted-foreground mb-3">STARTER TEMPLATES</h2>
          <div className="grid md:grid-cols-2 gap-3">
            {defaultTemplates.map((dt) => {
              const cc = channelConfig[dt.channel];
              const ChIcon = cc.icon;
              return (
                <div key={dt.name} className="bg-card border rounded-xl p-4 hover:shadow-sm transition-shadow">
                  <div className="flex items-start gap-3 mb-3">
                    <div className={`px-2 py-0.5 rounded-full text-xs flex items-center gap-1 ${cc.color}`}>
                      <ChIcon className="w-3 h-3" />{cc.label}
                    </div>
                  </div>
                  <h3 className="font-medium text-sm mb-1">{dt.name}</h3>
                  {dt.subject && <p className="text-xs text-muted-foreground mb-2">Subject: {dt.subject}</p>}
                  <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{dt.body}</p>
                  <Button size="sm" variant="outline" className="w-full text-xs" onClick={() => useDefaultTemplate(dt)}>
                    Use This Template
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="Search templates..." className="pl-10" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Spinner size="lg" /></div>
      ) : filtered.length === 0 && templates.length > 0 ? (
        <div className="text-center py-12 text-muted-foreground">No templates found for "{search}"</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
          <p className="text-sm text-muted-foreground">Create your first template to reuse in campaigns.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-3">
          {filtered.map((t) => {
            const cc = channelConfig[t.channel] || channelConfig.email;
            const ChIcon = cc.icon;
            return (
              <div key={t.id} className="bg-card border rounded-xl p-4 hover:shadow-sm transition-shadow">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <h3 className="font-medium text-sm">{t.name}</h3>
                    {t.subject && <p className="text-xs text-muted-foreground mt-0.5">Subject: {t.subject}</p>}
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className={`px-2 py-0.5 rounded-full text-xs flex items-center gap-1 ${cc.color}`}>
                      <ChIcon className="w-3 h-3" />{cc.label}
                    </span>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
                      onClick={() => handleDelete(t.id)}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-3 font-mono bg-muted/50 rounded p-2">{t.body}</p>
              </div>
            );
          })}
        </div>
      )}

      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Create Template</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAdd} className="space-y-4 mt-2">
            <div>
              <Label className="text-xs font-medium mb-1.5 block">Template Name *</Label>
              <Input placeholder="e.g., Diwali Offer 2025" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div>
              <Label className="text-xs font-medium mb-2 block">Channel</Label>
              <div className="flex gap-2">
                {(["email", "whatsapp", "both"] as const).map((ch) => {
                  const cc = channelConfig[ch];
                  const ChIcon = cc.icon;
                  return (
                    <button
                      key={ch}
                      type="button"
                      onClick={() => setForm({ ...form, channel: ch })}
                      className={cn(
                        "flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg border text-xs font-medium transition-all",
                        form.channel === ch ? "border-primary bg-primary/5 text-primary" : "border-border text-muted-foreground hover:border-primary/40"
                      )}
                    >
                      <ChIcon className="w-3.5 h-3.5" />{cc.label}
                    </button>
                  );
                })}
              </div>
            </div>
            {form.channel === "email" || form.channel === "both" ? (
              <div>
                <Label className="text-xs font-medium mb-1.5 block">Email Subject</Label>
                <Input placeholder="e.g., Special Diwali Offer Just for You! 🎉" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} />
              </div>
            ) : null}
            <div>
              <Label className="text-xs font-medium mb-1.5 block">Message Body *</Label>
              <Textarea
                placeholder="Use {name}, {business_name}, {date}, {link} as placeholders"
                value={form.body}
                onChange={(e) => setForm({ ...form, body: e.target.value })}
                rows={5}
                required
              />
              <p className="text-xs text-muted-foreground mt-1">Use {"{ }"}  variables: {"{name}"}, {"{business_name}"}, {"{date}"}, {"{link}"}</p>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowAdd(false)}>Cancel</Button>
              <Button type="submit" disabled={addLoading}>{addLoading ? "Saving..." : "Save Template"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
