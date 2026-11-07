import { NextRequest, NextResponse } from "next/server";
import {
  SESSION_COOKIE_NAME,
  SESSION_MAX_AGE,
  createSessionToken,
  validateSuperadminCredentials,
  validateExnessCredentials,
} from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      loginType = "platform",
      email,
      password,
      accountNumber,
      server,
      type = "demo",
      currency,
      leverage,
    } = body;

    let authResult;

    if (loginType === "platform") {
      if (!email || !password) {
        return NextResponse.json(
          { success: false, error: "Email dan password wajib diisi." },
          { status: 400 }
        );
      }
      authResult = validateSuperadminCredentials(email, password);
    } else if (loginType === "exness") {
      if (!accountNumber) {
        return NextResponse.json(
          { success: false, error: "Nomor akun MT5 Exness wajib diisi." },
          { status: 400 }
        );
      }
      authResult = validateExnessCredentials(accountNumber, server, type);
    } else {
      return NextResponse.json(
        { success: false, error: "Metode login tidak dikenali." },
        { status: 400 }
      );
    }

    if (!authResult.success || !authResult.user) {
      return NextResponse.json(
        { success: false, error: authResult.error || "Autentikasi gagal." },
        { status: 401 }
      );
    }

    // Generate cryptographically signed JWT token
    const token = await createSessionToken({
      id: authResult.user.id,
      name: authResult.user.name,
      email: authResult.user.email,
      role: authResult.user.role,
      accountNumber: authResult.user.accountNumber,
      server: authResult.user.server,
    });

    const isProduction = process.env.NODE_ENV === "production";

    // Set secure HttpOnly cookie
    const response = NextResponse.json({
      success: true,
      user: authResult.user,
      message: `Login berhasil sebagai ${authResult.user.role.toUpperCase()}`,
    });

    response.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: isProduction,
      sameSite: "lax",
      maxAge: SESSION_MAX_AGE,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Login API error:", error);
    return NextResponse.json(
      { success: false, error: "Terjadi kesalahan internal pada server autentikasi." },
      { status: 500 }
    );
  }
}

