import { NextResponse } from "next/server";

import { pauseMusic } from "@/app/api/music/bluesound/utils";

/**
 * Turn off all the sonos devices
 * @returns
 */
export async function GET() {
  try {
    const data = await pauseMusic();

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Error playing music:", error);
    return NextResponse.json(
      { success: false, error: "Failed to play music" },
      { status: 500 }
    );
  }
}
