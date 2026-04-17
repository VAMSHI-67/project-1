import { useEffect, useMemo, useState } from "react";
import { AdminHeader } from "../../components/admin/AdminHeader";
import { Button } from "../../components/shared/Button";
import { Card } from "../../components/shared/Card";
import {
  cleanupMediaCategory,
  createVenue,
  createWalkthroughImage,
  deleteVenue,
  deleteWalkthroughImage,
  migrateLegacyMediaCategories,
  subscribeMediaByCategory,
  subscribeVenues,
  updateVenue,
  updateWalkthroughOrder
} from "../../lib/firestore";
import { deleteWalkthroughAsset, getCloudinaryImageUrl, uploadWalkthroughImage } from "../../lib/storage";
import { MediaCategory, Venue, WalkthroughImage } from "../../lib/types";

export const AdminWalkthroughPage = () => {
  const [images, setImages] = useState<WalkthroughImage[]>([]);
  const [venues, setVenues] = useState<Venue[]>([]);
  const [category, setCategory] = useState<MediaCategory>("walkthrough");
  const [selectedVenueId, setSelectedVenueId] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [caption, setCaption] = useState("");
  const [venueName, setVenueName] = useState("");
  const [venuePurpose, setVenuePurpose] = useState("");
  const [editingVenueId, setEditingVenueId] = useState<string | null>(null);
  const [savingVenue, setSavingVenue] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeVenues(setVenues);
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (category === "secondary") {
      if (selectedVenueId || !venues.length) return;
      setSelectedVenueId(venues[0].id);
      return;
    }

    if (selectedVenueId) {
      setSelectedVenueId("");
    }
  }, [category, selectedVenueId, venues]);

  useEffect(() => {
    const orderField = category === "walkthrough" ? "order" : "createdAt";
    const orderDirection = category === "walkthrough" ? "asc" : "desc";
    const unsubscribe = subscribeMediaByCategory(
      category,
      (items) => {
        if (category === "secondary" && selectedVenueId) {
          setImages(items.filter((item) => item.venueId === selectedVenueId));
          return;
        }
        setImages(items);
      },
      orderField,
      orderDirection
    );
    return () => unsubscribe();
  }, [category, selectedVenueId]);

  const nextOrder = useMemo(() => {
    if (!images.length) return 1;
    return Math.max(...images.map((image) => image.order)) + 1;
  }, [images]);

  const retentionByCategory: Record<MediaCategory, number> = {
    hero: 2,
    walkthrough: 8,
    secondary: 5
  };

  const selectedVenue = venues.find((venue) => venue.id === selectedVenueId);

  const resetVenueForm = () => {
    setVenueName("");
    setVenuePurpose("");
    setEditingVenueId(null);
  };

  const handleEditVenue = (venue: Venue) => {
    setEditingVenueId(venue.id);
    setVenueName(venue.name);
    setVenuePurpose(venue.purpose ?? "");
    setSelectedVenueId(venue.id);
    setCategory("secondary");
    setError(null);
    setMessage(null);
  };

  const handleSaveVenue = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setMessage(null);

    if (!venueName.trim()) {
      setError("Enter a venue name before saving the section.");
      return;
    }

    setSavingVenue(true);
    try {
      if (editingVenueId) {
        await updateVenue(editingVenueId, {
          name: venueName.trim(),
          purpose: venuePurpose.trim()
        });
        setMessage("Venue section updated successfully.");
      } else {
        const venueId = await createVenue({
          name: venueName.trim(),
          purpose: venuePurpose.trim(),
          isActive: true
        });
        setSelectedVenueId(venueId);
        setMessage("Venue section created successfully.");
      }
      resetVenueForm();
    } catch {
      setError("Unable to save the venue section. Please try again.");
    } finally {
      setSavingVenue(false);
    }
  };

  const handleDeleteVenue = async (venue: Venue) => {
    const shouldDelete = window.confirm(`Delete venue "${venue.name}"? This only works when no secondary images use it.`);
    if (!shouldDelete) return;

    setError(null);
    setMessage(null);

    try {
      await deleteVenue(venue.id);
      if (selectedVenueId === venue.id) {
        setSelectedVenueId("");
      }
      if (editingVenueId === venue.id) {
        resetVenueForm();
      }
      setMessage("Venue section deleted successfully.");
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Unable to delete the venue section.");
    }
  };

  const handleUpload = async (event: React.FormEvent) => {
    event.preventDefault();
    setMessage(null);
    if (!file) {
      setError("Select an image to upload.");
      return;
    }
    if (category === "secondary" && !selectedVenueId) {
      setError("Select or create a venue section before uploading secondary images.");
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
        ...(category === "secondary" && selectedVenueId ? { venueId: selectedVenueId } : {}),
        ...(trimmedCaption ? { caption: trimmedCaption } : {})
      });

      const keepCount = retentionByCategory[category];
      const deleted = await cleanupMediaCategory(
        category,
        keepCount,
        [createdId],
        category === "secondary" ? selectedVenueId : undefined
      );
      for (const item of deleted) {
        try {
          await deleteWalkthroughAsset(item.storagePath);
        } catch {
          // Ignore storage cleanup failures for older assets.
        }
      }

      setFile(null);
      setCaption("");
      setMessage("Image uploaded successfully.");
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
        title="Manage property imagery and venue sections"
        description="Create venue sections, then upload hero, walkthrough, or venue-specific secondary images."
      />

      <Card>
        <h2 className="font-display text-2xl text-forest-900">
          {editingVenueId ? "Edit venue section" : "Create venue section"}
        </h2>
        <p className="mt-2 text-sm text-forest-600">
          Each venue section becomes a selectable booking option and a secondary gallery subcategory.
        </p>
        <form onSubmit={handleSaveVenue} className="mt-4 grid gap-4 lg:grid-cols-[1fr_1fr_auto_auto]">
          <label className="space-y-2 text-sm font-medium text-forest-700">
            Venue name
            <input
              value={venueName}
              onChange={(event) => setVenueName(event.target.value)}
              className="w-full rounded-xl border border-forest-100 bg-white/80 px-4 py-3"
              placeholder="Farmstay, Convention, Mango Lawn..."
            />
          </label>
          <label className="space-y-2 text-sm font-medium text-forest-700">
            Purpose (optional)
            <input
              value={venuePurpose}
              onChange={(event) => setVenuePurpose(event.target.value)}
              className="w-full rounded-xl border border-forest-100 bg-white/80 px-4 py-3"
              placeholder="Family stays, events, conventions"
            />
          </label>
          <div className="flex items-end">
            <Button type="submit" disabled={savingVenue}>
              {savingVenue ? "Saving..." : editingVenueId ? "Save changes" : "Create venue"}
            </Button>
          </div>
          {editingVenueId && (
            <div className="flex items-end">
              <Button type="button" variant="ghost" onClick={resetVenueForm}>
                Cancel edit
              </Button>
            </div>
          )}
        </form>
        {!!venues.length && (
          <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {venues.map((venue) => (
              <div key={venue.id} className="rounded-2xl border border-forest-100 bg-forest-50 p-4">
                <p className="font-semibold text-forest-900">{venue.name}</p>
                <p className="mt-1 text-sm text-forest-600">{venue.purpose || "No purpose added yet."}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Button type="button" variant="outline" onClick={() => handleEditVenue(venue)}>
                    Edit
                  </Button>
                  <Button type="button" variant="ghost" onClick={() => handleDeleteVenue(venue)}>
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Card>
        <h2 className="font-display text-2xl text-forest-900">Upload new image</h2>
        <form onSubmit={handleUpload} className="mt-4 grid gap-4 lg:grid-cols-[1fr_1fr_220px_220px_auto]">
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
              <option value="secondary">Secondary</option>
            </select>
          </label>
          {category === "secondary" ? (
            <label className="space-y-2 text-sm font-medium text-forest-700">
              Venue section
              <select
                value={selectedVenueId}
                onChange={(event) => setSelectedVenueId(event.target.value)}
                disabled={!venues.length}
                className="w-full rounded-xl border border-forest-100 bg-white/80 px-4 py-3 disabled:cursor-not-allowed disabled:bg-forest-50"
              >
                {!venues.length ? (
                  <option value="">Create a venue first</option>
                ) : (
                  venues.map((venue) => (
                    <option key={venue.id} value={venue.id}>
                      {venue.name}
                    </option>
                  ))
                )}
              </select>
            </label>
          ) : (
            <div className="flex items-center rounded-xl border border-forest-100 bg-forest-50 px-4 py-3 text-sm text-forest-600">
              Hero and Walkthrough uploads are global and are not assigned to a venue.
            </div>
          )}
          <div className="flex items-end">
            <Button type="submit" disabled={uploading}>
              {uploading ? "Uploading..." : "Upload"}
            </Button>
          </div>
        </form>
        {category === "secondary" && selectedVenue && (
          <p className="mt-3 text-sm text-forest-600">
            New secondary images will appear under <strong>{selectedVenue.name}</strong> on the public gallery and in the
            booking form flow.
          </p>
        )}
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <Button type="button" variant="outline" onClick={handleMigration}>
            Migrate legacy walkthrough images
          </Button>
          {progress !== null && <p className="text-sm text-forest-600">Uploading... {progress}%</p>}
          {error && <p className="text-sm text-red-600">{error}</p>}
          {message && <p className="text-sm text-emerald-700">{message}</p>}
        </div>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        {images.map((image, index) => (
          <div key={image.id} className="glass-card overflow-hidden rounded-3xl">
            <img src={category === "secondary" ? getCloudinaryImageUrl(image.url, { width: 900, crop: "limit", quality: "auto", format: "auto" }) : image.url} alt={image.caption || "Walkthrough image"} loading="lazy" decoding="async" className={category === "secondary" ? "h-56 w-full object-contain bg-forest-50 p-2" : "h-56 w-full object-cover"} />
            <div className="space-y-3 p-4">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-forest-500">Order {image.order}</p>
                <p className="text-sm text-forest-700">{image.caption || "No caption"}</p>
                {image.venueId && (
                  <p className="mt-2 text-xs font-semibold uppercase tracking-[0.2em] text-forest-500">
                    {venues.find((venue) => venue.id === image.venueId)?.name || "Venue image"}
                  </p>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {category === "walkthrough" && (
                  <>
                    <Button type="button" variant="outline" onClick={() => moveImage(index, "up")} disabled={index === 0}>
                      Move up
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => moveImage(index, "down")}
                      disabled={index === images.length - 1}
                    >
                      Move down
                    </Button>
                  </>
                )}
                <Button type="button" variant="ghost" onClick={() => handleDelete(image)}>
                  Delete
                </Button>
              </div>
            </div>
          </div>
        ))}
        {!images.length && (
          <div className="rounded-3xl border border-forest-100 bg-white/80 p-6 text-sm text-forest-600">
            {category === "secondary" && selectedVenue
              ? `No secondary images yet for ${selectedVenue.name}. Upload your first photo above.`
              : "No images in this category yet. Upload your first photo above."}
          </div>
        )}
      </div>
    </div>
  );
};

