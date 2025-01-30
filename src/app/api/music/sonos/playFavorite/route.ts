import { NextResponse } from "next/server";

import { getRoomIpAddress, playFavorite } from "@/app/api/music/sonos/utils";

/**
 * THIS IS THE API ROUTE FOR PLaying a favorite in a specific room
 * @param request
 * @returns
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { room, favorite } = body;

    const ipAddress = getRoomIpAddress(room ?? "Bedroom");
    const state = await playFavorite(ipAddress, favorite);

    return NextResponse.json({
      success: true,
      data: { state },
    });
  } catch (error) {
    console.error("Error setting room volume:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update room volumn" },
      { status: 500 }
    );
  }
}
