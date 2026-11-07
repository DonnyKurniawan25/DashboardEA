import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  SESSION_COOKIE_NAME,
  verifySessionToken,
} from "@/lib/auth";

// Paths that never require authentication
const PUBLIC_PATHS = [
  "/login",
  "/api/auth/login",
  "/api/auth/logout",
  "/api/health",
];

export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // 1. Allow public static assets and files
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.match(/\.(png|jpg|jpeg|gif|svg|webp|ico|css|js)$/)
  ) {
    return NextResponse.next();
  }

  // 2. Read session cookie
  const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const sessionUser = sessionCookie ? await verifySessionToken(sessionCookie) : null;
  const isAuthenticated = !!sessionUser;

  // 3. Handle /login page:
  // If user is already authenticated, redirect to dashboard
  if (pathname === "/login") {
    if (isAuthenticated) {
      const redirectUrl = request.nextUrl.searchParams.get("redirect") || "/";
      return NextResponse.redirect(new URL(redirectUrl, request.url));
    }
    return NextResponse.next();
  }

  // 4. Handle public auth endpoints
  if (PUBLIC_PATHS.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  // 5. Protect API routes:
  // Return 401 Unauthorized JSON instead of redirecting
  if (pathname.startsWith("/api/")) {
    // Let /api/auth/me pass so client can check its own status
    if (pathname === "/api/auth/me") {
      return NextResponse.next();
    }

    if (!isAuthenticated) {
      return NextResponse.json(
        {
          error: "Unauthorized",
          message: "Akses ditolak. Sesi tidak valid atau telah kedaluwarsa.",
        },
        { status: 401 }
      );
    }

    // Attach user role & id to request headers for API handlers
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-user-id", sessionUser.id);
    requestHeaders.set("x-user-role", sessionUser.role);
    requestHeaders.set("x-user-email", sessionUser.email);

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  // 6. Protect Dashboard pages:
  // If not authenticated, redirect to /login with redirect query param
  if (!isAuthenticated) {
    const loginUrl = new URL("/login", request.url);
    if (pathname !== "/") {
      loginUrl.searchParams.set("redirect", `${pathname}${search}`);
    }
    return NextResponse.redirect(loginUrl);
  }

  // 7. Authenticated: attach user headers and proceed
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-user-id", sessionUser.id);
  requestHeaders.set("x-user-role", sessionUser.role);
  requestHeaders.set("x-user-email", sessionUser.email);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};

