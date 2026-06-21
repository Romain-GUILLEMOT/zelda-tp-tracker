import { redirect } from "next/navigation";
import { auth } from "@/auth";
import LoginPanel from "@/components/LoginPanel";

interface LoginPageProps {
  searchParams: Promise<{ callbackUrl?: string }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const session = await auth();
  const { callbackUrl } = await searchParams;

  if (session?.user?.id) {
    redirect(callbackUrl || "/");
  }

  return (
    <main className="auth-page">
      <LoginPanel callbackUrl={callbackUrl || "/"} />
    </main>
  );
}
