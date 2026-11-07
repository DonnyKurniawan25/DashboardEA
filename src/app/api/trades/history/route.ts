import { NextResponse } from "next/server";
import { getDemoTradeHistory } from "@/services/demo-data";

export async function GET() {
  const history = getDemoTradeHistory();
  return NextResponse.json(history, {
    headers: { "Cache-Control": "no-store, max-age=0" },
  });
}

