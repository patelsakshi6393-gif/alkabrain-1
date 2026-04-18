import { Router } from "express";
import { db, usersTable, campaignsTable, leadsTable } from "@workspace/db";
import { eq, count, sum } from "drizzle-orm";
import { requireAuth, type AuthRequest } from "../middlewares/firebase-auth.js";

const router = Router();

router.get("/dashboard", requireAuth, async (req: AuthRequest, res) => {
  const uid = req.dbUserId!;

  const [[totalCampaigns], [totalLeads], [user], [emailsSent], [creditsUsed]] = await Promise.all([
    db.select({ c: count() }).from(campaignsTable).where(eq(campaignsTable.userId, uid)),
    db.select({ c: count() }).from(leadsTable).where(eq(leadsTable.userId, uid)),
    db.select({ credits: usersTable.credits }).from(usersTable).where(eq(usersTable.id, uid)),
    db.select({ s: sum(campaignsTable.sentCount) }).from(campaignsTable).where(eq(campaignsTable.userId, uid)),
    db.select({ c: sum(campaignsTable.creditsUsed) }).from(campaignsTable).where(eq(campaignsTable.userId, uid)),
  ]);

  res.json({
    totalCampaigns: totalCampaigns.c ?? 0,
    totalLeads: totalLeads.c ?? 0,
    emailsSent: Number(emailsSent.s ?? 0),
    creditsUsed: Number(creditsUsed.c ?? 0),
    creditsRemaining: user?.credits ?? 0,
  });
});

export default router;
