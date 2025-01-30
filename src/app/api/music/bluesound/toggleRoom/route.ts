import { NextResponse } from "next/server";

import { getMusicStatus, pauseMusic, playMusic } from "../utils";

/**
 * THIS IS THE API ROUTE FOR TOGGLING MUSIC ON A SPECIFIC ROOM IN BLUESOUND
 * @param request
 * @returns
 */
export async function GET() {
  try {
    // const body = await request.json();
    // const { room } = body;

    // const ipAddress = getRoomIpAddress(room ?? "Bedroom");
    // const state = await toggleRoom(ipAddress);

    // 1. get status of the room
    const { status } = await getMusicStatus();

    console.log({ status });

    if (status === "stream") {
      await pauseMusic();
    } else {
      await playMusic();
    }

    const { status: newStatus } = await getMusicStatus();

    console.log({ newStatus });

    const isPlaying = newStatus === "stream";

    return NextResponse.json({
      success: true,
      data: { isPlaying },
    });
  } catch (error) {
    console.error("Error playing music:", error);
    return NextResponse.json(
      { success: false, error: "Failed to play music" },
      { status: 500 }
    );
  }
}
