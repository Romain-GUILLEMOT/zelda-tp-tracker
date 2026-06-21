import { NextRequest, NextResponse } from "next/server";
import { createCredentialsUser, ensureAuthDb, getAuthUserByEmail } from "@/utils/db";
import { hashPassword, normalizeEmail } from "@/utils/secureFields";

export async function POST(request: NextRequest) {
  try {
    await ensureAuthDb();

    const body = await request.json();
    const email = normalizeEmail(String(body.email || ""));
    const password = String(body.password || "");
    const name = String(body.name || "").trim() || email.split("@")[0];

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Email invalide." }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ error: "Le mot de passe doit faire au moins 8 caractères." }, { status: 400 });
    }

    const existingUser = await getAuthUserByEmail(email);
    if (existingUser) {
      return NextResponse.json({ error: "Un compte existe déjà avec cet email." }, { status: 409 });
    }

    await createCredentialsUser({
      email,
      name,
      passwordHash: await hashPassword(password),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error creating credentials user:", error);
    return NextResponse.json({ error: "Création du compte impossible." }, { status: 500 });
  }
}
