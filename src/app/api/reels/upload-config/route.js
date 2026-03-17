export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";

export async function GET(request, context) {
  try {
    const config = {
      storageZoneName: process.env.BUNNY_STORAGE_ZONE_NAME,
      storageZonePassword: process.env.BUNNY_STORAGE_ZONE_PASSWORD,
      pullZoneUrl: process.env.BUNNY_PULL_ZONE_URL,
      storageEndpoint: `https://storage.bunnycdn.com/${process.env.BUNNY_STORAGE_ZONE_NAME}`,
    };

    if (!config.storageZoneName || !config.storageZonePassword || !config.pullZoneUrl) {
      return NextResponse.json({ success: false, error: "Upload configuration incomplete" }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: config });
  } catch (error) {
    console.error("Config error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}