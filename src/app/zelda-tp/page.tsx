import { cookies } from "next/headers";
import { getState } from "@/utils/db";
import TrackerDashboard from "@/components/TrackerDashboard";

export const dynamic = "force-dynamic";

export default async function Page() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("rg_gt_user_id")?.value;
  const initialState = await getState(userId || "default");

  return (
    <TrackerDashboard
      initialState={initialState}
      userId={userId || "default"}
      defaultTab="inventory"
      basePath="/zelda-tp"
    />
  );
}
