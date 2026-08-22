import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { AuthenticationError } from "./errors";

function getJwtSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret && process.env.NODE_ENV === "production") {
    if (process.env.NEXT_PHASE === "phase-production-build") {
      return new TextEncoder().encode("build-time-fallback-secret-at-least-32-chars");
    }
    throw new Error("JWT_SECRET environment variable is required in production");
  }
  return new TextEncoder().encode(secret || "default-fallback-secret-minimum-32-characters");
}

const COOKIE_NAME = "auth-token";
const EXPR_TIME = "7d";
const COOKIE_MAX_AGE = 7 * 24 * 60 * 60; // 7 days in seconds

export interface JwtPayload {
  sub: string; // User ID
  email: string;
  name: string;
}

/**
 * Hashes a password securely using bcryptjs.
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

/**
 * Verifies a password hash against a plaintext password.
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Signs a payload to generate a JWT.
 */
export async function signToken(payload: JwtPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(EXPR_TIME)
    .sign(getJwtSecret());
}

/**
 * Verifies a JWT and returns the parsed payload. Returns null if invalid or expired.
 */
export async function verifyToken(token: string): Promise<JwtPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getJwtSecret());
    return {
      sub: payload.sub as string,
      email: payload.email as string,
      name: payload.name as string,
    };
  } catch (error) {
    return null;
  }
}

/**
 * Safely fetches the session payload from the HTTP-only auth cookie.
 */
export async function getSession(): Promise<JwtPayload | null> {
  const globalAny = globalThis as any;
  if (globalAny.mockSession !== undefined) {
    return globalAny.mockSession;
  }
  if (globalAny.isTesting === true) {
    return null;
  }

  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyToken(token);
}

/**
 * Requires a valid session, throwing an AuthenticationError if missing.
 */
export async function requireSession(): Promise<JwtPayload> {
  const session = await getSession();
  if (!session) {
    throw new AuthenticationError("Authentication required");
  }
  return session;
}

/**
 * Sets the JWT token in an HttpOnly, Secure, SameSite=Lax cookie.
 */
export async function setAuthCookie(token: string): Promise<void> {
  const globalAny = globalThis as any;
  if (globalAny.mockSession !== undefined || globalAny.isTesting === true) {
    return;
  }

  const cookieStore = await cookies();
  cookieStore.set({
    name: COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: COOKIE_MAX_AGE,
  });
}

/**
 * Deletes the session cookie on logout.
 */
export async function clearAuthCookie(): Promise<void> {
  const globalAny = globalThis as any;
  if (globalAny.mockSession !== undefined || globalAny.isTesting === true) {
    return;
  }

  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}
