import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { getAuthUserByEmail, getAuthUserById, updateAuthUserProfile } from "@/utils/db";
import { hashPassword, normalizeEmail, verifyPassword } from "@/utils/secureFields";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await getAuthUserById(session.user.id);
  if (!user) {
    return NextResponse.json({ error: "Compte introuvable." }, { status: 404 });
  }

  return NextResponse.json({
    id: user.id,
    name: user.name,
    email: user.email,
    hasPassword: Boolean(user.passwordHash),
  });
}

export async function PATCH(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const currentUser = await getAuthUserById(session.user.id);
  if (!currentUser) {
    return NextResponse.json({ error: "Compte introuvable." }, { status: 404 });
  }

  const body = await request.json();
  const name = String(body.name || "").trim();
  const email = normalizeEmail(String(body.email || ""));
  const currentPassword = String(body.currentPassword || "");
  const newPassword = String(body.newPassword || "");

  if (!name) {
    return NextResponse.json({ error: "Le username est requis." }, { status: 400 });
  }

  if (!email || !email.includes("@")) {
    return NextResponse.json({ error: "Email invalide." }, { status: 400 });
  }

  const emailChanged = email !== currentUser.email;
  const passwordChanged = newPassword.length > 0;

  if ((emailChanged || passwordChanged) && currentUser.passwordHash) {
    const validPassword = await verifyPassword(currentUser.passwordHash, currentPassword);
    if (!validPassword) {
      return NextResponse.json({ error: "Mot de passe actuel incorrect." }, { status: 400 });
    }
  }

  if (passwordChanged && newPassword.length < 8) {
    return NextResponse.json({ error: "Le nouveau mot de passe doit faire au moins 8 caractères." }, { status: 400 });
  }

  if (emailChanged) {
    const existing = await getAuthUserByEmail(email);
    if (existing && existing.id !== currentUser.id) {
      return NextResponse.json({ error: "Cet email est déjà utilisé." }, { status: 409 });
    }
  }

  await updateAuthUserProfile(currentUser.id, {
    name,
    email,
    passwordHash: passwordChanged ? await hashPassword(newPassword) : undefined,
  });

  return NextResponse.json({ success: true });
}
