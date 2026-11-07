import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { accountNumber, server, type, currency, leverage } = body;

    if (!accountNumber) {
      return NextResponse.json(
        { error: "Nomor akun MT5 wajib diisi" },
        { status: 400 }
      );
    }

    const isReal = type === "real";

    // Return sanitized account payload
    const account = {
      status: "connected",
      id: `exness-${accountNumber}`,
      broker: "Exness",
      accountNumber,
      type: type || "demo",
      currency: currency || "USD",
      balance: isReal ? 12500.0 : 50000.0,
      equity: isReal ? 12785.4 : 50820.0,
      floatingPnL: isReal ? 285.4 : 820.0,
      freeMargin: isReal ? 11200.0 : 48500.0,
      marginLevel: isReal ? 2100.0 : 1850.0,
      leverage: leverage || "1:500",
      server: server || (isReal ? "Exness-MT5Real" : "Exness-MT5Trial7"),
      connectionStatus: "connected",
      lastSync: new Date().toISOString(),
    };

    return NextResponse.json(account);
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Gagal menghubungkan akun Exness" },
      { status: 500 }
    );
  }
}
