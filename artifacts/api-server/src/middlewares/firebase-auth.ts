import type { Request, Response, NextFunction } from "express";
import * as admin from "firebase-admin";
import { db, usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";

let adminInitialized = false;

function getAdmin() {
  if (!adminInitialized) {
    const projectId = process.env.FIREBASE_PROJECT_ID ?? "gen-lang-client-0709280604";
    admin.initializeApp({ projectId });
    adminInitialized = true;
  }
  return admin;
}

export interface AuthRequest extends Request {
  firebaseUid?: string;
  dbUserId?: number;
  userEmail?: string;
}

export async function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    res.status(401).json({ error: "Missing or invalid Authorization header" });
    return;
  }

  const idToken = authHeader.slice(7);
  try {
    const a = getAdmin();
    const decoded = await a.auth().verifyIdToken(idToken, true);
    req.firebaseUid = decoded.uid;
    req.userEmail = decoded.email ?? "";

    let [user] = await db.select().from(usersTable).where(eq(usersTable.firebaseUid, decoded.uid)).limit(1);
    if (!user) {
      [user] = await db.insert(usersTable).values({
        firebaseUid: decoded.uid,
        email: decoded.email ?? "",
        displayName: decoded.name ?? null,
        photoUrl: decoded.picture ?? null,
        credits: 0,
      }).returning();
    }
    req.dbUserId = user.id;
    next();
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Token verification failed";
    res.status(401).json({ error: "Unauthorized", detail: msg });
  }
}
