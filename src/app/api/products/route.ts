import { NextResponse } from "next/server";
import { getActiveProducts } from "@/lib/content";

export async function GET() {
  const items = await getActiveProducts();
  return NextResponse.json({ products: items });
}
