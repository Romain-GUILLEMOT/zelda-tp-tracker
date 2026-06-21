import { handlers } from "@/auth";
import { ensureAuthDb } from "@/utils/db";
import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  await ensureAuthDb();
  return handlers.GET(request);
}

export async function POST(request: NextRequest) {
  await ensureAuthDb();
  return handlers.POST(request);
}
