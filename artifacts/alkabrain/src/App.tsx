import { Switch, Route, Router as WouterRouter, Redirect } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/lib/auth";
import LandingPage from "@/pages/landing";
import SignIn from "@/pages/sign-in";
import SignUp from "@/pages/sign-up";
import Dashboard from "@/pages/dashboard";
import Campaigns from "@/pages/campaigns/index";
import NewCampaign from "@/pages/campaigns/new";
import Leads from "@/pages/leads";
import Templates from "@/pages/templates";
import WhatsApp from "@/pages/whatsapp";
import Billing from "@/pages/billing";
import Settings from "@/pages/settings";
import AppLayout from "@/layouts/app-layout";
import NotFound from "@/pages/not-found";
import { Spinner } from "@/components/ui/spinner";

const queryClient = new QueryClient();

function ProtectedRoute({ component: Component }: { component: React.ComponentType }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="flex items-center justify-center min-h-screen"><Spinner size="lg" /></div>;
  if (!user) return <Redirect to="/sign-in" />;
  return <AppLayout><Component /></AppLayout>;
}

function PublicOnlyRoute({ component: Component }: { component: React.ComponentType }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="flex items-center justify-center min-h-screen"><Spinner size="lg" /></div>;
  if (user) return <Redirect to="/dashboard" />;
  return <Component />;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={LandingPage} />
      <Route path="/sign-in">
        <PublicOnlyRoute component={SignIn} />
      </Route>
      <Route path="/sign-up">
        <PublicOnlyRoute component={SignUp} />
      </Route>
      <Route path="/dashboard">
        <ProtectedRoute component={Dashboard} />
      </Route>
      <Route path="/campaigns">
        <ProtectedRoute component={Campaigns} />
      </Route>
      <Route path="/campaigns/new">
        <ProtectedRoute component={NewCampaign} />
      </Route>
      <Route path="/leads">
        <ProtectedRoute component={Leads} />
      </Route>
      <Route path="/templates">
        <ProtectedRoute component={Templates} />
      </Route>
      <Route path="/whatsapp">
        <ProtectedRoute component={WhatsApp} />
      </Route>
      <Route path="/billing">
        <ProtectedRoute component={Billing} />
      </Route>
      <Route path="/settings">
        <ProtectedRoute component={Settings} />
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router />
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
