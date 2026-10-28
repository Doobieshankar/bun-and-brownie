import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { products } from "@/db/schema";
import { jsonError, requireAdmin, requireDatabase } from "@/lib/api";

export async function POST(request: NextRequest) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;
  const missingDb = requireDatabase();
  if (missingDb) return missingDb;

  const body = await request.json();
  const orderedIds = Array.isArray(body.orderedIds)
    ? body.orderedIds.map((id: unknown) => Number(id))
    : [];

  if (orderedIds.length === 0 || orderedIds.some((id: number) => !Number.isFinite(id))) {
    return jsonError("orderedIds must be a non-empty number array");
  }

  const db = getDb();
  await Promise.all(
    orderedIds.map((id: number, index: number) =>
      db
        .update(products)
        .set({ sortOrder: index, updatedAt: new Date() })
        .where(eq(products.id, id)),
    ),
  );

  return NextResponse.json({ ok: true });
}
