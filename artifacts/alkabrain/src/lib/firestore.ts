import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
  getDocs,
  getDoc,
  serverTimestamp,
  DocumentData,
} from "firebase/firestore";
import { db } from "./firebase";

export type CampaignStatus = "draft" | "running" | "paused" | "completed" | "failed";
export type Channel = "email" | "whatsapp" | "both";

export interface Campaign {
  id: string;
  userId: string;
  name: string;
  description?: string;
  channel: Channel;
  status: CampaignStatus;
  targetLocation?: string;
  targetKeyword?: string;
  totalLeads: number;
  sentCount: number;
  creditsUsed: number;
  createdAt: Date;
}

export interface Lead {
  id: string;
  userId: string;
  campaignId?: string;
  name?: string;
  email?: string;
  phone?: string;
  business?: string;
  location?: string;
  website?: string;
  status: string;
  createdAt: Date;
}

export interface Template {
  id: string;
  userId: string;
  name: string;
  subject?: string;
  body: string;
  channel: Channel;
  createdAt: Date;
}

function toDate(val: unknown): Date {
  if (!val) return new Date();
  if (val instanceof Date) return val;
  if (typeof val === "object" && "toDate" in (val as DocumentData)) {
    return (val as { toDate: () => Date }).toDate();
  }
  return new Date(val as string);
}

// ─── Campaigns ────────────────────────────────────────────────────────────────
export async function getCampaigns(userId: string): Promise<Campaign[]> {
  const q = query(
    collection(db, "campaigns"),
    where("userId", "==", userId),
    orderBy("createdAt", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data(), createdAt: toDate(d.data().createdAt) } as Campaign));
}

export async function createCampaign(data: Omit<Campaign, "id" | "createdAt">): Promise<Campaign> {
  const ref = await addDoc(collection(db, "campaigns"), { ...data, createdAt: serverTimestamp() });
  return { ...data, id: ref.id, createdAt: new Date() };
}

export async function updateCampaign(id: string, data: Partial<Campaign>): Promise<void> {
  await updateDoc(doc(db, "campaigns", id), { ...data, updatedAt: serverTimestamp() });
}

export async function deleteCampaign(id: string): Promise<void> {
  await deleteDoc(doc(db, "campaigns", id));
}

export async function getCampaign(id: string): Promise<Campaign | null> {
  const snap = await getDoc(doc(db, "campaigns", id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data(), createdAt: toDate(snap.data().createdAt) } as Campaign;
}

// ─── Leads ────────────────────────────────────────────────────────────────────
export async function getLeads(userId: string): Promise<Lead[]> {
  const q = query(
    collection(db, "leads"),
    where("userId", "==", userId),
    orderBy("createdAt", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data(), createdAt: toDate(d.data().createdAt) } as Lead));
}

export async function createLead(data: Omit<Lead, "id" | "createdAt">): Promise<Lead> {
  const ref = await addDoc(collection(db, "leads"), { ...data, createdAt: serverTimestamp() });
  return { ...data, id: ref.id, createdAt: new Date() };
}

export async function deleteLead(id: string): Promise<void> {
  await deleteDoc(doc(db, "leads", id));
}

// ─── Templates ────────────────────────────────────────────────────────────────
export async function getTemplates(userId: string): Promise<Template[]> {
  const q = query(
    collection(db, "templates"),
    where("userId", "==", userId),
    orderBy("createdAt", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data(), createdAt: toDate(d.data().createdAt) } as Template));
}

export async function createTemplate(data: Omit<Template, "id" | "createdAt">): Promise<Template> {
  const ref = await addDoc(collection(db, "templates"), { ...data, createdAt: serverTimestamp() });
  return { ...data, id: ref.id, createdAt: new Date() };
}

export async function deleteTemplate(id: string): Promise<void> {
  await deleteDoc(doc(db, "templates", id));
}
