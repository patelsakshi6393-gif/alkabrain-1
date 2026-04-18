import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { auth } from "./firebase";

// Base API URL: set VITE_API_URL in GitHub secrets to your Replit deployed URL
// e.g. https://your-app.replit.app/api
const API_URL = (import.meta.env.VITE_API_URL as string) ?? "";

async function fetchApi(path: string, opts?: RequestInit) {
  const user = auth.currentUser;
  const idToken = user ? await user.getIdToken() : null;

  const res = await fetch(`${API_URL}${path}`, {
    ...opts,
    headers: {
      "Content-Type": "application/json",
      ...(idToken ? { Authorization: `Bearer ${idToken}` } : {}),
      ...(opts?.headers ?? {}),
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err?.error ?? `Request failed: ${res.status}`);
  }

  const text = await res.text();
  return text ? JSON.parse(text) : null;
}

// ─── Query key helpers ────────────────────────────────────────────────────────
export const getGetCampaignsQueryKey = () => ["/api/campaigns"] as const;
export const getGetCampaignQueryKey = (id: string) => ["/api/campaigns", id] as const;
export const getGetTemplatesQueryKey = () => ["/api/templates"] as const;
export const getGetGmailIntegrationQueryKey = () => ["/api/integrations/gmail"] as const;
export const getGetWhatsappStatusQueryKey = () => ["/api/integrations/whatsapp"] as const;
export const getHealthCheckQueryKey = () => ["/api/healthz"] as const;

// ─── Dashboard / User ─────────────────────────────────────────────────────────
export function useGetDashboard() {
  return useQuery({
    queryKey: ["/api/dashboard"],
    queryFn: () => fetchApi("/dashboard"),
    retry: 1,
    enabled: !!auth.currentUser,
  });
}

export function useGetMe() {
  return useQuery({
    queryKey: ["/api/me"],
    queryFn: () => fetchApi("/me"),
    retry: 1,
    enabled: !!auth.currentUser,
  });
}

// ─── Campaigns ────────────────────────────────────────────────────────────────
export function useGetCampaigns() {
  return useQuery({
    queryKey: getGetCampaignsQueryKey(),
    queryFn: () => fetchApi("/campaigns"),
    retry: 1,
    enabled: !!auth.currentUser,
  });
}

export function useGetCampaign(id: string) {
  return useQuery({
    queryKey: getGetCampaignQueryKey(id),
    queryFn: () => fetchApi(`/campaigns/${id}`),
    retry: 1,
    enabled: !!auth.currentUser && !!id,
  });
}

export function useCreateCampaign() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: unknown) => fetchApi("/campaigns", { method: "POST", body: JSON.stringify(data) }),
    onSuccess: () => qc.invalidateQueries({ queryKey: getGetCampaignsQueryKey() }),
  });
}

export function useUpdateCampaign() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: { id: number; [k: string]: unknown }) =>
      fetchApi(`/campaigns/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
    onSuccess: () => qc.invalidateQueries({ queryKey: getGetCampaignsQueryKey() }),
  });
}

export function useDeleteCampaign() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => fetchApi(`/campaigns/${id}`, { method: "DELETE" }),
    onSuccess: () => qc.invalidateQueries({ queryKey: getGetCampaignsQueryKey() }),
  });
}

export function useRunCampaign() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => fetchApi(`/campaigns/${id}`, { method: "PATCH", body: JSON.stringify({ status: "running" }) }),
    onSuccess: () => qc.invalidateQueries({ queryKey: getGetCampaignsQueryKey() }),
  });
}

// ─── Templates ────────────────────────────────────────────────────────────────
export function useGetTemplates() {
  return useQuery({
    queryKey: getGetTemplatesQueryKey(),
    queryFn: () => fetchApi("/templates"),
    retry: 1,
    enabled: !!auth.currentUser,
  });
}

export function useCreateTemplate() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: unknown) => fetchApi("/templates", { method: "POST", body: JSON.stringify(data) }),
    onSuccess: () => qc.invalidateQueries({ queryKey: getGetTemplatesQueryKey() }),
  });
}

export function useUpdateTemplate() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: { id: number; [k: string]: unknown }) =>
      fetchApi(`/templates/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
    onSuccess: () => qc.invalidateQueries({ queryKey: getGetTemplatesQueryKey() }),
  });
}

export function useDeleteTemplate() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => fetchApi(`/templates/${id}`, { method: "DELETE" }),
    onSuccess: () => qc.invalidateQueries({ queryKey: getGetTemplatesQueryKey() }),
  });
}

// ─── Leads ────────────────────────────────────────────────────────────────────
export function useScrapeLeads() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: unknown) => fetchApi("/leads/scrape", { method: "POST", body: JSON.stringify(data) }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["/api/leads"] }),
  });
}

export function useGetLeads() {
  return useQuery({
    queryKey: ["/api/leads"],
    queryFn: () => fetchApi("/leads"),
    retry: 1,
    enabled: !!auth.currentUser,
  });
}

// ─── Gmail Integration ────────────────────────────────────────────────────────
export function useGetGmailIntegration() {
  return useQuery({
    queryKey: getGetGmailIntegrationQueryKey(),
    queryFn: () => fetchApi("/integrations/gmail"),
    retry: 1,
    enabled: !!auth.currentUser,
  });
}

export function useSaveGmailIntegration() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: unknown) => fetchApi("/integrations/gmail", { method: "POST", body: JSON.stringify(data) }),
    onSuccess: () => qc.invalidateQueries({ queryKey: getGetGmailIntegrationQueryKey() }),
  });
}

// ─── WhatsApp Integration ─────────────────────────────────────────────────────
export function useGetWhatsappStatus() {
  return useQuery({
    queryKey: getGetWhatsappStatusQueryKey(),
    queryFn: () => fetchApi("/integrations/whatsapp"),
    retry: 1,
    enabled: !!auth.currentUser,
  });
}

export function useConnectWhatsapp() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: unknown) => fetchApi("/integrations/whatsapp/connect", { method: "POST", body: JSON.stringify(data) }),
    onSuccess: () => qc.invalidateQueries({ queryKey: getGetWhatsappStatusQueryKey() }),
  });
}

export function useDisconnectWhatsapp() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => fetchApi("/integrations/whatsapp/disconnect", { method: "POST" }),
    onSuccess: () => qc.invalidateQueries({ queryKey: getGetWhatsappStatusQueryKey() }),
  });
}

// ─── Billing ──────────────────────────────────────────────────────────────────
export function useGetBillingPlans() {
  return useQuery({
    queryKey: ["/api/billing/plans"],
    queryFn: () => fetchApi("/billing/plans"),
    retry: 1,
    enabled: !!auth.currentUser,
  });
}

export function useGetSubscription() {
  return useQuery({
    queryKey: ["/api/billing/subscription"],
    queryFn: () => fetchApi("/billing/subscription"),
    retry: 1,
    enabled: !!auth.currentUser,
  });
}

export function useGetCreditsHistory() {
  return useQuery({
    queryKey: ["/api/billing/credits-history"],
    queryFn: () => fetchApi("/billing/credits-history"),
    retry: 1,
    enabled: !!auth.currentUser,
  });
}

// ─── Compat ───────────────────────────────────────────────────────────────────
export async function healthCheck() { return fetchApi("/healthz"); }
export function setBaseUrl(_url: string | null) {}
export function setAuthTokenGetter(_getter: unknown) {}
export type AuthTokenGetter = () => Promise<string | null> | string | null;
export type ErrorType<T = unknown> = unknown;
export type BodyType<T> = T;
