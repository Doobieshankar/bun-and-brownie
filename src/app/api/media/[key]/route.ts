import { NextRequest, NextResponse } from "next/server";

type Params = { params: Promise<{ key: string }> };

/** Legacy Netlify Blobs media route — kept so old links 404 cleanly. */
export async function GET(_request: NextRequest, { params }: Params) {
  const { key: raw } = await params;
  void raw;
  return NextResponse.json(
    {
      error:
        "This image was hosted on Netlify Blobs. Re-upload it in admin, or use /uploads/… paths.",
    },
    { status: 410 },
  );
}
