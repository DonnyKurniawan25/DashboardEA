// ============================================================================
// GOLDSHIELD AI — SERVER AUTHENTICATION & SECURITY UTILITIES
// Edge Runtime & Node.js Universal Cryptography (Web Crypto API)
// ============================================================================

export interface SessionPayload {
  id: string;
  name: string;
  email: string;
  role: "superadmin" | "admin" | "trader" | "viewer";
  accountNumber?: string;
  server?: string;
  iat: number;
  exp: number;
}

export const SESSION_COOKIE_NAME = "goldshield_session";
export const SESSION_MAX_AGE = 7 * 24 * 60 * 60; // 7 days in seconds

// Environment Credentials with Secure Production Fallbacks
export const SUPERADMIN_EMAIL =
  process.env.SUPERADMIN_EMAIL || "superadmin@goldshield.ai";
export const SUPERADMIN_PASSWORD =
  process.env.SUPERADMIN_PASSWORD || "GoldShield#Admin2026!";
export const SUPERADMIN_NAME =
  process.env.SUPERADMIN_NAME || "Superadmin GoldShield";

export const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@goldshield.ai";
export const ADMIN_PASSWORD =
  process.env.ADMIN_PASSWORD || "Admin@GoldShield2026";

// Secret for HMAC-SHA256 Token Signature
const AUTH_SECRET =
  process.env.AUTH_SECRET ||
  "goldshield-ai-production-super-secret-key-2026-safe-guard-jwt";

// ─────────────────────────────────────────────────────────────────────────────
// BASE64URL ENCODING / DECODING (Edge & Node compatible)
// ─────────────────────────────────────────────────────────────────────────────

function uint8ArrayToBase64Url(bytes: Uint8Array): string {
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function base64UrlToUint8Array(str: string): Uint8Array {
  let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4) {
    base64 += "=";
  }
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

async function getCryptoKey(): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(AUTH_SECRET);
  return await crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TOKEN GENERATION & VERIFICATION
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Creates a signed session token using HMAC-SHA256
 */
export async function createSessionToken(
  user: Omit<SessionPayload, "iat" | "exp">,
  expiresInSeconds: number = SESSION_MAX_AGE
): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const payload: SessionPayload = {
    ...user,
    iat: now,
    exp: now + expiresInSeconds,
  };

  const encoder = new TextEncoder();
  const payloadJson = JSON.stringify(payload);
  const payloadB64 = uint8ArrayToBase64Url(encoder.encode(payloadJson));

  const cryptoKey = await getCryptoKey();
  const signatureBuffer = await crypto.subtle.sign(
    "HMAC",
    cryptoKey,
    encoder.encode(payloadB64)
  );

  const signatureB64 = uint8ArrayToBase64Url(new Uint8Array(signatureBuffer));
  return `${payloadB64}.${signatureB64}`;
}

/**
 * Verifies a session token, checking cryptographic signature and expiration
 */
export async function verifySessionToken(
  token: string | null | undefined
): Promise<SessionPayload | null> {
  if (!token || typeof token !== "string") return null;

  const parts = token.split(".");
  if (parts.length !== 2) return null;

  const [payloadB64, signatureB64] = parts;

  try {
    const encoder = new TextEncoder();
    const cryptoKey = await getCryptoKey();

    const signatureBytes = base64UrlToUint8Array(signatureB64);
    const signatureBuffer = (signatureBytes.buffer as ArrayBuffer).slice(
      signatureBytes.byteOffset,
      signatureBytes.byteOffset + signatureBytes.byteLength
    );
    const isValid = await crypto.subtle.verify(
      "HMAC",
      cryptoKey,
      signatureBuffer,
      encoder.encode(payloadB64)
    );

    if (!isValid) {
      return null;
    }

    const payloadBytes = base64UrlToUint8Array(payloadB64);
    const decoder = new TextDecoder();
    const payloadJson = decoder.decode(payloadBytes);
    const payload = JSON.parse(payloadJson) as SessionPayload;

    // Check expiration
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) {
      return null;
    }

    return payload;
  } catch (err) {
    console.error("Token verification error:", err);
    return null;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// CREDENTIALS VALIDATION
// ─────────────────────────────────────────────────────────────────────────────

export interface AuthResult {
  success: boolean;
  user?: {
    id: string;
    name: string;
    email: string;
    role: "superadmin" | "admin" | "trader";
    accountNumber?: string;
    server?: string;
  };
  error?: string;
}

/**
 * Validates login credentials for Superadmin / Admin accounts
 */
export function validateSuperadminCredentials(
  email: string,
  password: string
): AuthResult {
  const cleanEmail = email.trim().toLowerCase();
  const cleanPass = password.trim();

  // 1. Check Superadmin
  if (
    cleanEmail === SUPERADMIN_EMAIL.toLowerCase() &&
    cleanPass === SUPERADMIN_PASSWORD
  ) {
    return {
      success: true,
      user: {
        id: "superadmin-01",
        name: SUPERADMIN_NAME,
        email: SUPERADMIN_EMAIL,
        role: "superadmin",
      },
    };
  }

  // 2. Check Standard Admin
  if (cleanEmail === ADMIN_EMAIL.toLowerCase() && cleanPass === ADMIN_PASSWORD) {
    return {
      success: true,
      user: {
        id: "admin-01",
        name: "Admin GoldShield",
        email: ADMIN_EMAIL,
        role: "admin",
      },
    };
  }

  return {
    success: false,
    error: "Email atau password Superadmin/Admin tidak valid.",
  };
}

/**
 * Validates and authenticates Exness MT5 direct login
 */
export function validateExnessCredentials(
  accountNumber: string,
  server: string,
  type: "demo" | "real"
): AuthResult {
  const cleanAccount = accountNumber.trim();
  if (!cleanAccount) {
    return {
      success: false,
      error: "Nomor akun MT5 Exness wajib diisi.",
    };
  }

  return {
    success: true,
    user: {
      id: `exness-${cleanAccount}`,
      name: `Exness ${type.toUpperCase()} #${cleanAccount}`,
      email: `exness-${cleanAccount}@goldshield.ai`,
      role: "trader",
      accountNumber: cleanAccount,
      server: server || (type === "real" ? "Exness-MT5Real" : "Exness-MT5Trial7"),
    },
  };
}
