import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { useGetMe, useGetGmailIntegration, useGetWhatsappStatus, useGetSubscription } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import {
  User, Mail, Calendar, Zap, Bell, Shield, Settings2, MessageSquare,
  Crown, ExternalLink, CheckCircle2, AlertTriangle, Globe, Moon, Sun,
  Download, RefreshCw, ChevronRight, Monitor, Copy
} from "lucide-react";

type Theme = "light" | "dark" | "system";

function getTheme(): Theme {
  return (localStorage.getItem("lf-theme") as Theme) || "system";
}

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  if (theme === "dark") {
    root.classList.add("dark");
  } else if (theme === "light") {
    root.classList.remove("dark");
  } else {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (prefersDark) root.classList.add("dark");
    else root.classList.remove("dark");
  }
  localStorage.setItem("lf-theme", theme);
}

function getNotifPref(key: string, def: boolean): boolean {
  const val = localStorage.getItem(`lf-notif-${key}`);
  if (val === null) return def;
  return val === "true";
}

function setNotifPref(key: string, val: boolean) {
  localStorage.setItem(`lf-notif-${key}`, String(val));
}

export default function Settings() {
  const { user: firebaseUser, loading } = useAuth();
  const { data: profile, isLoading } = useGetMe();
  const { data: gmail } = useGetGmailIntegration();
  const { data: waStatus } = useGetWhatsappStatus();
  const { data: subscription } = useGetSubscription();
  const { toast } = useToast();

  const [theme, setTheme] = useState<Theme>(getTheme);
  const [emailNotifs, setEmailNotifs] = useState(() => getNotifPref("email", true));
  const [campaignAlerts, setCampaignAlerts] = useState(() => getNotifPref("campaign", true));
  const [creditAlerts, setCreditAlerts] = useState(() => getNotifPref("credits", true));
  const [marketingEmails, setMarketingEmails] = useState(() => getNotifPref("marketing", false));

  useEffect(() => { applyTheme(theme); }, []);

  const handleThemeChange = (t: Theme) => {
    setTheme(t);
    applyTheme(t);
    toast({ title: `Theme changed to ${t}` });
  };

  const handleNotifChange = (key: string, setter: (v: boolean) => void, label: string) => (v: boolean) => {
    setter(v);
    setNotifPref(key, v);
    toast({ title: `${label} ${v ? "enabled" : "disabled"}` });
  };

  const handleExportData = () => {
    const data = {
      profile: {
        name: profile?.name,
        email: profile?.email,
        memberSince: profile?.createdAt,
        creditsRemaining: profile?.creditsRemaining,
        plan: profile?.planName,
        planExpiresAt: profile?.planExpiresAt,
      },
      integrations: {
        gmail: gmail?.isConnected ? { email: gmail.senderEmail, connected: true } : { connected: false },
        whatsapp: waStatus?.isConnected ? { phone: waStatus.phone, connected: true } : { connected: false },
      },
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "alkabrain-account-export.json"; a.click();
    URL.revokeObjectURL(url);
    toast({ title: "Data exported! Check your downloads." });
  };

  const handleCopyUserId = () => {
    if (firebaseUser?.uid) {
      navigator.clipboard.writeText(firebaseUser.uid);
      toast({ title: "User ID copied!" });
    }
  };

  const infoLoading = loading || isLoading;
  const displayName = firebaseUser?.displayName || firebaseUser?.email?.split("@")[0] || "User";
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your account, preferences, and integrations</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <User className="h-4 w-4 text-primary" />
            Profile Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          {infoLoading ? (
            <div className="space-y-3"><Skeleton className="h-14 w-full" /><Skeleton className="h-10 w-full" /></div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                {firebaseUser?.photoURL ? (
                  <img src={firebaseUser.photoURL} alt="Avatar" className="w-14 h-14 rounded-full border-2 border-primary/20 object-cover" />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl border-2 border-primary/20">
                    {initial}
                  </div>
                )}
                <div>
                  <p className="font-semibold text-lg">{displayName}</p>
                  <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                    <Mail className="h-3.5 w-3.5" />{firebaseUser?.email}
                  </p>
                </div>
              </div>
              <Separator />
              {[
                { label: "Plan", value: profile?.planName || subscription?.planName || "Free", icon: Crown },
                { label: "Credits Left", value: profile?.creditsRemaining?.toLocaleString("en-IN") ?? "—", icon: Zap },
                { label: "Member Since", value: firebaseUser?.metadata?.creationTime ? new Date(firebaseUser.metadata.creationTime).toLocaleDateString("en-IN", { month: "long", year: "numeric" }) : "—", icon: Calendar },
              ].map(row => (
                <div key={row.label} className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground flex items-center gap-1.5"><row.icon className="h-3.5 w-3.5" />{row.label}</span>
                  <Badge variant="outline">{row.value}</Badge>
                </div>
              ))}
              <div className="flex items-center justify-between text-sm pt-1">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <Shield className="h-3.5 w-3.5" />User ID
                </span>
                <Button variant="ghost" size="sm" onClick={handleCopyUserId} className="h-6 text-xs gap-1 text-muted-foreground">
                  <Copy className="h-3 w-3" />{firebaseUser?.uid?.slice(0, 12)}...
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Monitor className="h-4 w-4 text-primary" />
            Theme Preferences
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-3">
            {([
              { id: "light", label: "Light", icon: Sun, desc: "Always light" },
              { id: "dark", label: "Dark", icon: Moon, desc: "Always dark" },
              { id: "system", label: "System", icon: Monitor, desc: "Follow OS" },
            ] as { id: Theme; label: string; icon: any; desc: string }[]).map(t => (
              <button key={t.id} onClick={() => handleThemeChange(t.id)}
                className={`flex flex-col items-center gap-1 p-3 rounded-lg border-2 transition-colors ${theme === t.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"}`}>
                <t.icon className={`h-5 w-5 ${theme === t.id ? "text-primary" : "text-muted-foreground"}`} />
                <span className={`text-sm font-medium ${theme === t.id ? "text-primary" : "text-foreground"}`}>{t.label}</span>
                <span className="text-xs text-muted-foreground">{t.desc}</span>
                {theme === t.id && <CheckCircle2 className="h-3.5 w-3.5 text-primary" />}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Bell className="h-4 w-4 text-primary" />
            Notification Preferences
          </CardTitle>
          <CardDescription>These preferences are saved locally on your device</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {([
            { key: "email", label: "Email Notifications", description: "Receive updates about your account via email", state: emailNotifs, setter: setEmailNotifs },
            { key: "campaign", label: "Campaign Status Alerts", description: "Get notified when a campaign completes or fails", state: campaignAlerts, setter: setCampaignAlerts },
            { key: "credits", label: "Low Credits Alert", description: "Warn me when credits drop below 10", state: creditAlerts, setter: setCreditAlerts },
            { key: "marketing", label: "Product Updates", description: "News about new features and improvements", state: marketingEmails, setter: setMarketingEmails },
          ]).map(({ key, label, description, state, setter }) => (
            <div key={key} className="flex items-center justify-between py-1">
              <div>
                <Label htmlFor={`notif-${key}`} className="font-medium cursor-pointer">{label}</Label>
                <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
              </div>
              <Switch id={`notif-${key}`} checked={state} onCheckedChange={handleNotifChange(key, setter, label)} />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Globe className="h-4 w-4 text-primary" />
            Language & Region
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            { label: "Language", value: "English (India)", desc: "App display language" },
            { label: "Currency", value: "INR (₹)", desc: "Used for billing display" },
            { label: "Timezone", value: "IST (UTC+5:30)", desc: "Campaign schedule timezone" },
            { label: "Date Format", value: "DD/MM/YYYY", desc: "Date display format" },
          ].map(row => (
            <div key={row.label} className="flex items-center justify-between">
              <div><p className="font-medium text-sm">{row.label}</p><p className="text-xs text-muted-foreground">{row.desc}</p></div>
              <Badge variant="outline">{row.value}</Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Download className="h-4 w-4 text-primary" />
            Data & Privacy
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-1">
          <div className="flex items-center justify-between py-1">
            <div><p className="font-medium text-sm text-foreground">Export Your Data</p><p className="text-xs text-muted-foreground">Download your account data as a JSON file</p></div>
            <Button variant="outline" size="sm" onClick={handleExportData} className="text-xs h-7">
              <Download className="h-3 w-3 mr-1" />Export
            </Button>
          </div>
          <Separator />
          <div className="flex items-center justify-between py-1">
            <div><p className="font-medium text-sm">Privacy Policy</p><p className="text-xs text-muted-foreground">How we handle your data</p></div>
            <Link href="/privacy"><Button variant="ghost" size="sm" className="text-xs h-7 text-primary">Read <ExternalLink className="h-3 w-3 ml-1" /></Button></Link>
          </div>
          <Separator />
          <div className="flex items-center justify-between py-1">
            <div><p className="font-medium text-sm">Terms of Service</p><p className="text-xs text-muted-foreground">Rules for using ALKABRAIN</p></div>
            <Link href="/terms"><Button variant="ghost" size="sm" className="text-xs h-7 text-primary">Read <ExternalLink className="h-3 w-3 ml-1" /></Button></Link>
          </div>
        </CardContent>
      </Card>

      <Card className="border-red-200 dark:border-red-900">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-4 w-4" />
            Danger Zone
          </CardTitle>
          <CardDescription>These actions cannot be undone — proceed carefully</CardDescription>
        </CardHeader>
        <CardContent className="space-y-1">
          <div className="flex items-center justify-between py-1">
            <div><p className="font-medium text-sm text-foreground">Reset All Integrations</p><p className="text-xs text-muted-foreground">Disconnect Gmail and WhatsApp from your account</p></div>
            <Button variant="outline" size="sm" className="text-xs h-7 border-red-200 text-red-600 hover:bg-red-50"
              onClick={() => toast({ title: "To reset integrations, go to the Integrations page.", variant: "destructive" })}>
              <RefreshCw className="h-3 w-3 mr-1" />Reset
            </Button>
          </div>
          <Separator />
          <div className="flex items-center justify-between py-1">
            <div><p className="font-medium text-sm text-foreground">Delete Account</p><p className="text-xs text-muted-foreground">Permanently deletes all your data. Cannot be undone.</p></div>
            <Button variant="destructive" size="sm" className="text-xs h-7"
              onClick={() => toast({ title: "Contact support to delete your account", description: "Email us at support@alkabrain.in", variant: "destructive" })}>
              Delete Account
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
