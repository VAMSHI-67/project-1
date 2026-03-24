import crypto from "node:crypto";

const json = (status, body) => ({
  statusCode: status,
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify(body)
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed." });
  }

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME || process.env.VITE_CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    return res.status(500).json({ error: "Cloudinary delete API is not configured." });
  }

  const { publicId } = req.body ?? {};
  if (!publicId || typeof publicId !== "string") {
    return res.status(400).json({ error: "publicId is required." });
  }

  const timestamp = Math.floor(Date.now() / 1000);
  const signature = crypto
    .createHash("sha1")
    .update(`public_id=${publicId}&timestamp=${timestamp}${apiSecret}`)
    .digest("hex");

  const payload = new URLSearchParams({
    public_id: publicId,
    timestamp: String(timestamp),
    api_key: apiKey,
    signature
  });

  try {
    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: payload
    });

    const result = await response.json();
    if (!response.ok) {
      return res.status(response.status).json({
        error: result.error?.message || "Cloudinary delete failed."
      });
    }

    return res.status(200).json({ result: result.result || "ok" });
  } catch {
    return res.status(500).json({ error: "Cloudinary delete request failed." });
  }
}
