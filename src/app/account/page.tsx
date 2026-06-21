import { redirect } from "next/navigation";
import { auth } from "@/auth";
import AccountPanel from "@/components/AccountPanel";

export default async function AccountPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/account");
  }

  return <AccountPanel />;
}
