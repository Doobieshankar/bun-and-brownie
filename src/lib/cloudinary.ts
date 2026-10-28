import { v2 as cloudinary } from "cloudinary";

export function configureCloudinary() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error("Cloudinary env vars are not configured");
  }
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  });
  return cloudinary;
}

export async function uploadImageBuffer(
  buffer: Buffer,
  filename: string,
  mimeType = "image/jpeg",
  folder = "bun-and-brownie",
) {
  const client = configureCloudinary();
  const dataUri = `data:${mimeType};base64,${buffer.toString("base64")}`;
  const safeName = filename
    .replace(/\.[^.]+$/, "")
    .toLowerCase()
    .replace(/[^a-z0-9-_]+/g, "-")
    .slice(0, 80);
  const result = await client.uploader.upload(dataUri, {
    folder,
    public_id: safeName || undefined,
    overwrite: false,
    resource_type: "image",
  });
  return {
    url: result.secure_url as string,
    publicId: result.public_id as string,
  };
}
