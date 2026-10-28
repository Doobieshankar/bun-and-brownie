import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/db";
import { products } from "@/db/schema";
import { jsonError, requireAdmin, requireDatabase } from "@/lib/api";
import { getAllProducts, slugify } from "@/lib/content";

export async function GET() {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;
  const missingDb = requireDatabase();
  if (missingDb) return missingDb;

  const items = await getAllProducts();
  return NextResponse.json({ products: items });
}

export async function POST(request: NextRequest) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;
  const missingDb = requireDatabase();
  if (missingDb) return missingDb;

  const body = await request.json();
  const name = String(body.name ?? "").trim();
  const description = String(body.description ?? "").trim();
  const price = String(body.price ?? "").trim();
  const imageUrl =
    body.imageUrl === null || body.imageUrl === undefined
      ? null
      : String(body.imageUrl).trim() || null;
  const sortOrder = Number(body.sortOrder ?? 0);
  const isActive = body.isActive !== false;
  const slug = String(body.slug ?? "").trim() || slugify(name);

  if (!name || !price) {
    return jsonError("name and price are required");
  }

  const db = getDb();
  const [created] = await db
    .insert(products)
    .values({
      name,
      slug,
      description,
      price,
      imageUrl,
      sortOrder: Number.isFinite(sortOrder) ? sortOrder : 0,
      isActive,
      updatedAt: new Date(),
    })
    .returning();

  return NextResponse.json({ product: created }, { status: 201 });
}
