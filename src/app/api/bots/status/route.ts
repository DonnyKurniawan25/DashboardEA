import { NextResponse } from "next/server";
import { getDemoBotStatus } from "@/services/demo-data";

export async function GET() {
  const bots = getDemoBotStatus();
  return NextResponse.json(bots, {
    headers: { "Cache-Control": "no-store, max-age=0" },
  });
}

