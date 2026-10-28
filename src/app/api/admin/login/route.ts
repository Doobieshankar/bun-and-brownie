import { NextRequest, NextResponse } from "next/server";
import {
  adminCookieOptions,
  checkAdminPassword,
  createAdminSessionToken,
} from "@/lib/admin-auth";
import { jsonError } from "@/lib/api";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const password = String(body.password ?? "");
    if (!password) return jsonError("Password required");
    if (!checkAdminPassword(password)) {
      return jsonError("Invalid password", 401);
    }
    const token = createAdminSessionToken();
    const response = NextResponse.json({ ok: true });
    response.cookies.set(adminCookieOptions(token));
    return response;
  } catch (error) {
    console.error("admin login failed", error);
    return jsonError("Admin auth is not configured", 503);
  }
}
