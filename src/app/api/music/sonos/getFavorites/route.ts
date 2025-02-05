import { NextResponse } from "next/server";

import {
  getRoomIpAddress,
  Room,
  getFavorites,
} from "@/app/api/music/sonos/utils";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const room = searchParams.get("room");

    const ipAddress = getRoomIpAddress((room as Room) ?? "Bedroom");

    const { formattedFavorites, sonosFavorites } = await getFavorites(
      ipAddress
    );

    return NextResponse.json({
      success: true,
      data: { formattedFavorites, sonosFavorites },
    });
  } catch (error) {
    console.error("Error playing music:", error);
    return NextResponse.json(
      { success: false, error: "Failed to play music" },
      { status: 500 }
    );
  }
}
