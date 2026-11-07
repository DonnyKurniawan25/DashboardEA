import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    app: "GOLDSHIELD AI — Trading Intelligence Dashboard",
    system: "EA-Nevan MT5 Connected",
    version: "1.220",
    environment: process.env.NODE_ENV || "production",
    uptimeSeconds: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
  });
}
