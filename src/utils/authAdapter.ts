import type { Adapter, AdapterAccount, AdapterUser } from "@auth/core/adapters";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { neon } from "@neondatabase/serverless";
import { authDb } from "@/utils/authDb";
import { authSchema } from "@/db/authSchema";
import { decryptField, encryptField, fieldLookup, normalizeEmail } from "@/utils/secureFields";

const baseAdapter = DrizzleAdapter(authDb, authSchema);

function dbUrl() {
  const url = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  if (!url) {
    throw new Error("DATABASE_URL or POSTGRES_URL is required for Auth.js.");
  }
  return url;
}

function sqlClient() {
  return neon(dbUrl()) as any;
}

function toAdapterUser(row: any): AdapterUser | null {
  if (!row) return null;

  return {
    id: row.id,
    name: decryptField(row.name) || null,
    email: decryptField(row.email) || "",
    emailVerified: row.emailVerified || row.emailverified || null,
    image: null,
  };
}

export function RgGtAuthAdapter(): Adapter {
  return {
    ...baseAdapter,
    async createUser(user) {
      const email = normalizeEmail(user.email || "");
      const sql = sqlClient();
      const id = user.id || crypto.randomUUID();

      const rows = await sql.query(
        `INSERT INTO "user" ("id", "name", "email", "email_hash", "emailVerified")
         VALUES ($1, $2, $3, $4, $5)
         RETURNING "id", "name", "email", "emailVerified"`,
        [
          id,
          encryptField(user.name || email.split("@")[0]),
          encryptField(email),
          fieldLookup(email),
          user.emailVerified || null,
        ]
      );

      return toAdapterUser(rows[0]) as AdapterUser;
    },
    async getUser(id) {
      const sql = sqlClient();
      const rows = await sql.query(
        `SELECT "id", "name", "email", "emailVerified" FROM "user" WHERE "id" = $1 LIMIT 1`,
        [id]
      );
      return toAdapterUser(rows[0]);
    },
    async getUserByEmail(email) {
      const sql = sqlClient();
      const rows = await sql.query(
        `SELECT "id", "name", "email", "emailVerified" FROM "user" WHERE "email_hash" = $1 LIMIT 1`,
        [fieldLookup(normalizeEmail(email))]
      );
      return toAdapterUser(rows[0]);
    },
    async getUserByAccount(account) {
      const sql = sqlClient();
      const rows = await sql.query(
        `SELECT u."id", u."name", u."email", u."emailVerified"
         FROM "account" a
         INNER JOIN "user" u ON u."id" = a."userId"
         WHERE a."provider" = $1 AND a."providerAccountId" = $2
         LIMIT 1`,
        [account.provider, account.providerAccountId]
      );
      return toAdapterUser(rows[0]);
    },
    async updateUser(user) {
      const sql = sqlClient();
      const updates: string[] = [];
      const values: unknown[] = [];

      if ("name" in user) {
        values.push(encryptField(user.name));
        updates.push(`"name" = $${values.length}`);
      }
      if ("email" in user && user.email) {
        const email = normalizeEmail(user.email);
        values.push(encryptField(email));
        updates.push(`"email" = $${values.length}`);
        values.push(fieldLookup(email));
        updates.push(`"email_hash" = $${values.length}`);
      }
      if ("emailVerified" in user) {
        values.push(user.emailVerified || null);
        updates.push(`"emailVerified" = $${values.length}`);
      }

      if (!updates.length) {
        return (await this.getUser?.(user.id)) as AdapterUser;
      }

      values.push(user.id);
      const rows = await sql.query(
        `UPDATE "user" SET ${updates.join(", ")} WHERE "id" = $${values.length} RETURNING "id", "name", "email", "emailVerified"`,
        values
      );
      return toAdapterUser(rows[0]) as AdapterUser;
    },
    async linkAccount(account) {
      const sql = sqlClient();
      await sql.query(
        `INSERT INTO "account" ("userId", "type", "provider", "providerAccountId")
         VALUES ($1, $2, $3, $4)
         ON CONFLICT ("provider", "providerAccountId") DO NOTHING`,
        [account.userId, account.type, account.provider, account.providerAccountId]
      );
      return {
        userId: account.userId,
        type: account.type,
        provider: account.provider,
        providerAccountId: account.providerAccountId,
      } as AdapterAccount;
    },
    async getAccount(providerAccountId, provider) {
      const sql = sqlClient();
      const rows = await sql.query(
        `SELECT "userId", "type", "provider", "providerAccountId"
         FROM "account"
         WHERE "provider" = $1 AND "providerAccountId" = $2
         LIMIT 1`,
        [provider, providerAccountId]
      );
      return rows[0] || null;
    },
  };
}
