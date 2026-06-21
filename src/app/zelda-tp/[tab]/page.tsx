import { cookies } from "next/headers";
import { notFound } from "next/navigation";
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

  const cookieStore = await cookies();
  const userId = cookieStore.get("rg_gt_user_id")?.value;
  const initialState = await getState(userId || "default");

  return (
    <TrackerDashboard
      initialState={initialState}
      userId={userId || "default"}
      defaultTab={tab}
      basePath="/zelda-tp"
    />
  );
}
