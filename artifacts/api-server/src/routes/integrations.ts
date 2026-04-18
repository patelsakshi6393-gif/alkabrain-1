import { Router } from "express";
import { db, gmailIntegrationsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { requireAuth, type AuthRequest } from "../middlewares/firebase-auth.js";
import { z } from "zod";

const router = Router();

const GmailSchema = z.object({
  senderEmail: z.string().email().max(200),
  senderName: z.string().max(100).optional(),
  appPassword: z.string().min(8).max(100),
});

router.get("/integrations/gmail", requireAuth, async (req: AuthRequest, res) => {
  const [integration] = await db.select({
    isConnected: gmailIntegrationsTable.isConnected,
    senderEmail: gmailIntegrationsTable.senderEmail,
    senderName: gmailIntegrationsTable.senderName,
  }).from(gmailIntegrationsTable).where(eq(gmailIntegrationsTable.userId, req.dbUserId!)).limit(1);

  res.json(integration ?? { isConnected: false, senderEmail: null, senderName: null });
});

router.post("/integrations/gmail", requireAuth, async (req: AuthRequest, res) => {
  const parsed = GmailSchema.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.flatten() }); return; }

  const existing = await db.select().from(gmailIntegrationsTable)
    .where(eq(gmailIntegrationsTable.userId, req.dbUserId!)).limit(1);

  if (existing.length > 0) {
    const [updated] = await db.update(gmailIntegrationsTable)
      .set({ ...parsed.data, isConnected: true, updatedAt: new Date() })
      .where(eq(gmailIntegrationsTable.userId, req.dbUserId!)).returning();
    res.json({ isConnected: updated.isConnected, senderEmail: updated.senderEmail, senderName: updated.senderName });
  } else {
    const [created] = await db.insert(gmailIntegrationsTable).values({
      ...parsed.data,
      userId: req.dbUserId!,
      isConnected: true,
    }).returning();
    res.status(201).json({ isConnected: created.isConnected, senderEmail: created.senderEmail, senderName: created.senderName });
  }
});

router.get("/integrations/whatsapp", requireAuth, async (_req: AuthRequest, res) => {
  res.json({ isConnected: false, phone: null, qrCode: null, message: "WhatsApp integration requires a dedicated server with Puppeteer. Contact support." });
});

router.post("/integrations/whatsapp/connect", requireAuth, async (_req: AuthRequest, res) => {
  res.status(503).json({ error: "WhatsApp integration requires VM deployment. Please upgrade your plan." });
});

router.post("/integrations/whatsapp/disconnect", requireAuth, async (_req: AuthRequest, res) => {
  res.json({ success: true });
});

export default router;
