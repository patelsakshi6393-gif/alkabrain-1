import { Router } from "express";
import { db, leadsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { requireAuth, type AuthRequest } from "../middlewares/firebase-auth.js";
import { scrapeLimiter } from "../middlewares/rate-limit.js";
import { z } from "zod";

const router = Router();

const ScrapeSchema = z.object({
  keyword: z.string().min(1).max(200),
  location: z.string().min(1).max(200),
  limit: z.number().int().min(1).max(50).default(20),
});

router.post("/leads/scrape", requireAuth, scrapeLimiter, async (req: AuthRequest, res) => {
  const parsed = ScrapeSchema.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.flatten() }); return; }

  const { keyword, location, limit } = parsed.data;

  const mockLeads = Array.from({ length: Math.min(limit, 5) }, (_, i) => ({
    name: `Business ${i + 1} - ${keyword}`,
    email: `contact${i + 1}@example.com`,
    phone: `+91 98765 4321${i}`,
    business: `${keyword} Services ${i + 1}`,
    location,
    website: `https://example${i + 1}.com`,
    status: "new" as const,
    userId: req.dbUserId!,
  }));

  const inserted = await db.insert(leadsTable).values(mockLeads).returning();
  res.json({ leads: inserted, total: inserted.length });
});

router.get("/leads", requireAuth, async (req: AuthRequest, res) => {
  const leads = await db.select().from(leadsTable)
    .where(eq(leadsTable.userId, req.dbUserId!))
    .orderBy(leadsTable.createdAt);
  res.json(leads);
});

export default router;
