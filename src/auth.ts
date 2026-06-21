import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import Passkey from "next-auth/providers/passkey";
import { RgGtAuthAdapter } from "@/utils/authAdapter";
import { ensureAuthDb, getAuthUserByEmail } from "@/utils/db";
import { verifyPassword } from "@/utils/secureFields";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: RgGtAuthAdapter(),
  // JWT sessions avoid a persisted session table for every login while users,
  // linked OAuth accounts, credentials hashes, and passkeys remain stored in Neon.
  session: { strategy: "jwt" },
  providers: [
    Google,
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Mot de passe", type: "password" },
      },
      async authorize(credentials) {
        await ensureAuthDb();

        const email = String(credentials?.email || "").trim().toLowerCase();
        const password = String(credentials?.password || "");
        if (!email || !password) return null;

        const user = await getAuthUserByEmail(email);
        if (!user?.passwordHash) return null;

        const isValid = await verifyPassword(user.passwordHash, password);
        if (!isValid) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
        };
      },
    }),
    Passkey({}),
  ],
  pages: {
    signIn: "/login",
  },
  experimental: {
    enableWebAuthn: true,
  },
  callbacks: {
    jwt({ token, user }) {
      if (user?.id) {
        token.sub = user.id;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
});
