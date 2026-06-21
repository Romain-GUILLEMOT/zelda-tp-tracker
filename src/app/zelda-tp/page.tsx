import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getState } from "@/utils/db";
import TrackerDashboard from "@/components/TrackerDashboard";

export const dynamic = "force-dynamic";

export default async function Page() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/zelda-tp");
  }

  const initialState = await getState(session.user.id);

  return (
    <TrackerDashboard
      initialState={initialState}
      userId={session.user.email || session.user.name || session.user.id}
      defaultTab="inventory"
      basePath="/zelda-tp"
    />
  );
}
