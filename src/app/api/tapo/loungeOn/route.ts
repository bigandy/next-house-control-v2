import { NextResponse } from "next/server";

import { loginDeviceByIp, loginDevice, cloudLogin } from "tp-link-tapo-connect";

const email = process.env.TPLINK_EMAIL!;
const password = process.env.TPLINK_PASSWORD!;
const left = process.env.TPLINK_PLUG_2_IP!;
const right = process.env.TPLINK_PLUG_3_IP!;

const getAllDevices = async () => {
  // const cloudApi = await cloudLogin(email, password);

  // const devices = await cloudApi.listDevicesByType("SMART.TAPOPLUG");

  const device = await loginDeviceByIp(email, password, right);

  await device.turnOff();

  // await loginDevice(email, password, devices.at(-1));

  // const getDeviceInfoResponse = await device.getDeviceInfo();
  // console.log(getDeviceInfoResponse);

  return device;
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
      { success: false, error: "Failed to control light" },
      { status: 500 }
    );
  }
}
