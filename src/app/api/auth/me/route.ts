import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const token = req.cookies.get(SESSION_COOKIE_NAME)?.value;
  if (!token) {
    return NextResponse.json(
      { authenticated: false, user: null },
      { status: 401 }
    );
  }

  const user = await verifySessionToken(token);
  if (!user) {
    return NextResponse.json(
      { authenticated: false, user: null },
      { status: 401 }
    );
  }

  return NextResponse.json({
    authenticated: true,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      accountNumber: user.accountNumber,
      server: user.server,
    },
  });
}

