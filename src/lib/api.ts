import { NextResponse } from "next/server";
import { hasDatabase } from "@/db";
import { isAdminAuthenticated } from "@/lib/admin-auth";

export function jsonError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

export async function requireAdmin() {
  const ok = await isAdminAuthenticated();
  if (!ok) {
    return jsonError("Unauthorized", 401);
  }
  return null;
}

export function requireDatabase() {
  if (!hasDatabase()) {
    return jsonError("DATABASE_URL is not configured", 503);
  }
  return null;
}
