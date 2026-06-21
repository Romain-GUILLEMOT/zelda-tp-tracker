import fs from "fs";
import path from "path";
import { neon } from "@neondatabase/serverless";
import { decryptField, encryptField, fieldLookup, normalizeEmail } from "@/utils/secureFields";

const DB_PATH = path.join(process.cwd(), "data", "tracker.db");

export interface TrackerState {
  selectedGame: string;
  checkedItems: string[];
  checkedCollectibles: string[];
  checkedRegions: string[];
}

let isInitialized = false;
let isAuthInitialized = false;

const defaultRegions = ["ordon", "faron", "eldin", "lanayru", "desert", "snowpeak", "sky", "twilight"];

function getDbUrl() {
  return process.env.DATABASE_URL || process.env.POSTGRES_URL;
}

function parseJsonArray(value: string | null | undefined) {
  try {
    const parsed = JSON.parse(value || "[]");
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === "string") : [];
  } catch {
    return [];
  }
}

async function initDb() {
  if (isInitialized) return;

  const dbUrl = getDbUrl();
  if (dbUrl) {
    try {
      const sql = neon(dbUrl) as any;
      await sql.query(`
        CREATE TABLE IF NOT EXISTS user_states (
          user_id VARCHAR(255) PRIMARY KEY,
          selected_game TEXT,
          checked_items TEXT,
          checked_collectibles TEXT,
          checked_regions TEXT,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
    } catch (err) {
      console.error("Failed to initialize Neon Postgres table:", err);
    }
  } else {
    try {
      // Create local data directory only when running locally
      const DATA_DIR = path.join(process.cwd(), "data");
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }

      const Database = require("better-sqlite3");
      const db = new Database(DB_PATH);
      db.exec(`
        CREATE TABLE IF NOT EXISTS user_states (
          user_id TEXT PRIMARY KEY,
          selected_game TEXT,
          checked_items TEXT,
          checked_collectibles TEXT,
          checked_regions TEXT,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);
      db.close();
    } catch (err) {
      console.error("Failed to initialize local SQLite table:", err);
    }
  }
  isInitialized = true;
}

/**
 * Retrieves the saved tracker state for a given user ID.
 * Returns default values if no record exists (GC version by default).
 */
export async function getState(userId: string): Promise<TrackerState> {
  await initDb();

  const dbUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  if (dbUrl) {
    try {
      const sql = neon(dbUrl) as any;
      const rows = await sql.query("SELECT * FROM user_states WHERE user_id = $1", [userId]);
      if (rows && rows.length > 0) {
        const row = rows[0];
        return {
          selectedGame: row.selected_game || "tp-gcn",
          checkedItems: parseJsonArray(row.checked_items),
          checkedCollectibles: parseJsonArray(row.checked_collectibles),
          checkedRegions: parseJsonArray(row.checked_regions).length ? parseJsonArray(row.checked_regions) : defaultRegions,
        };
      }
    } catch (err) {
      console.error("Error fetching state from Neon Postgres:", err);
    }
  } else {
    try {
      const Database = require("better-sqlite3");
      const db = new Database(DB_PATH);
      const row = db.prepare("SELECT * FROM user_states WHERE user_id = ?").get(userId) as any;
      db.close();

      if (row) {
        return {
          selectedGame: row.selected_game || "tp-gcn",
          checkedItems: parseJsonArray(row.checked_items),
          checkedCollectibles: parseJsonArray(row.checked_collectibles),
          checkedRegions: parseJsonArray(row.checked_regions).length ? parseJsonArray(row.checked_regions) : defaultRegions,
        };
      }
    } catch (err) {
      console.error("Error fetching state from local SQLite:", err);
    }
  }

  // Default initial state (GameCube version by default)
  return {
    selectedGame: "tp-gcn",
    checkedItems: [],
    checkedCollectibles: [],
    checkedRegions: defaultRegions,
  };
}

/**
 * Saves or updates the tracker state for a given user ID.
 */
export async function saveState(userId: string, state: TrackerState): Promise<void> {
  await initDb();

  const dbUrl = getDbUrl();
  if (dbUrl) {
    try {
      const sql = neon(dbUrl) as any;
      await sql.query(`
        INSERT INTO user_states (user_id, selected_game, checked_items, checked_collectibles, checked_regions, updated_at)
        VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP)
        ON CONFLICT (user_id) DO UPDATE SET
          selected_game = EXCLUDED.selected_game,
          checked_items = EXCLUDED.checked_items,
          checked_collectibles = EXCLUDED.checked_collectibles,
          checked_regions = EXCLUDED.checked_regions,
          updated_at = CURRENT_TIMESTAMP
      `, [
        userId,
        state.selectedGame,
        JSON.stringify(state.checkedItems),
        JSON.stringify(state.checkedCollectibles),
        JSON.stringify(state.checkedRegions),
      ]);
    } catch (err) {
      console.error("Error saving state to Neon Postgres:", err);
    }
  } else {
    try {
      const Database = require("better-sqlite3");
      const db = new Database(DB_PATH);
      db.prepare(`
        INSERT INTO user_states (user_id, selected_game, checked_items, checked_collectibles, checked_regions, updated_at)
        VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
        ON CONFLICT(user_id) DO UPDATE SET
          selected_game = excluded.selected_game,
          checked_items = excluded.checked_items,
          checked_collectibles = excluded.checked_collectibles,
          checked_regions = excluded.checked_regions,
          updated_at = CURRENT_TIMESTAMP
      `).run(
        userId,
        state.selectedGame,
        JSON.stringify(state.checkedItems),
        JSON.stringify(state.checkedCollectibles),
        JSON.stringify(state.checkedRegions)
      );
      db.close();
    } catch (err) {
      console.error("Error saving state to local SQLite:", err);
    }
  }
}

export interface AuthUserRecord {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  passwordHash: string | null;
}

export async function ensureAuthDb() {
  if (isAuthInitialized) return;

  const dbUrl = getDbUrl();
  if (!dbUrl) {
    throw new Error("DATABASE_URL or POSTGRES_URL is required for Auth.js.");
  }

  const sql = neon(dbUrl) as any;
  await sql.query(`
    CREATE TABLE IF NOT EXISTS "user" (
      "id" TEXT PRIMARY KEY,
      "name" TEXT,
      "email" TEXT,
      "email_hash" TEXT UNIQUE,
      "emailVerified" TIMESTAMP,
      "image" TEXT,
      "password_hash" TEXT,
      "avatar_webp" BYTEA,
      "avatar_updated_at" TIMESTAMP
    )
  `);
  await sql.query(`ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "email_hash" TEXT`);
  await sql.query(`ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "password_hash" TEXT`);
  await sql.query(`ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "avatar_webp" BYTEA`);
  await sql.query(`ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "avatar_updated_at" TIMESTAMP`);
  await sql.query(`ALTER TABLE "user" DROP CONSTRAINT IF EXISTS "user_email_unique"`);
  await sql.query(`ALTER TABLE "user" DROP CONSTRAINT IF EXISTS "user_email_key"`);
  await sql.query(`DROP INDEX IF EXISTS "user_email_unique"`);
  await sql.query(`DROP INDEX IF EXISTS "user_email_key"`);
  await sql.query(`CREATE UNIQUE INDEX IF NOT EXISTS "user_email_hash_unique" ON "user"("email_hash")`);
  await sql.query(`
    CREATE TABLE IF NOT EXISTS "account" (
      "userId" TEXT NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
      "type" TEXT NOT NULL,
      "provider" TEXT NOT NULL,
      "providerAccountId" TEXT NOT NULL,
      "refresh_token" TEXT,
      "access_token" TEXT,
      "expires_at" INTEGER,
      "token_type" TEXT,
      "scope" TEXT,
      "id_token" TEXT,
      "session_state" TEXT,
      PRIMARY KEY ("provider", "providerAccountId")
    )
  `);
  await sql.query(`
    CREATE TABLE IF NOT EXISTS "session" (
      "sessionToken" TEXT PRIMARY KEY,
      "userId" TEXT NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
      "expires" TIMESTAMP NOT NULL
    )
  `);
  await sql.query(`
    CREATE TABLE IF NOT EXISTS "verificationToken" (
      "identifier" TEXT NOT NULL,
      "token" TEXT NOT NULL,
      "expires" TIMESTAMP NOT NULL,
      PRIMARY KEY ("identifier", "token")
    )
  `);
  await sql.query(`
    CREATE TABLE IF NOT EXISTS "authenticator" (
      "credentialID" TEXT NOT NULL UNIQUE,
      "userId" TEXT NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
      "providerAccountId" TEXT NOT NULL,
      "credentialPublicKey" TEXT NOT NULL,
      "counter" INTEGER NOT NULL,
      "credentialDeviceType" TEXT NOT NULL,
      "credentialBackedUp" BOOLEAN NOT NULL,
      "transports" TEXT,
      PRIMARY KEY ("userId", "credentialID")
    )
  `);

  isAuthInitialized = true;
}

export async function getAuthUserByEmail(email: string): Promise<AuthUserRecord | null> {
  await ensureAuthDb();

  const dbUrl = getDbUrl();
  if (!dbUrl) return null;

  const sql = neon(dbUrl) as any;
  const rows = await sql.query(
    `SELECT "id", "name", "email", "image", "password_hash" AS "passwordHash" FROM "user" WHERE "email_hash" = $1 LIMIT 1`,
    [fieldLookup(normalizeEmail(email))]
  );
  const row = rows?.[0];
  if (!row) return null;

  return {
    id: row.id,
    name: decryptField(row.name),
    email: decryptField(row.email),
    image: null,
    passwordHash: row.passwordHash,
  };
}

export async function getAuthUserById(id: string): Promise<AuthUserRecord | null> {
  await ensureAuthDb();

  const dbUrl = getDbUrl();
  if (!dbUrl) return null;

  const sql = neon(dbUrl) as any;
  const rows = await sql.query(
    `SELECT "id", "name", "email", "image", "password_hash" AS "passwordHash" FROM "user" WHERE "id" = $1 LIMIT 1`,
    [id]
  );
  const row = rows?.[0];
  if (!row) return null;

  return {
    id: row.id,
    name: decryptField(row.name),
    email: decryptField(row.email),
    image: null,
    passwordHash: row.passwordHash,
  };
}

export async function createCredentialsUser(user: { email: string; name: string; passwordHash: string }) {
  await ensureAuthDb();

  const dbUrl = getDbUrl();
  if (!dbUrl) {
    throw new Error("DATABASE_URL or POSTGRES_URL is required for Auth.js.");
  }

  const sql = neon(dbUrl) as any;
  const id = crypto.randomUUID();
  const email = normalizeEmail(user.email);
  await sql.query(
    `INSERT INTO "user" ("id", "name", "email", "email_hash", "emailVerified", "password_hash") VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP, $5)`,
    [id, encryptField(user.name), encryptField(email), fieldLookup(email), user.passwordHash]
  );
  return id;
}

export async function updateAuthUserProfile(
  id: string,
  updates: { email?: string; name?: string; passwordHash?: string }
) {
  await ensureAuthDb();

  const dbUrl = getDbUrl();
  if (!dbUrl) {
    throw new Error("DATABASE_URL or POSTGRES_URL is required for Auth.js.");
  }

  const sql = neon(dbUrl) as any;
  const values: unknown[] = [];
  const sets: string[] = [];

  if (updates.name !== undefined) {
    values.push(encryptField(updates.name));
    sets.push(`"name" = $${values.length}`);
  }

  if (updates.email !== undefined) {
    const email = normalizeEmail(updates.email);
    values.push(encryptField(email));
    sets.push(`"email" = $${values.length}`);
    values.push(fieldLookup(email));
    sets.push(`"email_hash" = $${values.length}`);
  }

  if (updates.passwordHash !== undefined) {
    values.push(updates.passwordHash);
    sets.push(`"password_hash" = $${values.length}`);
  }

  if (!sets.length) return;

  values.push(id);
  await sql.query(`UPDATE "user" SET ${sets.join(", ")} WHERE "id" = $${values.length}`, values);
}

export async function getAuthUserAvatar(id: string): Promise<Buffer | null> {
  await ensureAuthDb();

  const dbUrl = getDbUrl();
  if (!dbUrl) return null;

  const sql = neon(dbUrl) as any;
  const rows = await sql.query(`SELECT "avatar_webp" FROM "user" WHERE "id" = $1 LIMIT 1`, [id]);
  const avatar = rows?.[0]?.avatar_webp;
  if (!avatar) return null;

  return Buffer.isBuffer(avatar) ? avatar : Buffer.from(avatar);
}

export async function updateAuthUserAvatar(id: string, avatarWebp: Buffer) {
  await ensureAuthDb();

  const dbUrl = getDbUrl();
  if (!dbUrl) {
    throw new Error("DATABASE_URL or POSTGRES_URL is required for Auth.js.");
  }

  const sql = neon(dbUrl) as any;
  await sql.query(
    `UPDATE "user" SET "avatar_webp" = $1, "avatar_updated_at" = CURRENT_TIMESTAMP WHERE "id" = $2`,
    [avatarWebp, id]
  );
}
