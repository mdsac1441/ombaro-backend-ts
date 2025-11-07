import { Elysia, t } from "elysia";
import { cors } from "@elysiajs/cors";
import crypto from "crypto";



export function generateCloudinarySignature(
  params: Record<string, string | number>
) {
  const sortedParams = Object.keys(params)
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join("&");

  const signature = crypto
    .createHash("sha1")
    .update(sortedParams + Bun.env.CLOUDINARY_API_SECRET)
    .digest("hex");

  return { signature, sortedParams };
}

export const uploadToCloudinaryV2 = async (file: File, userId?: string) => {
  const isImage = file.type.startsWith("image/");
  if (!isImage) {
    throw new Error("Unsupported file type");
  }

  if (file.size > 5 * 1024 * 1024) {
    throw new Error("File too large (max 5MB)");
  }
  const timestamp = Math.floor(Date.now() / 1000);
  const folder = userId ? `kyc_uploads/${userId}` : "anonymous_uploads";

  const { signature } = generateCloudinarySignature({
    timestamp,
    folder,
  });
  const formData = new FormData();

  formData.append("file", file);
  formData.append("api_key", `${Bun.env.CLOUDINARY_API_KEY}`);
  formData.append("timestamp", timestamp.toString());
  formData.append("signature", signature);
  formData.append("folder", folder);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${Bun.env.CLOUDINARY_CLOUD_NAME}/image/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Cloudinary upload failed: ${errText}`);
  }

  const result = await res.json();

  return {
    secure_url: result.secure_url,
    public_id: result.public_id,
    format: result.format,
    width: result.width,
    height: result.height,
  };
};
