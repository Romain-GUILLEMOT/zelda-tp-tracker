import fs from "fs";
import path from "path";
import { neon } from "@neondatabase/serverless";

const DATA_DIR = path.join(process.cwd(), "data");
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const DB_PATH = path.join(DATA_DIR, "tracker.db");

export interface TrackerState {
  selectedGame: string;
  checkedItems: string[];
  checkedCollectibles: string[];
  checkedRegions: string[];
}

let isInitialized = false;

async function initDb() {
  if (isInitialized) return;

  const dbUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  if (dbUrl) {
    try {
      const sql = neon(dbUrl) as any;
      await sql(`
        CREATE TABLE IF NOT EXISTS user_states (
          user_id VARCHAR(255) PRIMARY KEY,
          selected_game TEXT,
          checked_items TEXT,
          checked_collectibles TEXT,
          checked_regions TEXT,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
    } catch (err) {
      console.error("Failed to initialize Neon Postgres table:", err);
    }
  } else {
    try {
      const Database = require("better-sqlite3");
      const db = new Database(DB_PATH);
      db.exec(`
        CREATE TABLE IF NOT EXISTS user_states (
          user_id TEXT PRIMARY KEY,
          selected_game TEXT,
          checked_items TEXT,
          checked_collectibles TEXT,
          checked_regions TEXT,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);
      db.close();
    } catch (err) {
      console.error("Failed to initialize local SQLite table:", err);
    }
  }
  isInitialized = true;
}

/**
 * Retrieves the saved tracker state for a given user ID.
 * Returns default values if no record exists (GC version by default).
 */
export async function getState(userId: string): Promise<TrackerState> {
  await initDb();

  const dbUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  if (dbUrl) {
    try {
      const sql = neon(dbUrl) as any;
      const rows = await sql("SELECT * FROM user_states WHERE user_id = $1", [userId]);
      if (rows && rows.length > 0) {
        const row = rows[0];
        return {
          selectedGame: row.selected_game || "tp-gcn",
          checkedItems: JSON.parse(row.checked_items || "[]"),
          checkedCollectibles: JSON.parse(row.checked_collectibles || "[]"),
          checkedRegions: JSON.parse(row.checked_regions || '["ordon", "faron", "eldin", "lanayru", "desert", "snowpeak", "sky", "twilight"]'),
        };
      }
    } catch (err) {
      console.error("Error fetching state from Neon Postgres:", err);
    }
  } else {
    try {
      const Database = require("better-sqlite3");
      const db = new Database(DB_PATH);
      const row = db.prepare("SELECT * FROM user_states WHERE user_id = ?").get(userId) as any;
      db.close();

      if (row) {
        return {
          selectedGame: row.selected_game || "tp-gcn",
          checkedItems: JSON.parse(row.checked_items || "[]"),
          checkedCollectibles: JSON.parse(row.checked_collectibles || "[]"),
          checkedRegions: JSON.parse(row.checked_regions || '["ordon", "faron", "eldin", "lanayru", "desert", "snowpeak", "sky", "twilight"]'),
        };
      }
    } catch (err) {
      console.error("Error fetching state from local SQLite:", err);
    }
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
export async function saveState(userId: string, state: TrackerState): Promise<void> {
  await initDb();

  const dbUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  if (dbUrl) {
    try {
      const sql = neon(dbUrl) as any;
      await sql(`
        INSERT INTO user_states (user_id, selected_game, checked_items, checked_collectibles, checked_regions, updated_at)
        VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP)
        ON CONFLICT (user_id) DO UPDATE SET
          selected_game = EXCLUDED.selected_game,
          checked_items = EXCLUDED.checked_items,
          checked_collectibles = EXCLUDED.checked_collectibles,
          checked_regions = EXCLUDED.checked_regions,
          updated_at = CURRENT_TIMESTAMP
      `, [
        userId,
        state.selectedGame,
        JSON.stringify(state.checkedItems),
        JSON.stringify(state.checkedCollectibles),
        JSON.stringify(state.checkedRegions),
      ]);
    } catch (err) {
      console.error("Error saving state to Neon Postgres:", err);
    }
  } else {
    try {
      const Database = require("better-sqlite3");
      const db = new Database(DB_PATH);
      db.prepare(`
        INSERT INTO user_states (user_id, selected_game, checked_items, checked_collectibles, checked_regions, updated_at)
        VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
        ON CONFLICT(user_id) DO UPDATE SET
          selected_game = excluded.selected_game,
          checked_items = excluded.checked_items,
          checked_collectibles = excluded.checked_collectibles,
          checked_regions = excluded.checked_regions,
          updated_at = CURRENT_TIMESTAMP
      `).run(
        userId,
        state.selectedGame,
        JSON.stringify(state.checkedItems),
        JSON.stringify(state.checkedCollectibles),
        JSON.stringify(state.checkedRegions)
      );
      db.close();
    } catch (err) {
      console.error("Error saving state to local SQLite:", err);
    }
  }
}
