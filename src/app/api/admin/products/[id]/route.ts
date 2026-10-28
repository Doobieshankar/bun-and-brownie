import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { products } from "@/db/schema";
import { jsonError, requireAdmin, requireDatabase } from "@/lib/api";
import { slugify } from "@/lib/content";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(request: NextRequest, { params }: Params) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;
  const missingDb = requireDatabase();
  if (missingDb) return missingDb;

  const { id: idParam } = await params;
  const id = Number(idParam);
  if (!Number.isFinite(id)) return jsonError("Invalid id");

  const body = await request.json();
  const patch: Partial<typeof products.$inferInsert> = {
    updatedAt: new Date(),
  };

  if (body.name !== undefined) patch.name = String(body.name).trim();
  if (body.description !== undefined) {
    patch.description = String(body.description).trim();
  }
  if (body.price !== undefined) patch.price = String(body.price).trim();
  if (body.imageUrl !== undefined) {
    patch.imageUrl =
      body.imageUrl === null ? null : String(body.imageUrl).trim() || null;
  }
  if (body.sortOrder !== undefined) {
    const sortOrder = Number(body.sortOrder);
    patch.sortOrder = Number.isFinite(sortOrder) ? sortOrder : 0;
  }
  if (body.isActive !== undefined) patch.isActive = Boolean(body.isActive);
  if (body.slug !== undefined) {
    patch.slug = String(body.slug).trim() || slugify(String(body.name ?? ""));
  } else if (body.name !== undefined) {
    patch.slug = slugify(String(body.name));
  }

  if (patch.name !== undefined && !patch.name) {
    return jsonError("name cannot be empty");
  }
  if (patch.price !== undefined && !patch.price) {
    return jsonError("price cannot be empty");
  }

  const db = getDb();
  const [updated] = await db
    .update(products)
    .set(patch)
    .where(eq(products.id, id))
    .returning();

  if (!updated) return jsonError("Product not found", 404);
  return NextResponse.json({ product: updated });
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;
  const missingDb = requireDatabase();
  if (missingDb) return missingDb;

  const { id: idParam } = await params;
  const id = Number(idParam);
  if (!Number.isFinite(id)) return jsonError("Invalid id");

  const db = getDb();
  const [removed] = await db
    .delete(products)
    .where(eq(products.id, id))
    .returning();

  if (!removed) return jsonError("Product not found", 404);
  return NextResponse.json({ ok: true });
}
