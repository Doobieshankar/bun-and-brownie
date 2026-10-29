import { getStore } from "@netlify/blobs";
import { uploadImageBuffer } from "@/lib/cloudinary";

function cloudinaryReady() {
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET,
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

  const key = safeKey(filename);
  const store = getStore({ name: "bb-uploads", consistency: "strong" });
  await store.set(key, new Uint8Array(buffer), {
    metadata: { contentType: mimeType, filename },
  });

  return {
    url: `/api/media/${encodeURIComponent(key)}`,
    publicId: key,
  };
}
