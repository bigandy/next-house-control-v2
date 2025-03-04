import { NextResponse } from "next/server";

import { getMusicStatus, toggleMusic } from "@/app/api/music/bluesound/utils";

/**
 * THIS IS THE API ROUTE FOR TOGGLING MUSIC IN BLUESOUND
 * @param request
 * @returns
 */
export async function GET() {
  try {
    await toggleMusic();

    const { status: newStatus } = await getMusicStatus();

    const isPlaying = newStatus === "stream";

    return NextResponse.json({
      success: true,
      data: { isPlaying },
    });
  } catch (error) {
    console.error("Error playing music:", error);
    return NextResponse.json(
      { success: false, error: "Failed to play music" },
      { status: 500 }
    );
  }
}
