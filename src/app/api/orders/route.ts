import { NextResponse } from "next/server";
import { getDemoTradeHistory } from "@/services/demo-data";

export async function GET() {
  const orders = getDemoTradeHistory();
  return NextResponse.json(orders, {
    headers: { "Cache-Control": "no-store, max-age=0" },
  });
}

