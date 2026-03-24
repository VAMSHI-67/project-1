import { useEffect, useMemo, useState } from "react";
import { Button } from "../../components/shared/Button";
import { Card } from "../../components/shared/Card";
import {
  cleanupMediaCategory,
  createWalkthroughImage,
  deleteWalkthroughImage,
  migrateLegacyMediaCategories,
  subscribeMediaByCategory,
  updateWalkthroughOrder
} from "../../lib/firestore";
import { deleteWalkthroughAsset, uploadWalkthroughImage } from "../../lib/storage";
import { MediaCategory, WalkthroughImage } from "../../lib/types";
import { AdminHeader } from "../../components/admin/AdminHeader";

export const AdminWalkthroughPage = () => {
  const [images, setImages] = useState<WalkthroughImage[]>([]);
  const [category, setCategory] = useState<MediaCategory>("walkthrough");
  const [file, setFile] = useState<File | null>(null);
  const [caption, setCaption] = useState("");
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const orderField = category === "walkthrough" ? "order" : "createdAt";
    const orderDirection = category === "walkthrough" ? "asc" : "desc";
    const unsubscribe = subscribeMediaByCategory(category, setImages, orderField, orderDirection);
    return () => unsubscribe();
  }, [category]);

  const nextOrder = useMemo(() => {
    if (!images.length) return 1;
    return Math.max(...images.map((image) => image.order)) + 1;
  }, [images]);

  const retentionByCategory: Record<MediaCategory, number> = {
    hero: 2,
    walkthrough: 8,
    rooms: 8,
    secondary: 5
  };

  const handleUpload = async (event: React.FormEvent) => {
    event.preventDefault();
    setMessage(null);
    if (!file) {
      setError("Select an image to upload.");
      return;
    }
    setError(null);
    setUploading(true);
    setProgress(0);
    try {
      const { url, storagePath } = await uploadWalkthroughImage(file, setProgress);
      const trimmedCaption = caption.trim();
      const createdId = await createWalkthroughImage({
        url,
        storagePath,
        order: nextOrder,
        category,
        ...(trimmedCaption ? { caption: trimmedCaption } : {})
      });

      const keepCount = retentionByCategory[category];
      const deleted = await cleanupMediaCategory(category, keepCount, [createdId]);
      for (const item of deleted) {
        try {
          await deleteWalkthroughAsset(item.storagePath);
        } catch {
          // Ignore storage cleanup failures for older assets.
        }
      }

      setFile(null);
      setCaption("");
    } catch (uploadError) {
      const messageText =
        uploadError instanceof Error ? uploadError.message : "Upload failed. Please try again.";
      setError(messageText);
    } finally {
      setUploading(false);
      setProgress(null);
    }
  };

  const handleMigration = async () => {
    setError(null);
    setMessage(null);
    try {
      const migrated = await migrateLegacyMediaCategories("walkthrough");
      if (migrated) {
        setMessage(`Migrated ${migrated} legacy image${migrated === 1 ? "" : "s"}.`);
      } else {
        setMessage("No legacy images found to migrate.");
      }
    } catch {
      setError("Migration failed. Please try again.");
    }
  };

  const moveImage = async (index: number, direction: "up" | "down") => {
    if (category !== "walkthrough") return;
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= images.length) return;
    const reordered = [...images];
    [reordered[index], reordered[targetIndex]] = [reordered[targetIndex], reordered[index]];
    const normalized = reordered.map((image, idx) => ({ ...image, order: idx + 1 }));
    await updateWalkthroughOrder(normalized);
  };

  const handleDelete = async (image: WalkthroughImage) => {
    await deleteWalkthroughImage(image.id);
    try {
      await deleteWalkthroughAsset(image.storagePath);
    } catch {
      // Storage cleanup failure should not block admin UI.
    }
  };

  return (
    <div className="section-padding space-y-8">
      <AdminHeader
        eyebrow="Media Library"
        title="Manage farmhouse imagery"
        description="Upload images and tag them as hero, walkthrough, rooms, or secondary."
      />

      <Card>
        <h2 className="font-display text-2xl text-forest-900">Upload new image</h2>
        <form onSubmit={handleUpload} className="mt-4 grid gap-4 lg:grid-cols-[1fr_1fr_220px_auto]">
          <label className="space-y-2 text-sm font-medium text-forest-700">
            Image file
            <input
              type="file"
              accept="image/*"
              onChange={(event) => setFile(event.target.files?.[0] ?? null)}
              className="w-full rounded-xl border border-forest-100 bg-white/80 px-4 py-3"
            />
          </label>
          <label className="space-y-2 text-sm font-medium text-forest-700">
            Caption (optional)
            <input
              value={caption}
              onChange={(event) => setCaption(event.target.value)}
              className="w-full rounded-xl border border-forest-100 bg-white/80 px-4 py-3"
              placeholder="Pool deck at sunset"
            />
          </label>
          <label className="space-y-2 text-sm font-medium text-forest-700">
            Category
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value as MediaCategory)}
              className="w-full rounded-xl border border-forest-100 bg-white/80 px-4 py-3"
            >
              <option value="hero">Hero</option>
              <option value="walkthrough">Walkthrough</option>
              <option value="rooms">Rooms</option>
              <option value="secondary">Secondary</option>
            </select>
          </label>
          <div className="flex items-end">
            <Button type="submit" disabled={uploading}>
              {uploading ? "Uploading..." : "Upload"}
            </Button>
          </div>
        </form>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <Button type="button" variant="outline" onClick={handleMigration}>
            Migrate legacy walkthrough images
          </Button>
          {progress !== null && (
            <p className="text-sm text-forest-600">Uploading... {progress}%</p>
          )}
          {error && <p className="text-sm text-red-600">{error}</p>}
          {message && <p className="text-sm text-emerald-700">{message}</p>}
        </div>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        {images.map((image, index) => (
          <div key={image.id} className="glass-card overflow-hidden rounded-3xl">
            <img src={image.url} alt={image.caption || "Walkthrough image"} className="h-56 w-full object-cover" />
            <div className="space-y-3 p-4">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-forest-500">Order {image.order}</p>
                <p className="text-sm text-forest-700">{image.caption || "No caption"}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {category === "walkthrough" && (
                  <>
                    <Button
                      variant="outline"
                      onClick={() => moveImage(index, "up")}
                      disabled={index === 0}
                    >
                      Move up
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => moveImage(index, "down")}
                      disabled={index === images.length - 1}
                    >
                      Move down
                    </Button>
                  </>
                )}
                <Button variant="ghost" onClick={() => handleDelete(image)}>
                  Delete
                </Button>
              </div>
            </div>
          </div>
        ))}
        {!images.length && (
          <div className="rounded-3xl border border-forest-100 bg-white/80 p-6 text-sm text-forest-600">
            No walkthrough images yet. Upload your first photo above.
          </div>
        )}
      </div>
    </div>
  );
};
