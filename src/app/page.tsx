import { cookies } from "next/headers";
import { getState } from "@/utils/db";
import TrackerDashboard from "@/components/TrackerDashboard";

// Force Server-Side Rendering (SSR) at request time
export const dynamic = "force-dynamic";

export default async function Page() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("rg_gt_user_id")?.value;
  
  // Fetch the initial state from SQLite based on the cookie.
  // If the user has no cookie yet, getState returns the default GC version state.
  const initialState = await getState(userId || "default");

  return <TrackerDashboard initialState={initialState} />;
}
