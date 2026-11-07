import { NextRequest, NextResponse } from "next/server";
import { getDemoBotStatus } from "@/services/demo-data";
import type { BotStatus } from "@/types";

export async function GET() {
  const bots = getDemoBotStatus();
  return NextResponse.json(bots, {
    headers: {
      "Cache-Control": "no-store, max-age=0",
      "X-Data-Source": "DEMO_SIMULATION",
    },
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const id = body.id || `bot-${Date.now()}`;
    const newBot: BotStatus = {
      id,
      name: body.name || "EA-Nevan Scalper Pro",
      version: body.version || "1.0",
      symbol: body.symbol || "XAUUSDm",
      strategy: body.strategy || "Scalping Grid",
      activeMode: body.activeMode || "MODERATE",
      status: body.status || "RUNNING",
      currentGridLevel: Number(body.currentGridLevel || 1),
      basketPnL: Number(body.basketPnL || 0),
      totalOpenPositions: Number(body.totalOpenPositions || 0),
      aiConnection: "connected",
      telegramStatus: "connected",
      lastHeartbeat: new Date().toISOString(),
      uptime: 0,
      lastTrade: new Date().toISOString(),
      errorLogs: [],
    };
    return NextResponse.json({ success: true, bot: newBot }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Invalid bot payload" }, { status: 400 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    return NextResponse.json({ success: true, updated: body });
  } catch (error) {
    return NextResponse.json({ error: "Invalid bot payload" }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  return NextResponse.json({ success: true, deletedBotId: id });
}
