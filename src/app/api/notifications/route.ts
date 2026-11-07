import { NextRequest, NextResponse } from "next/server";
import { getDemoNotifications } from "@/services/demo-data";
import type { Notification } from "@/types";

export async function GET() {
  const notifications = getDemoNotifications();
  return NextResponse.json(notifications, {
    headers: {
      "Cache-Control": "no-store, max-age=0",
      "X-Data-Source": "DEMO_SIMULATION",
    },
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const id = body.id || `notif-${Date.now()}`;
    const newNotif: Notification = {
      id,
      type: body.type || "TRADE_OPENED",
      title: body.title || "Notifikasi Sistem",
      message: body.message || "",
      timestamp: new Date().toISOString(),
      read: false,
      severity: body.severity || "info",
    };
    return NextResponse.json({ success: true, notification: newNotif }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Invalid notification payload" }, { status: 400 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    return NextResponse.json({ success: true, updated: body });
  } catch (error) {
    return NextResponse.json({ error: "Invalid notification payload" }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  return NextResponse.json({ success: true, deletedId: id });
}
