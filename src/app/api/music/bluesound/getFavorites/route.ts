import { NextResponse } from "next/server";

import { getFavorites } from "@/app/api/music/bluesound/utils";

/**
 * Gets the favorites from the bluesound device
 * @returns
 */
export async function GET() {
  try {
    const favorites = await getFavorites();

    return NextResponse.json({
      success: true,
      data: { favorites },
    });
  } catch (error) {
    console.error("Error playing music:", error);
    return NextResponse.json(
      { success: false, error: "Failed to play music" },
      { status: 500 }
    );
  }
}
