import { NextResponse } from "next/server";

import { getRoomIpAddress, setRoomVolume } from "@/app/api/music/sonos/utils";

/**
 * THIS IS THE API ROUTE FOR Setting the volume for a specific room
 * @param request
 * @returns
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { room, volume } = body;

    const ipAddress = getRoomIpAddress(room ?? "Bedroom");
    const state = await setRoomVolume(ipAddress, volume);

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
