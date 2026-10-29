import { NextRequest, NextResponse } from "next/server";
import { jsonError, requireAdmin } from "@/lib/api";
import { uploadSiteImage } from "@/lib/upload";

export async function POST(request: NextRequest) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  try {
    const form = await request.formData();
    const file = form.get("file");
    if (!(file instanceof File)) {
      return jsonError("file is required");
    }
    if (!file.type.startsWith("image/")) {
      return jsonError("Only image uploads are allowed");
    }
    if (file.size > 6 * 1024 * 1024) {
      return jsonError("Image must be under 6MB");
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const uploaded = await uploadSiteImage(
      buffer,
      file.name || "upload",
      file.type || "image/jpeg",
    );
    return NextResponse.json(uploaded);
  } catch (error) {
    console.error("upload failed", error);
    return jsonError("Upload failed", 500);
  }
}
