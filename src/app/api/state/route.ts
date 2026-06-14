import { NextRequest, NextResponse } from "next/server";
import { getState, saveState, TrackerState } from "@/utils/db";

export async function GET(request: NextRequest) {
  try {
    const responseHeaders = new Headers();
    let userId = request.cookies.get("rg_gt_user_id")?.value;
    
    if (!userId) {
      userId = crypto.randomUUID();
      // Set HTTP-Only cookie for 6 months (15552000 seconds)
      responseHeaders.set(
        "Set-Cookie",
        `rg_gt_user_id=${userId}; Path=/; Max-Age=15552000; SameSite=Lax; HttpOnly`
      );
    }

    const state = await getState(userId);
    return NextResponse.json(state, { headers: responseHeaders });
  } catch (error: any) {
    console.error("Error in GET state API:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const responseHeaders = new Headers();
    let userId = request.cookies.get("rg_gt_user_id")?.value;
    
    if (!userId) {
      userId = crypto.randomUUID();
      responseHeaders.set(
        "Set-Cookie",
        `rg_gt_user_id=${userId}; Path=/; Max-Age=15552000; SameSite=Lax; HttpOnly`
      );
    }

    const state = await request.json() as TrackerState;
    await saveState(userId, state);

    return NextResponse.json({ success: true }, { headers: responseHeaders });
  } catch (error: any) {
    console.error("Error in POST state API:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
