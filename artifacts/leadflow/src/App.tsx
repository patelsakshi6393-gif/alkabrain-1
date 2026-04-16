import { Switch, Route, Router as WouterRouter, Redirect } from 'wouter';
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";

import Home from "@/pages/home";
import Pricing from "@/pages/pricing";
import Terms from "@/pages/terms";
import Privacy from "@/pages/privacy";

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

// Public-only app when no Clerk key is set (static / GitHub Pages deploy)
function PublicApp() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/pricing" component={Pricing} />
          <Route path="/terms" component={Terms} />
          <Route path="/privacy" component={Privacy} />
          <Route path="/sign-in" component={() => <Redirect to="/" />} />
          <Route path="/sign-up" component={() => <Redirect to="/" />} />
          <Route path="/dashboard" component={() => <Redirect to="/" />} />
          <Route component={NotFound} />
        </Switch>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

// Full app with Clerk loaded lazily
function FullApp() {
  const { ClerkProvider, SignIn, SignUp, Show, useClerk } = require('@clerk/react');
  const { useEffect, useRef } = require('react');
  const { useLocation, useQueryClient: _uqc } = require('@tanstack/react-query');
  const { useQueryClient } = require('@tanstack/react-query');

  const Dashboard = require("@/pages/dashboard").default;
  const Campaigns = require("@/pages/campaigns/index").default;
  const NewCampaign = require("@/pages/campaigns/new").default;
  const CampaignDetail = require("@/pages/campaigns/[id]").default;
  const Templates = require("@/pages/templates/index").default;
  const Leads = require("@/pages/leads/index").default;
  const Integrations = require("@/pages/integrations/index").default;
  const Billing = require("@/pages/billing/index").default;
  const Settings = require("@/pages/settings/index").default;
  const AppLayout = require("@/components/layout/app-layout").default;

  function stripBase(path: string): string {
    return basePath && path.startsWith(basePath)
      ? path.slice(basePath.length) || "/"
      : path;
  }

  function ProtectedRoute({ component: Component, ...rest }: any) {
    return (
      <Route {...rest}>
        <Show when="signed-in">
          <AppLayout><Component /></AppLayout>
        </Show>
        <Show when="signed-out">
          <Redirect to="/sign-in" />
        </Show>
      </Route>
    );
  }

  const [, setLocation] = require('wouter').useLocation();

  return (
    <ClerkProvider
      publishableKey={clerkPubKey}
      routerPush={(to: string) => setLocation(stripBase(to))}
      routerReplace={(to: string) => setLocation(stripBase(to), { replace: true })}
    >
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Switch>
            <Route path="/" component={Home} />
            <Route path="/sign-in/*?" component={() => (
              <div className="min-h-screen flex items-center justify-center">
                <SignIn routing="path" path={`${basePath}/sign-in`} />
              </div>
            )} />
            <Route path="/sign-up/*?" component={() => (
              <div className="min-h-screen flex items-center justify-center">
                <SignUp routing="path" path={`${basePath}/sign-up`} />
              </div>
            )} />
            <Route path="/pricing" component={Pricing} />
            <Route path="/terms" component={Terms} />
            <Route path="/privacy" component={Privacy} />
            <ProtectedRoute path="/dashboard" component={Dashboard} />
            <ProtectedRoute path="/campaigns" component={Campaigns} />
            <ProtectedRoute path="/campaigns/new" component={NewCampaign} />
            <ProtectedRoute path="/campaigns/:id" component={CampaignDetail} />
            <ProtectedRoute path="/templates" component={Templates} />
            <ProtectedRoute path="/leads" component={Leads} />
            <ProtectedRoute path="/integrations" component={Integrations} />
            <ProtectedRoute path="/billing" component={Billing} />
            <ProtectedRoute path="/settings" component={Settings} />
            <Route component={NotFound} />
          </Switch>
        </TooltipProvider>
      </QueryClientProvider>
    </ClerkProvider>
  );
}

function App() {
  return (
    <WouterRouter base={basePath}>
      {clerkPubKey ? <FullApp /> : <PublicApp />}
      <Toaster />
    </WouterRouter>
  );
}

export default App;
