import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "tracker-state.json");

interface TrackerState {
  selectedGame: string;
  checkedItems: string[];
  checkedCollectibles: string[];
}

const DEFAULT_STATE: TrackerState = {
  selectedGame: "tp-hd-normal",
  checkedItems: [],
  checkedCollectibles: [],
};

export async function GET() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    try {
      const data = await fs.readFile(DATA_FILE, "utf-8");
      return NextResponse.json(JSON.parse(data));
    } catch (err) {
      // File doesn't exist yet, write default state and return it
      await fs.writeFile(DATA_FILE, JSON.stringify(DEFAULT_STATE, null, 2), "utf-8");
      return NextResponse.json(DEFAULT_STATE);
    }
  } catch (error: any) {
    console.error("Error reading state file:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const state = await request.json() as TrackerState;
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(DATA_FILE, JSON.stringify(state, null, 2), "utf-8");
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error writing state file:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
