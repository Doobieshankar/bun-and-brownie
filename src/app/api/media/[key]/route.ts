import { getStore } from "@netlify/blobs";
import { NextRequest, NextResponse } from "next/server";

type Params = { params: Promise<{ key: string }> };

export async function GET(_request: NextRequest, { params }: Params) {
  const { key: raw } = await params;
  const key = decodeURIComponent(raw || "");
  if (!key || key.includes("..") || key.includes("/")) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  try {
    const store = getStore({ name: "bb-uploads", consistency: "strong" });
    const result = await store.getWithMetadata(key, { type: "arrayBuffer" });
    if (!result) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const contentType =
      (result.metadata?.contentType as string | undefined) || "image/jpeg";

    return new NextResponse(result.data, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("media get failed", error);
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}
