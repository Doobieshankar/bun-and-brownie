import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { featuredCombo } from "@/db/schema";
import { jsonError, requireAdmin, requireDatabase } from "@/lib/api";
import { getFeaturedCombo } from "@/lib/content";

export async function GET() {
  const combo = await getFeaturedCombo();
  return NextResponse.json({ combo });
}

export async function PUT(request: NextRequest) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;
  const missingDb = requireDatabase();
  if (missingDb) return missingDb;

  const body = await request.json();
  const eyebrow = String(body.eyebrow ?? "").trim();
  const headline = String(body.headline ?? "").trim();
  const title = String(body.title ?? "").trim();
  const price = String(body.price ?? "").trim();
  const note = String(body.note ?? "").trim();
  const imageUrl =
    body.imageUrl === null || body.imageUrl === undefined
      ? null
      : String(body.imageUrl).trim() || null;
  const whatsappText = String(body.whatsappText ?? "").trim();

  if (!eyebrow || !headline || !title || !price) {
    return jsonError("eyebrow, headline, title, and price are required");
  }

  const db = getDb();
  const existing = await db.select().from(featuredCombo).limit(1);
  const values = {
    eyebrow,
    headline,
    title,
    price,
    note,
    imageUrl,
    whatsappText,
    updatedAt: new Date(),
  };

  if (existing[0]) {
    await db
      .update(featuredCombo)
      .set(values)
      .where(eq(featuredCombo.id, existing[0].id));
  } else {
    await db.insert(featuredCombo).values(values);
  }

  const combo = await getFeaturedCombo();
  return NextResponse.json({ combo });
}
