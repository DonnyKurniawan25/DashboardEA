import { NextResponse } from "next/server";
import { getDemoPositions } from "@/services/demo-data";

export async function GET() {
  const positions = getDemoPositions();
  return NextResponse.json(positions, {
    headers: {
      "Cache-Control": "no-store, max-age=0",
      "X-Data-Source": "DEMO_SIMULATION",
    },
  });
}

