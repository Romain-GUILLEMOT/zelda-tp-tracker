import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { getState } from "@/utils/db";
import TrackerDashboard from "@/components/TrackerDashboard";

export const dynamic = "force-dynamic";

const VALID_TABS = ["inventory", "hearth", "souls", "bugs", "zones"] as const;
type TabType = (typeof VALID_TABS)[number];

interface PageProps {
  params: Promise<{ tab: string }>;
}

function isValidTab(tab: string): tab is TabType {
  return VALID_TABS.includes(tab as TabType);
}

export default async function Page({ params }: PageProps) {
  const { tab } = await params;

  if (!isValidTab(tab)) {
    notFound();
  }

  const session = await auth();
  if (!session?.user?.id) {
    redirect(`/login?callbackUrl=/zelda-tp/${tab}`);
  }

  const initialState = await getState(session.user.id);

  return (
    <TrackerDashboard
      initialState={initialState}
      userId={session.user.email || session.user.name || session.user.id}
      defaultTab={tab}
      basePath="/zelda-tp"
    />
  );
}
