import {
  pgTable, serial, text, integer, boolean, timestamp, pgEnum,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const campaignStatusEnum = pgEnum("campaign_status", [
  "draft", "running", "paused", "completed", "failed",
]);

export const channelEnum = pgEnum("channel", ["email", "whatsapp", "both"]);

// ─── Users ─────────────────────────────────────────────────────────────────
export const usersTable = pgTable("users", {
  id: serial("id").primaryKey(),
  firebaseUid: text("firebase_uid").notNull().unique(),
  email: text("email").notNull().unique(),
  displayName: text("display_name"),
  photoUrl: text("photo_url"),
  credits: integer("credits").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
export const insertUserSchema = createInsertSchema(usersTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof usersTable.$inferSelect;

// ─── Campaigns ─────────────────────────────────────────────────────────────
export const campaignsTable = pgTable("campaigns", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  description: text("description"),
  channel: channelEnum("channel").notNull().default("email"),
  status: campaignStatusEnum("status").notNull().default("draft"),
  templateId: integer("template_id"),
  targetLocation: text("target_location"),
  targetKeyword: text("target_keyword"),
  totalLeads: integer("total_leads").notNull().default(0),
  sentCount: integer("sent_count").notNull().default(0),
  creditsUsed: integer("credits_used").notNull().default(0),
  scheduledAt: timestamp("scheduled_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
export const insertCampaignSchema = createInsertSchema(campaignsTable).omit({
  id: true, createdAt: true, updatedAt: true, sentCount: true, creditsUsed: true,
});
export type InsertCampaign = z.infer<typeof insertCampaignSchema>;
export type Campaign = typeof campaignsTable.$inferSelect;

// ─── Templates ─────────────────────────────────────────────────────────────
export const templatesTable = pgTable("templates", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  subject: text("subject"),
  body: text("body").notNull(),
  channel: channelEnum("channel").notNull().default("email"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
export const insertTemplateSchema = createInsertSchema(templatesTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertTemplate = z.infer<typeof insertTemplateSchema>;
export type Template = typeof templatesTable.$inferSelect;

// ─── Leads ─────────────────────────────────────────────────────────────────
export const leadsTable = pgTable("leads", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
  campaignId: integer("campaign_id"),
  name: text("name"),
  email: text("email"),
  phone: text("phone"),
  business: text("business"),
  location: text("location"),
  website: text("website"),
  status: text("status").notNull().default("new"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
export const insertLeadSchema = createInsertSchema(leadsTable).omit({ id: true, createdAt: true });
export type InsertLead = z.infer<typeof insertLeadSchema>;
export type Lead = typeof leadsTable.$inferSelect;

// ─── Gmail Integrations ────────────────────────────────────────────────────
export const gmailIntegrationsTable = pgTable("gmail_integrations", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }).unique(),
  senderEmail: text("sender_email").notNull(),
  senderName: text("sender_name"),
  appPassword: text("app_password").notNull(),
  isConnected: boolean("is_connected").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
export const insertGmailIntegrationSchema = createInsertSchema(gmailIntegrationsTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertGmailIntegration = z.infer<typeof insertGmailIntegrationSchema>;
export type GmailIntegration = typeof gmailIntegrationsTable.$inferSelect;

// ─── Subscriptions ─────────────────────────────────────────────────────────
export const subscriptionsTable = pgTable("subscriptions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
  planId: text("plan_id").notNull(),
  planName: text("plan_name").notNull(),
  credits: integer("credits").notNull(),
  price: integer("price").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
export type Subscription = typeof subscriptionsTable.$inferSelect;

// ─── Credits History ───────────────────────────────────────────────────────
export const creditsHistoryTable = pgTable("credits_history", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
  amount: integer("amount").notNull(),
  type: text("type").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
export type CreditsHistory = typeof creditsHistoryTable.$inferSelect;
