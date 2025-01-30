import { NextResponse } from "next/server";

import { getRoomIpAddress, statusRoom } from "@/app/api/music/sonos/utils";

export async function GET() {
  try {
    const ipAddress = getRoomIpAddress("Bedroom");

    const state = await statusRoom(ipAddress);

    return NextResponse.json({
      success: true,
      data: { state },
    });
  } catch (error) {
    console.error("Error playing music:", error);
    return NextResponse.json(
      { success: false, error: "Failed to play music" },
      { status: 500 }
    );
  }
}
