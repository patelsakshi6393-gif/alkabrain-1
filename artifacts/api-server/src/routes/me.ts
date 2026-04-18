import { Router } from "express";
import { db, usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { requireAuth, type AuthRequest } from "../middlewares/firebase-auth.js";
import { z } from "zod";

const router = Router();

router.get("/me", requireAuth, async (req: AuthRequest, res) => {
  const [user] = await db.select({
    id: usersTable.id,
    email: usersTable.email,
    displayName: usersTable.displayName,
    photoUrl: usersTable.photoUrl,
    credits: usersTable.credits,
    createdAt: usersTable.createdAt,
  }).from(usersTable).where(eq(usersTable.id, req.dbUserId!)).limit(1);

  if (!user) { res.status(404).json({ error: "User not found" }); return; }
  res.json(user);
});

const UpdateProfileSchema = z.object({
  displayName: z.string().max(100).optional(),
  photoUrl: z.string().url().optional(),
});

router.patch("/me", requireAuth, async (req: AuthRequest, res) => {
  const parsed = UpdateProfileSchema.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.flatten() }); return; }

  const [updated] = await db.update(usersTable)
    .set({ ...parsed.data, updatedAt: new Date() })
    .where(eq(usersTable.id, req.dbUserId!))
    .returning();
  res.json(updated);
});

export default router;
