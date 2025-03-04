import { NextResponse } from "next/server";

import { deviceDiscovery } from "@/app/api/music/sonos/utils";

export async function GET() {
  try {
    const data = await deviceDiscovery();

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
