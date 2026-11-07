import { NextRequest, NextResponse } from "next/server";
import { getDemoAccounts } from "@/services/demo-data";
import type { TradingAccount } from "@/types";

export async function GET() {
  const accounts = getDemoAccounts();
  return NextResponse.json(accounts, {
    headers: {
      "Cache-Control": "no-store, max-age=0",
      "X-Data-Source": "DEMO_SIMULATION",
    },
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const id = body.id || `acc-${Date.now()}`;
    const newAcc: TradingAccount = {
      id,
      broker: body.broker || "Exness",
      accountNumber: body.accountNumber || String(Math.floor(10000000 + Math.random() * 90000000)),
      type: body.type || "demo",
      currency: body.currency || "USD",
      balance: Number(body.balance || 10000),
      equity: Number(body.equity || body.balance || 10000),
      floatingPnL: Number(body.floatingPnL || 0),
      freeMargin: Number(body.freeMargin || 9000),
      marginLevel: Number(body.marginLevel || 1500),
      leverage: body.leverage || "1:500",
      server: body.server || "Exness-MT5Trial7",
      connectionStatus: body.connectionStatus || "connected",
      lastSync: new Date().toISOString(),
    };
    return NextResponse.json({ success: true, account: newAcc }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Invalid account payload" }, { status: 400 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    return NextResponse.json({ success: true, updated: body });
  } catch (error) {
    return NextResponse.json({ error: "Invalid account payload" }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  return NextResponse.json({ success: true, deletedId: id });
}
