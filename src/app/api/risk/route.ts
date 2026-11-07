import { NextResponse } from "next/server";
import { getDemoRiskMetrics } from "@/services/demo-data";

export async function GET() {
  const risk = getDemoRiskMetrics();
  return NextResponse.json(risk, {
    headers: { "Cache-Control": "no-store, max-age=0" },
  });
}

