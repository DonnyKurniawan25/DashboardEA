import { NextRequest, NextResponse } from "next/server";
import { getDemoTradeHistory } from "@/services/demo-data";
import type { TradeOrder } from "@/types";

export async function GET() {
  const orders = getDemoTradeHistory();
  return NextResponse.json(orders, {
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
    const newOrder: TradeOrder = {
      ticket,
      symbol: body.symbol || "XAUUSDm",
      type: body.type || "BUY",
      lots: Number(body.lots || 0.05),
      entryPrice: Number(body.entryPrice || 2680.10),
      closePrice: body.closePrice !== undefined ? Number(body.closePrice) : null,
      stopLoss: body.stopLoss !== undefined ? Number(body.stopLoss) : null,
      takeProfit: body.takeProfit !== undefined ? Number(body.takeProfit) : null,
      profit: Number(body.profit || 0),
      commission: -(Number(body.lots || 0.05) * 2),
      swap: 0,
      openTime: body.openTime || new Date(Date.now() - 3600000).toISOString(),
      closeTime: body.closeTime || new Date().toISOString(),
      status: body.status || "closed",
      strategy: body.strategy || "Manual Entry",
      duration: 3600,
    };
    return NextResponse.json({ success: true, order: newOrder }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Invalid order payload" }, { status: 400 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    return NextResponse.json({ success: true, updated: body });
  } catch (error) {
    return NextResponse.json({ error: "Invalid order payload" }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const ticket = searchParams.get("ticket");
  return NextResponse.json({ success: true, deletedTicket: ticket });
}
