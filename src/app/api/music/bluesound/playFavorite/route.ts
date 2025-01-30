import { NextResponse } from "next/server";

import { playFavorite } from "@/app/api/music/bluesound/utils";

/**
 * Play the favorite from the bluesound device
 * @returns
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id } = body;

    const state = await playFavorite(id);

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
