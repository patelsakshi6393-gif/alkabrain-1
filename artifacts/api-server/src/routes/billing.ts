import { Router } from "express";
import { db, subscriptionsTable, creditsHistoryTable, usersTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import { requireAuth, type AuthRequest } from "../middlewares/firebase-auth.js";

const router = Router();

const PLANS = [
  { id: "trial", name: "Trial", price: 5, credits: 30, isPopular: false, paymentUrl: null,
    features: ["30 credits", "3 days access", "Email campaigns", "Lead scraping"] },
  { id: "monthly", name: "Monthly", price: 99, credits: 300, isPopular: false, paymentUrl: null,
    features: ["300 credits", "1 month access", "All features", "Priority support"] },
  { id: "quarterly", name: "Quarterly", price: 249, credits: 1000, isPopular: true, paymentUrl: null,
    features: ["1000 credits", "3 months access", "All features", "Priority support"] },
  { id: "yearly", name: "Yearly", price: 799, credits: 5000, isPopular: false, paymentUrl: null,
    features: ["5000 credits", "1 year access", "All features", "Dedicated support"] },
];

router.get("/billing/plans", requireAuth, (_req, res) => {
  res.json(PLANS);
});

router.get("/billing/subscription", requireAuth, async (req: AuthRequest, res) => {
  const [sub] = await db.select().from(subscriptionsTable)
    .where(eq(subscriptionsTable.userId, req.dbUserId!))
    .orderBy(desc(subscriptionsTable.createdAt)).limit(1);
  res.json(sub ?? null);
});

router.get("/billing/credits-history", requireAuth, async (req: AuthRequest, res) => {
  const history = await db.select().from(creditsHistoryTable)
    .where(eq(creditsHistoryTable.userId, req.dbUserId!))
    .orderBy(desc(creditsHistoryTable.createdAt)).limit(50);
  res.json(history);
});

router.get("/billing/credits", requireAuth, async (req: AuthRequest, res) => {
  const [user] = await db.select({ credits: usersTable.credits }).from(usersTable)
    .where(eq(usersTable.id, req.dbUserId!)).limit(1);
  res.json({ credits: user?.credits ?? 0 });
});

export default router;
