import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

const COOKIE_NAME = "bb_admin_session";
const MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

function getSecrets() {
  const password = process.env.ADMIN_PASSWORD;
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!password || !secret) {
    throw new Error("ADMIN_PASSWORD and ADMIN_SESSION_SECRET must be set");
  }
  return { password, secret };
}

function sign(value: string, secret: string) {
  return createHmac("sha256", secret).update(value).digest("hex");
}

export function createAdminSessionToken() {
  const { secret } = getSecrets();
  const issuedAt = Date.now().toString();
  const payload = `ok.${issuedAt}`;
  return `${payload}.${sign(payload, secret)}`;
}

export function verifyAdminSessionToken(token: string | undefined | null) {
  if (!token) return false;
  try {
    const { secret } = getSecrets();
    const parts = token.split(".");
    if (parts.length !== 3) return false;
    const [status, issuedAt, signature] = parts;
    if (status !== "ok" || !issuedAt || !signature) return false;
    const payload = `${status}.${issuedAt}`;
    const expected = sign(payload, secret);
    const a = Buffer.from(signature);
    const b = Buffer.from(expected);
    if (a.length !== b.length || !timingSafeEqual(a, b)) return false;
    const ageMs = Date.now() - Number(issuedAt);
    if (!Number.isFinite(ageMs) || ageMs < 0 || ageMs > MAX_AGE_SECONDS * 1000) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

export function checkAdminPassword(candidate: string) {
  const { password } = getSecrets();
  const a = Buffer.from(candidate);
  const b = Buffer.from(password);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export async function isAdminAuthenticated() {
  try {
    const jar = await cookies();
    return verifyAdminSessionToken(jar.get(COOKIE_NAME)?.value);
  } catch {
    return false;
  }
}

export function adminCookieOptions(token: string) {
  return {
    name: COOKIE_NAME,
    value: token,
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  };
}

export function clearAdminCookieOptions() {
  return {
    name: COOKIE_NAME,
    value: "",
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  };
}

export { COOKIE_NAME };
