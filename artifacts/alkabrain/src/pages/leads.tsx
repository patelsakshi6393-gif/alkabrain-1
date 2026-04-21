import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { getLeads, createLead, deleteLead, Lead } from "@/lib/firestore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import {
  Users, Plus, Search, Trash2, Mail, Phone, Building2,
  MapPin, Globe, X,
} from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

const statusColors: Record<string, string> = {
  new: "bg-blue-100 text-blue-700",
  contacted: "bg-yellow-100 text-yellow-700",
  converted: "bg-green-100 text-green-700",
  lost: "bg-red-100 text-red-700",
};

export default function Leads() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", business: "", location: "", website: "" });

  useEffect(() => {
    if (!user) return;
    getLeads(user.uid).then((l) => { setLeads(l); setLoading(false); }).catch(() => setLoading(false));
  }, [user]);

  const filtered = leads.filter((l) =>
    [l.name, l.email, l.business, l.location].some((v) => v?.toLowerCase().includes(search.toLowerCase()))
  );

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setAddLoading(true);
    try {
      const lead = await createLead({ userId: user.uid, status: "new", ...form });
      setLeads((prev) => [lead, ...prev]);
      setShowAdd(false);
      setForm({ name: "", email: "", phone: "", business: "", location: "", website: "" });
      toast({ title: "Lead added!" });
    } catch {
      toast({ title: "Failed to add lead", variant: "destructive" });
    } finally {
      setAddLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteLead(id);
      setLeads((prev) => prev.filter((l) => l.id !== id));
      toast({ title: "Lead deleted" });
    } catch {
      toast({ title: "Failed to delete", variant: "destructive" });
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Leads</h1>
          <p className="text-muted-foreground text-sm mt-1">{leads.length} leads in your database</p>
        </div>
        <Button className="gap-2" onClick={() => setShowAdd(true)}>
          <Plus className="w-4 h-4" /> Add Lead
        </Button>
      </div>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search by name, email, business..."
          className="pl-10"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Spinner size="lg" /></div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16">
          <Users className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">{search ? "No leads found" : "No leads yet"}</h3>
          <p className="text-sm text-muted-foreground mb-6">
            {search ? "Try a different search." : "Add your first lead manually or via campaigns."}
          </p>
          {!search && (
            <Button className="gap-2" onClick={() => setShowAdd(true)}>
              <Plus className="w-4 h-4" /> Add First Lead
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((l) => (
            <div key={l.id} className="bg-card border rounded-xl p-4 hover:shadow-sm transition-shadow">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-sm font-semibold text-primary">
                    {(l.name || l.business || l.email || "?")[0].toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    {l.name && <span className="font-medium text-sm">{l.name}</span>}
                    {l.business && <span className="text-xs text-muted-foreground">· {l.business}</span>}
                    <span className={`text-xs px-2 py-0.5 rounded-full ${statusColors[l.status] || statusColors.new}`}>
                      {l.status}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                    {l.email && <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{l.email}</span>}
                    {l.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{l.phone}</span>}
                    {l.location && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{l.location}</span>}
                    {l.website && <span className="flex items-center gap-1"><Globe className="w-3 h-3" />{l.website}</span>}
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive flex-shrink-0"
                  onClick={() => handleDelete(l.id)}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Lead</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAdd} className="space-y-4 mt-2">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs font-medium mb-1.5 block">Name</Label>
                <Input placeholder="Rahul Sharma" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div>
                <Label className="text-xs font-medium mb-1.5 block">Business</Label>
                <Input placeholder="Sharma Electronics" value={form.business} onChange={(e) => setForm({ ...form, business: e.target.value })} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs font-medium mb-1.5 block">Email</Label>
                <Input type="email" placeholder="rahul@example.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </div>
              <div>
                <Label className="text-xs font-medium mb-1.5 block">Phone</Label>
                <Input type="tel" placeholder="+91 98765 43210" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs font-medium mb-1.5 block">Location</Label>
                <Input placeholder="Mumbai, Maharashtra" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
              </div>
              <div>
                <Label className="text-xs font-medium mb-1.5 block">Website</Label>
                <Input placeholder="www.example.com" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowAdd(false)}>Cancel</Button>
              <Button type="submit" disabled={addLoading}>{addLoading ? "Adding..." : "Add Lead"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
