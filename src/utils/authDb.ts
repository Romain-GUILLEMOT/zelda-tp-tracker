import { drizzle } from "drizzle-orm/neon-http";
import { authSchema } from "@/db/authSchema";

const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL || "";

export const authDb = connectionString
  ? drizzle(connectionString, { schema: authSchema })
  : drizzle.mock({ schema: authSchema });
