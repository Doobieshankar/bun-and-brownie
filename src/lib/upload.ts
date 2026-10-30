import { put } from "@vercel/blob";
import { uploadImageBuffer } from "@/lib/cloudinary";

function cloudinaryReady() {
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET,
  );
}

function vercelBlobReady() {
  return Boolean(
    process.env.BLOB_READ_WRITE_TOKEN ||
      process.env.BLOB_STORE_ID ||
      process.env.VERCEL,
  );
}

function safeKey(filename: string) {
  const base = filename
    .replace(/\.[^.]+$/, "")
    .toLowerCase()
    .replace(/[^a-z0-9-_]+/g, "-")
    .slice(0, 60);
  return `${Date.now()}-${base || "image"}`;
}

export async function uploadSiteImage(
  buffer: Buffer,
  filename: string,
  mimeType = "image/jpeg",
) {
  if (cloudinaryReady()) {
    return uploadImageBuffer(buffer, filename, mimeType);
  }

  if (vercelBlobReady()) {
    const key = safeKey(filename);
    const ext = mimeType.includes("png")
      ? "png"
      : mimeType.includes("webp")
        ? "webp"
        : "jpg";
    const blob = await put(`bun-and-brownie/${key}.${ext}`, buffer, {
      access: "public",
      contentType: mimeType,
      addRandomSuffix: false,
    });
    return {
      url: blob.url,
      publicId: key,
    };
  }

  throw new Error(
    "Image upload is not configured. Set BLOB_READ_WRITE_TOKEN (Vercel Blob) or Cloudinary env vars, or paste an image URL.",
  );
}
