import fs from "fs/promises";
import path from "path";
import TrackerDashboard from "@/components/TrackerDashboard";

// Force Server-Side Rendering (SSR) at request time
export const dynamic = "force-dynamic";

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "tracker-state.json");

export default async function Page() {
  let initialState = {
    selectedGame: "tp-hd-normal",
    checkedItems: [],
    checkedCollectibles: [],
  };

  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    const data = await fs.readFile(DATA_FILE, "utf-8");
    initialState = JSON.parse(data);
  } catch (err) {
    // Keep defaults if file does not exist yet
  }

  return <TrackerDashboard initialState={initialState} />;
}
