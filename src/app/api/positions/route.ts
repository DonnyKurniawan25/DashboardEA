import { NextRequest, NextResponse } from "next/server";
import { getDemoPositions } from "@/services/demo-data";
import type { OpenPosition } from "@/types";

export async function GET() {
  const positions = getDemoPositions();
  return NextResponse.json(positions, {
    headers: {
      "Cache-Control": "no-store, max-age=0",
      "X-Data-Source": "DEMO_SIMULATION",
    },
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const ticket = body.ticket || String(Math.floor(10000000 + Math.random() * 90000000));
    const newPos: OpenPosition = {
      ticket,
      symbol: body.symbol || "XAUUSDm",
      type: body.type || "BUY",
      lots: Number(body.lots || 0.01),
      entryPrice: Number(body.entryPrice || 2685.20),
      currentPrice: Number(body.currentPrice || body.entryPrice || 2685.20),
      stopLoss: body.stopLoss !== undefined ? Number(body.stopLoss) : null,
      takeProfit: body.takeProfit !== undefined ? Number(body.takeProfit) : null,
      floatingPnL: Number(body.floatingPnL || 0),
      floatingPips: Number(body.floatingPips || 0),
      duration: 0,
      strategy: body.strategy || "EA-Nevan Scalper",
      openTime: new Date().toISOString(),
      commission: -(Number(body.lots || 0.01) * 2),
      swap: 0,
    };

    return NextResponse.json({ success: true, position: newPos }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Invalid request payload" }, { status: 400 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.ticket) {
      return NextResponse.json({ error: "Ticket is required" }, { status: 400 });
    }
    return NextResponse.json({ success: true, updated: body });
  } catch (error) {
    return NextResponse.json({ error: "Invalid request payload" }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const ticket = searchParams.get("ticket");
  return NextResponse.json({ success: true, closedTicket: ticket, message: "Position closed successfully" });
}
