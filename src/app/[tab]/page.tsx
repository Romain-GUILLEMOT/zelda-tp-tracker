import { cookies } from "next/headers";
import { getState } from "@/utils/db";
import TrackerDashboard from "@/components/TrackerDashboard";
import { notFound } from "next/navigation";

// Force Server-Side Rendering (SSR) at request time
export const dynamic = "force-dynamic";

const VALID_TABS = ["inventory", "hearth", "souls", "bugs", "zones"];

interface PageProps {
  params: Promise<{ tab: string }>;
}

export default async function Page({ params }: PageProps) {
  const { tab } = await params;
  
  if (!VALID_TABS.includes(tab)) {
    notFound();
  }

  const cookieStore = await cookies();
  const userId = cookieStore.get("rg_gt_user_id")?.value;
  
  // Fetch the initial state from SQLite or Neon Postgres based on the cookie.
  const initialState = await getState(userId || "default");

  return (
    <TrackerDashboard 
      initialState={initialState} 
      userId={userId || "default"} 
      defaultTab={tab as "inventory" | "hearth" | "souls" | "bugs" | "zones"} 
    />
  );
}
