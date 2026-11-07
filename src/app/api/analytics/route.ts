import { NextResponse } from "next/server";
import { getDemoAnalytics } from "@/services/demo-data";

export async function GET() {
  const analytics = getDemoAnalytics();
  return NextResponse.json(analytics, {
    headers: { "Cache-Control": "no-store, max-age=0" },
  });
}

