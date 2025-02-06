import { NextResponse } from "next/server";

import { handleAll } from "@/app/api/music/sonos/utils";

/**
 * Turn off all the sonos devices
 * @returns
 */
export async function GET() {
  try {
    await handleAll("pause");

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error("Error playing music:", error);
    return NextResponse.json(
      { success: false, error: "Failed to play music" },
      { status: 500 }
    );
  }
}
