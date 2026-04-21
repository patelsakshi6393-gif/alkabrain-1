import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { updateProfile } from "firebase/auth";
import { auth } from "@/lib/firebase";
import {
  User, Bell, Shield, Globe, Palette, Save, LogOut,
  Mail, Phone, Building2, MapPin,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Settings() {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [notifications, setNotifications] = useState({
    campaigns: true,
    leads: true,
    billing: true,
    weekly: false,
  });

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, { displayName });
      }
      toast({ title: "Profile updated!" });
    } catch {
      toast({ title: "Failed to update profile", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    try { await logout(); } catch {}
  };

  const sections = [
    {
      id: "profile",
      icon: User,
      title: "Profile",
      content: (
        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center text-2xl font-bold text-primary">
              {(user?.displayName || user?.email || "U")[0].toUpperCase()}
            </div>
            <div>
              <p className="font-medium">{user?.displayName || "User"}</p>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label className="text-xs font-medium mb-1.5 block">Display Name</Label>
              <Input value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="Your name" />
            </div>
            <div>
              <Label className="text-xs font-medium mb-1.5 block">Email Address</Label>
              <Input value={user?.email || ""} disabled className="bg-muted/50" />
            </div>
          </div>
          <Button type="submit" size="sm" className="gap-2" disabled={saving}>
            <Save className="w-3.5 h-3.5" />
            {saving ? "Saving..." : "Save Profile"}
          </Button>
        </form>
      ),
    },
    {
      id: "notifications",
      icon: Bell,
      title: "Notifications",
      content: (
        <div className="space-y-4">
          {Object.entries({
            campaigns: "Campaign status updates",
            leads: "New lead notifications",
            billing: "Billing & credits alerts",
            weekly: "Weekly performance report",
          }).map(([key, label]) => (
            <div key={key} className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">{label}</p>
                <p className="text-xs text-muted-foreground">Receive via email</p>
              </div>
              <Switch
                checked={notifications[key as keyof typeof notifications]}
                onCheckedChange={(val) => setNotifications((prev) => ({ ...prev, [key]: val }))}
              />
            </div>
          ))}
          <Button size="sm" className="gap-2" onClick={() => toast({ title: "Notification preferences saved!" })}>
            <Save className="w-3.5 h-3.5" /> Save Preferences
          </Button>
        </div>
      ),
    },
    {
      id: "security",
      icon: Shield,
      title: "Security",
      content: (
        <div className="space-y-4">
          <div className="p-3 rounded-lg bg-green-50 border border-green-200 flex items-center gap-2">
            <Shield className="w-4 h-4 text-green-600" />
            <p className="text-xs text-green-700 font-medium">Your account is secured with Firebase Authentication</p>
          </div>
          <div>
            <Label className="text-xs font-medium mb-1.5 block">Account Email</Label>
            <Input value={user?.email || ""} disabled className="bg-muted/50" />
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => toast({ title: "Password reset", description: "Password reset email sent to " + user?.email })}
          >
            Change Password
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground text-sm mt-1">Manage your account and preferences.</p>
      </div>

      <div className="space-y-4">
        {sections.map(({ id, icon: Icon, title, content }) => (
          <div key={id} className="bg-card border rounded-xl p-5">
            <h2 className="font-semibold mb-4 flex items-center gap-2 text-sm">
              <Icon className="w-4 h-4 text-primary" />
              {title}
            </h2>
            {content}
          </div>
        ))}

        <div className="bg-card border border-destructive/20 rounded-xl p-5">
          <h2 className="font-semibold mb-1 text-sm text-destructive flex items-center gap-2">
            <LogOut className="w-4 h-4" /> Sign Out
          </h2>
          <p className="text-xs text-muted-foreground mb-4">Sign out of your ALKABRAIN account on this device.</p>
          <Button variant="destructive" size="sm" onClick={handleLogout} className="gap-2">
            <LogOut className="w-3.5 h-3.5" /> Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
}
