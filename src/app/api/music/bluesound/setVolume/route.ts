import { NextResponse } from "next/server";

import { setVolume } from "@/app/api/music/bluesound/utils";

/**
 * THIS IS THE API ROUTE FOR Setting the volume
 * @param request
 * @returns
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { volume } = body;

    const state = await setVolume(volume);

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
