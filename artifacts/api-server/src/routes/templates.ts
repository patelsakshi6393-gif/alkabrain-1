import { Router } from "express";
import { db, templatesTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";
import { requireAuth, type AuthRequest } from "../middlewares/firebase-auth.js";
import { z } from "zod";

const router = Router();

const TemplateSchema = z.object({
  name: z.string().min(1).max(200),
  subject: z.string().max(500).optional(),
  body: z.string().min(1).max(10000),
  channel: z.enum(["email", "whatsapp", "both"]).default("email"),
});

router.get("/templates", requireAuth, async (req: AuthRequest, res) => {
  const templates = await db.select().from(templatesTable)
    .where(eq(templatesTable.userId, req.dbUserId!))
    .orderBy(templatesTable.createdAt);
  res.json(templates);
});

router.post("/templates", requireAuth, async (req: AuthRequest, res) => {
  const parsed = TemplateSchema.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.flatten() }); return; }

  const [template] = await db.insert(templatesTable).values({
    ...parsed.data,
    userId: req.dbUserId!,
  }).returning();
  res.status(201).json(template);
});

router.patch("/templates/:id", requireAuth, async (req: AuthRequest, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid ID" }); return; }

  const parsed = TemplateSchema.partial().safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.flatten() }); return; }

  const [t] = await db.select().from(templatesTable)
    .where(and(eq(templatesTable.id, id), eq(templatesTable.userId, req.dbUserId!))).limit(1);
  if (!t) { res.status(404).json({ error: "Template not found" }); return; }

  const [updated] = await db.update(templatesTable)
    .set({ ...parsed.data, updatedAt: new Date() })
    .where(eq(templatesTable.id, id)).returning();
  res.json(updated);
});

router.delete("/templates/:id", requireAuth, async (req: AuthRequest, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid ID" }); return; }

  const [t] = await db.select().from(templatesTable)
    .where(and(eq(templatesTable.id, id), eq(templatesTable.userId, req.dbUserId!))).limit(1);
  if (!t) { res.status(404).json({ error: "Template not found" }); return; }

  await db.delete(templatesTable).where(eq(templatesTable.id, id));
  res.json({ success: true });
});

export default router;
