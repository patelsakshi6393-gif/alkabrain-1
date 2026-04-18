import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// ─── Query key helpers (ALL) ──────────────────────────────────────────────────
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
    queryFn: async () => ({
      totalCampaigns: 0, activeCampaigns: 0, totalLeads: 0,
      emailsSent: 0, creditsUsed: 0, creditsRemaining: 0,
    }),
    retry: false,
  });
}

export function useGetMe() {
  return useQuery({
    queryKey: ["/api/me"],
    queryFn: async () => null,
    retry: false,
  });
}

// ─── Campaigns ────────────────────────────────────────────────────────────────
export function useGetCampaigns() {
  return useQuery({
    queryKey: getGetCampaignsQueryKey(),
    queryFn: async () => [],
    retry: false,
  });
}

export function useGetCampaign(id: string) {
  return useQuery({
    queryKey: getGetCampaignQueryKey(id),
    queryFn: async () => null,
    retry: false,
  });
}

export function useCreateCampaign() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: unknown) => ({ id: Date.now(), ...data as object }),
    onSuccess: () => qc.invalidateQueries({ queryKey: getGetCampaignsQueryKey() }),
  });
}

export function useUpdateCampaign() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: unknown) => data,
    onSuccess: () => qc.invalidateQueries({ queryKey: getGetCampaignsQueryKey() }),
  });
}

export function useDeleteCampaign() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: unknown) => id,
    onSuccess: () => qc.invalidateQueries({ queryKey: getGetCampaignsQueryKey() }),
  });
}

export function useRunCampaign() {
  return useMutation({ mutationFn: async (id: unknown) => ({ id, status: "running" }) });
}

// ─── Templates ────────────────────────────────────────────────────────────────
export function useGetTemplates() {
  return useQuery({
    queryKey: getGetTemplatesQueryKey(),
    queryFn: async () => [],
    retry: false,
  });
}

export function useCreateTemplate() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: unknown) => ({ id: Date.now(), ...data as object }),
    onSuccess: () => qc.invalidateQueries({ queryKey: getGetTemplatesQueryKey() }),
  });
}

export function useUpdateTemplate() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: unknown) => data,
    onSuccess: () => qc.invalidateQueries({ queryKey: getGetTemplatesQueryKey() }),
  });
}

export function useDeleteTemplate() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: unknown) => id,
    onSuccess: () => qc.invalidateQueries({ queryKey: getGetTemplatesQueryKey() }),
  });
}

// ─── Leads ────────────────────────────────────────────────────────────────────
export function useScrapeLeads() {
  return useMutation({
    mutationFn: async (data: unknown) => ({ leads: [], total: 0 }),
  });
}

export function useGetLeads() {
  return useQuery({
    queryKey: ["/api/leads"],
    queryFn: async () => [],
    retry: false,
  });
}

// ─── Gmail Integration ────────────────────────────────────────────────────────
export function useGetGmailIntegration() {
  return useQuery({
    queryKey: getGetGmailIntegrationQueryKey(),
    queryFn: async () => ({ isConnected: false, senderEmail: null, senderName: null }),
    retry: false,
  });
}

export function useSaveGmailIntegration() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: unknown) => data,
    onSuccess: () => qc.invalidateQueries({ queryKey: getGetGmailIntegrationQueryKey() }),
  });
}

// ─── WhatsApp Integration ─────────────────────────────────────────────────────
export function useGetWhatsappStatus() {
  return useQuery({
    queryKey: getGetWhatsappStatusQueryKey(),
    queryFn: async () => ({ isConnected: false, phone: null, qrCode: null }),
    retry: false,
  });
}

export function useConnectWhatsapp() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: unknown) => ({ qrCode: null }),
    onSuccess: () => qc.invalidateQueries({ queryKey: getGetWhatsappStatusQueryKey() }),
  });
}

export function useDisconnectWhatsapp() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => ({}),
    onSuccess: () => qc.invalidateQueries({ queryKey: getGetWhatsappStatusQueryKey() }),
  });
}

// ─── Billing ──────────────────────────────────────────────────────────────────
export function useGetBillingPlans() {
  return useQuery({
    queryKey: ["/api/billing/plans"],
    queryFn: async () => [
      { id: "trial", name: "Trial", price: 5, credits: 30, isPopular: false, paymentUrl: null,
        features: ["30 credits", "3 days access", "Email campaigns", "Lead scraping"] },
      { id: "monthly", name: "Monthly", price: 99, credits: 300, isPopular: false, paymentUrl: null,
        features: ["300 credits", "1 month access", "All features", "Priority support"] },
      { id: "quarterly", name: "Quarterly", price: 249, credits: 1000, isPopular: true, paymentUrl: null,
        features: ["1000 credits", "3 months access", "All features", "Priority support"] },
      { id: "yearly", name: "Yearly", price: 799, credits: 5000, isPopular: false, paymentUrl: null,
        features: ["5000 credits", "1 year access", "All features", "Dedicated support"] },
    ],
    retry: false,
  });
}

export function useGetSubscription() {
  return useQuery({
    queryKey: ["/api/billing/subscription"],
    queryFn: async () => null,
    retry: false,
  });
}

export function useGetCreditsHistory() {
  return useQuery({
    queryKey: ["/api/billing/credits-history"],
    queryFn: async () => [],
    retry: false,
  });
}

// ─── Health (compatibility) ───────────────────────────────────────────────────
export async function healthCheck() { return { status: "ok" }; }
export { setBaseUrl, setAuthTokenGetter } from "./custom-fetch-stub";
export type { AuthTokenGetter } from "./custom-fetch-stub";
