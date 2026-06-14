import { Database } from "bun:sqlite";
import path from "path";
import fs from "fs";

const DATA_DIR = path.join(process.cwd(), "data");
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const db = new Database(path.join(DATA_DIR, "tracker.db"));

// Initialize the database with a user state table
db.run(`
  CREATE TABLE IF NOT EXISTS user_states (
    user_id TEXT PRIMARY KEY,
    selected_game TEXT,
    checked_items TEXT,
    checked_collectibles TEXT,
    checked_regions TEXT,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

export interface TrackerState {
  selectedGame: string;
  checkedItems: string[];
  checkedCollectibles: string[];
  checkedRegions: string[];
}

/**
 * Retrieves the saved tracker state for a given user ID.
 * Returns default values if no record exists (GC version by default).
 */
export function getState(userId: string): TrackerState {
  try {
    const query = db.query("SELECT * FROM user_states WHERE user_id = $userId");
    const row = query.get({ $userId: userId }) as any;
    
    if (row) {
      return {
        selectedGame: row.selected_game || "tp-gcn",
        checkedItems: JSON.parse(row.checked_items || "[]"),
        checkedCollectibles: JSON.parse(row.checked_collectibles || "[]"),
        checkedRegions: JSON.parse(row.checked_regions || '["ordon", "faron", "eldin", "lanayru", "desert", "snowpeak", "sky", "twilight"]'),
      };
    }
  } catch (err) {
    console.error("Error fetching state from SQLite:", err);
  }

  // Default initial state (GameCube version by default)
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
  try {
    db.run(`
      INSERT INTO user_states (user_id, selected_game, checked_items, checked_collectibles, checked_regions, updated_at)
      VALUES ($userId, $selectedGame, $checkedItems, $checkedCollectibles, $checkedRegions, CURRENT_TIMESTAMP)
      ON CONFLICT(user_id) DO UPDATE SET
        selected_game = $selectedGame,
        checked_items = $checkedItems,
        checked_collectibles = $checkedCollectibles,
        checked_regions = $checkedRegions,
        updated_at = CURRENT_TIMESTAMP
    `, {
      $userId: userId,
      $selectedGame: state.selectedGame,
      $checkedItems: JSON.stringify(state.checkedItems),
      $checkedCollectibles: JSON.stringify(state.checkedCollectibles),
      $checkedRegions: JSON.stringify(state.checkedRegions),
    } as any);
  } catch (err) {
    console.error("Error saving state to SQLite:", err);
  }
}
