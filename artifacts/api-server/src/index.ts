import app from "./app.js";
import { logger } from "./lib/logger.js";
import { db, pool } from "@workspace/db";
import { sql } from "drizzle-orm";

async function runMigrations() {
  logger.info("Running database migrations...");

  const stmts = [
    sql`DO $$ BEGIN CREATE TYPE campaign_status AS ENUM ('draft','running','paused','completed','failed'); EXCEPTION WHEN duplicate_object THEN null; END $$`,
    sql`DO $$ BEGIN CREATE TYPE channel AS ENUM ('email','whatsapp','both'); EXCEPTION WHEN duplicate_object THEN null; END $$`,
    sql`CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      firebase_uid TEXT NOT NULL UNIQUE,
      email TEXT NOT NULL UNIQUE,
      display_name TEXT,
      photo_url TEXT,
      credits INTEGER NOT NULL DEFAULT 0,
      created_at TIMESTAMP NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMP NOT NULL DEFAULT NOW()
    )`,
    sql`CREATE TABLE IF NOT EXISTS campaigns (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      description TEXT,
      channel channel NOT NULL DEFAULT 'email',
      status campaign_status NOT NULL DEFAULT 'draft',
      template_id INTEGER,
      target_location TEXT,
      target_keyword TEXT,
      total_leads INTEGER NOT NULL DEFAULT 0,
      sent_count INTEGER NOT NULL DEFAULT 0,
      credits_used INTEGER NOT NULL DEFAULT 0,
      scheduled_at TIMESTAMP,
      created_at TIMESTAMP NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMP NOT NULL DEFAULT NOW()
    )`,
    sql`CREATE TABLE IF NOT EXISTS templates (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      subject TEXT,
      body TEXT NOT NULL,
      channel channel NOT NULL DEFAULT 'email',
      created_at TIMESTAMP NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMP NOT NULL DEFAULT NOW()
    )`,
    sql`CREATE TABLE IF NOT EXISTS leads (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      campaign_id INTEGER,
      name TEXT,
      email TEXT,
      phone TEXT,
      business TEXT,
      location TEXT,
      website TEXT,
      status TEXT NOT NULL DEFAULT 'new',
      created_at TIMESTAMP NOT NULL DEFAULT NOW()
    )`,
    sql`CREATE TABLE IF NOT EXISTS gmail_integrations (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
      sender_email TEXT NOT NULL,
      sender_name TEXT,
      app_password TEXT NOT NULL,
      is_connected BOOLEAN NOT NULL DEFAULT true,
      created_at TIMESTAMP NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMP NOT NULL DEFAULT NOW()
    )`,
    sql`CREATE TABLE IF NOT EXISTS subscriptions (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      plan_id TEXT NOT NULL,
      plan_name TEXT NOT NULL,
      credits INTEGER NOT NULL,
      price INTEGER NOT NULL,
      expires_at TIMESTAMP NOT NULL,
      is_active BOOLEAN NOT NULL DEFAULT true,
      created_at TIMESTAMP NOT NULL DEFAULT NOW()
    )`,
    sql`CREATE TABLE IF NOT EXISTS credits_history (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      amount INTEGER NOT NULL,
      type TEXT NOT NULL,
      description TEXT,
      created_at TIMESTAMP NOT NULL DEFAULT NOW()
    )`,
  ];

  for (const stmt of stmts) {
    await db.execute(stmt);
  }
  logger.info("Migrations complete.");
}

const rawPort = process.env["PORT"];
if (!rawPort) throw new Error("PORT environment variable is required.");

const port = Number(rawPort);
if (Number.isNaN(port) || port <= 0) throw new Error(`Invalid PORT: "${rawPort}"`);

runMigrations()
  .then(() => {
    app.listen(port, (err) => {
      if (err) { logger.error({ err }, "Error listening on port"); process.exit(1); }
      logger.info({ port }, "Server listening");
    });
  })
  .catch((err) => {
    logger.error(err, "Migration failed, not starting server");
    pool.end().finally(() => process.exit(1));
  });
