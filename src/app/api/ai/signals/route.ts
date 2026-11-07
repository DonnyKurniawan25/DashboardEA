import { NextRequest, NextResponse } from "next/server";
import { getDemoAISignals } from "@/services/demo-data";
import type { AISignal } from "@/types";

export async function GET() {
  const signals = getDemoAISignals();
  return NextResponse.json(signals, {
    headers: {
      "Cache-Control": "no-store, max-age=0",
      "X-Data-Source": "DEMO_SIMULATION",
    },
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const id = body.id || `sig-${Date.now()}`;
    const newSig: AISignal = {
      id,
      symbol: body.symbol || "XAUUSD",
      direction: body.direction || "BUY",
      confidence: Number(body.confidence || 85),
      trend: body.trend || "BULLISH",
      timeframe: body.timeframe || "M15",
      reason: body.reason || "AI Neural Pattern Recognition",
      timestamp: new Date().toISOString(),
      status: body.status || "active",
    };
    return NextResponse.json({ success: true, signal: newSig }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Invalid signal payload" }, { status: 400 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    return NextResponse.json({ success: true, updated: body });
  } catch (error) {
    return NextResponse.json({ error: "Invalid signal payload" }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  return NextResponse.json({ success: true, deletedId: id });
}
