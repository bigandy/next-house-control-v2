import { NextResponse } from "next/server";

import {
  getRoomIpAddress,
  Room,
  statusRoom,
} from "@/app/api/music/sonos/utils";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const room = searchParams.get("room");

    const ipAddress = getRoomIpAddress((room as Room) ?? "Bedroom");

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
