import { NextResponse } from "next/server";
import { getDemoAISignals } from "@/services/demo-data";

export async function GET() {
  const signals = getDemoAISignals();
  return NextResponse.json(signals, {
    headers: { "Cache-Control": "no-store, max-age=0" },
  });
}

