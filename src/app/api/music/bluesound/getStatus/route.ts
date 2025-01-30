import { NextResponse } from "next/server";

import { getMusicStatus } from "../utils";

/**
 * THIS IS THE API ROUTE FOR GETTING THE STATUS OF MUSIC IN BLUESOUND
 * @param request
 * @returns
 */
export async function GET() {
  try {
    // 1. get status of the room
    const status = await getMusicStatus();
    const isPlaying = status.status === "stream";

    return NextResponse.json({
      success: true,
      data: { isPlaying, volume: status.volume, title: status.title },
    });
  } catch (error) {
    console.error("Error playing music:", error);
    return NextResponse.json(
      { success: false, error: "Failed to play music" },
      { status: 500 }
    );
  }
}
