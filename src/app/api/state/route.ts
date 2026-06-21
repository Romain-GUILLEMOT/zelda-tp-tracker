import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { getState, saveState, TrackerState } from "@/utils/db";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const state = await getState(session.user.id);
    return NextResponse.json(state);
  } catch (error: any) {
    console.error("Error in GET state API:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const state = await request.json() as TrackerState;
    await saveState(session.user.id, state);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error in POST state API:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
