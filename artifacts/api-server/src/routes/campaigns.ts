import { Router } from "express";
import { db, campaignsTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";
import { requireAuth, type AuthRequest } from "../middlewares/firebase-auth.js";
import { z } from "zod";

const router = Router();

const CampaignSchema = z.object({
  name: z.string().min(1).max(200),
  description: z.string().max(1000).optional(),
  channel: z.enum(["email", "whatsapp", "both"]).default("email"),
  templateId: z.number().int().positive().optional(),
  targetLocation: z.string().max(200).optional(),
  targetKeyword: z.string().max(200).optional(),
  scheduledAt: z.string().datetime().optional(),
});

router.get("/campaigns", requireAuth, async (req: AuthRequest, res) => {
  const campaigns = await db.select().from(campaignsTable)
    .where(eq(campaignsTable.userId, req.dbUserId!))
    .orderBy(campaignsTable.createdAt);
  res.json(campaigns);
});

router.post("/campaigns", requireAuth, async (req: AuthRequest, res) => {
  const parsed = CampaignSchema.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.flatten() }); return; }

  const [campaign] = await db.insert(campaignsTable).values({
    ...parsed.data,
    userId: req.dbUserId!,
    scheduledAt: parsed.data.scheduledAt ? new Date(parsed.data.scheduledAt) : null,
  }).returning();
  res.status(201).json(campaign);
});

router.get("/campaigns/:id", requireAuth, async (req: AuthRequest, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid ID" }); return; }

  const [c] = await db.select().from(campaignsTable)
    .where(and(eq(campaignsTable.id, id), eq(campaignsTable.userId, req.dbUserId!))).limit(1);
  if (!c) { res.status(404).json({ error: "Campaign not found" }); return; }
  res.json(c);
});

router.patch("/campaigns/:id", requireAuth, async (req: AuthRequest, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid ID" }); return; }

  const parsed = CampaignSchema.partial().safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.flatten() }); return; }

  const [c] = await db.select().from(campaignsTable)
    .where(and(eq(campaignsTable.id, id), eq(campaignsTable.userId, req.dbUserId!))).limit(1);
  if (!c) { res.status(404).json({ error: "Campaign not found" }); return; }

  const [updated] = await db.update(campaignsTable)
    .set({ ...parsed.data, updatedAt: new Date() })
    .where(eq(campaignsTable.id, id)).returning();
  res.json(updated);
});

router.delete("/campaigns/:id", requireAuth, async (req: AuthRequest, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid ID" }); return; }

  const [c] = await db.select().from(campaignsTable)
    .where(and(eq(campaignsTable.id, id), eq(campaignsTable.userId, req.dbUserId!))).limit(1);
  if (!c) { res.status(404).json({ error: "Campaign not found" }); return; }

  await db.delete(campaignsTable).where(eq(campaignsTable.id, id));
  res.json({ success: true });
});

export default router;
