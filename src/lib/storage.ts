const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

type CloudinaryImageOptions = {
  width?: number;
  height?: number;
  crop?: "fill" | "fit" | "limit" | "pad" | "scale";
  quality?: string;
  format?: string;
};

const CLOUDINARY_UPLOAD_SEGMENT = "/upload/";

export const getCloudinaryImageUrl = (url: string, options: CloudinaryImageOptions = {}) => {
  if (!url.includes(CLOUDINARY_UPLOAD_SEGMENT)) {
    return url;
  }

  const transformations = [
    options.crop ? `c_${options.crop}` : null,
    typeof options.width === "number" ? `w_${options.width}` : null,
    typeof options.height === "number" ? `h_${options.height}` : null,
    options.quality ? `q_${options.quality}` : null,
    options.format ? `f_${options.format}` : null
  ]
    .filter(Boolean)
    .join(",");

  if (!transformations) {
    return url;
  }

  return url.replace(CLOUDINARY_UPLOAD_SEGMENT, `${CLOUDINARY_UPLOAD_SEGMENT}${transformations}/`);
};

export const uploadWalkthroughImage = async (
  file: File,
  onProgress?: (percent: number) => void
) => {
  if (!cloudName || !uploadPreset) {
    throw new Error("Cloudinary is not configured. Set VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET.");
  }

  const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);
  formData.append("folder", "kanvera/walkthrough");

  const xhr = new XMLHttpRequest();

  const response = await new Promise<{ secure_url: string; public_id: string }>((resolve, reject) => {
    xhr.upload.onprogress = (event) => {
      if (!onProgress || !event.lengthComputable) return;
      const percent = Math.round((event.loaded / event.total) * 100);
      onProgress(percent);
    };
    xhr.onerror = () => reject(new Error("Upload failed. Please try again."));
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(JSON.parse(xhr.responseText) as { secure_url: string; public_id: string });
      } else {
        reject(new Error(xhr.responseText || "Upload failed. Please try again."));
      }
    };
    xhr.open("POST", uploadUrl);
    xhr.send(formData);
  });

  return { url: response.secure_url, storagePath: response.public_id };
};

export const deleteWalkthroughAsset = async (_storagePath: string) => {
  const response = await fetch("/api/cloudinary-delete", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ publicId: _storagePath })
  });

  if (!response.ok) {
    let message = "Delete failed. Please try again.";
    try {
      const data = (await response.json()) as { error?: string };
      if (data.error) {
        message = data.error;
      }
    } catch {
      // Fall back to the generic message if the response body is not JSON.
    }
    throw new Error(message);
  }
};
