import { NextResponse } from "next/server";
import { getDemoAccounts } from "@/services/demo-data";

export async function GET() {
  const accounts = getDemoAccounts();
  return NextResponse.json(accounts, {
    headers: {
      "Cache-Control": "no-store, max-age=0",
      "X-Data-Source": "DEMO_SIMULATION",
    },
  });
}
