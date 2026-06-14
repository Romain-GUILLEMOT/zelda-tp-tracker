import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const DB_PATH = path.join(DATA_DIR, "tracker.json");

export interface TrackerState {
  selectedGame: string;
  checkedItems: string[];
  checkedCollectibles: string[];
  checkedRegions: string[];
}

// Read JSON database file
function readDb(): Record<string, TrackerState> {
  try {
    if (fs.existsSync(DB_PATH)) {
      const content = fs.readFileSync(DB_PATH, "utf-8");
      return JSON.parse(content || "{}");
    }
  } catch (err) {
    console.error("Error reading JSON database:", err);
  }
  return {};
}

// Write JSON database file
function writeDb(data: Record<string, TrackerState>) {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.error("Error writing JSON database:", err);
  }
}

/**
 * Retrieves the saved tracker state for a given user ID.
 * Returns default values if no record exists.
 */
export function getState(userId: string): TrackerState {
  const db = readDb();
  if (db[userId]) {
    return {
      selectedGame: db[userId].selectedGame || "tp-gcn",
      checkedItems: db[userId].checkedItems || [],
      checkedCollectibles: db[userId].checkedCollectibles || [],
      checkedRegions: db[userId].checkedRegions || ["ordon", "faron", "eldin", "lanayru", "desert", "snowpeak", "sky", "twilight"],
    };
  }

  // Default state (GameCube version by default, all regions checked)
  return {
    selectedGame: "tp-gcn",
    checkedItems: [],
    checkedCollectibles: [],
    checkedRegions: ["ordon", "faron", "eldin", "lanayru", "desert", "snowpeak", "sky", "twilight"],
  };
}

/**
 * Saves or updates the tracker state for a given user ID.
 */
export function saveState(userId: string, state: TrackerState): void {
  const db = readDb();
  db[userId] = state;
  writeDb(db);
}
