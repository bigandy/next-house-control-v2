import { NextResponse } from "next/server";

import { getRoomIpAddress, toggleRoom } from "./utils";

/**
 * THIS IS THE API ROUTE FOR TOGGLING MUSIC ON A SPECIFIC ROOM
 * @param request
 * @returns
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { room } = body;

    const ipAddress = getRoomIpAddress(room ?? "Bedroom");
    const state = await toggleRoom(ipAddress);

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
