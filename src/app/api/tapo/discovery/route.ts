import { NextResponse } from "next/server";

import {
  // loginDeviceByIp,
  cloudLogin,
} from "tp-link-tapo-connect";

const email = process.env.TPLINK_EMAIL;
const password = process.env.TPLINK_PASSWORD;

const getAllDevices = async () => {
  const cloudApi = await cloudLogin(email, password);

  const devices = await cloudApi.listDevicesByType("SMART.TAPOPLUG");

  return devices;
};

// import { pauseMusic } from "@/app/api/music/bluesound/utils";

/**
 * Turn off all the sonos devices
 * @returns
 */
export async function GET() {
  try {
    const data = await getAllDevices();

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
