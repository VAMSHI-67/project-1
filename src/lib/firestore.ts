import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
  writeBatch
} from "firebase/firestore";
import { db } from "./firebase";
import {
  BlockedDateRange,
  Booking,
  BookingStatus,
  MediaCategory,
  Room,
  Venue,
  WalkthroughImage
} from "./types";

export const roomsCollection = collection(db, "rooms");
export const bookingsCollection = collection(db, "bookings");
export const blockedDatesCollection = collection(db, "blockedDates");
export const walkthroughImagesCollection = collection(db, "walkthroughImages");
export const venuesCollection = collection(db, "venues");

const slugify = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "venue";

const sortByCreatedAt = <T extends { createdAt?: number }>(items: T[]) =>
  [...items].sort((a, b) => (a.createdAt ?? 0) - (b.createdAt ?? 0));

export const fetchRooms = async (): Promise<Room[]> => {
  const snapshot = await getDocs(roomsCollection);
  return snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...(docSnap.data() as Omit<Room, "id">) }));
};

export const fetchBookingsByRoom = async (roomId: string): Promise<Booking[]> => {
  const snapshot = await getDocs(query(bookingsCollection, where("roomId", "==", roomId)));
  return snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...(docSnap.data() as Omit<Booking, "id">) }));
};

export const fetchAllBookings = async (): Promise<Booking[]> => {
  const snapshot = await getDocs(query(bookingsCollection, orderBy("checkInDate", "asc")));
  return snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...(docSnap.data() as Omit<Booking, "id">) }));
};

export const subscribeBookings = (onChange: (bookings: Booking[]) => void) =>
  onSnapshot(query(bookingsCollection, orderBy("checkInDate", "asc")), (snapshot) => {
    const data = snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...(docSnap.data() as Omit<Booking, "id">) }));
    onChange(data);
  });

export const subscribeRooms = (onChange: (rooms: Room[]) => void) =>
  onSnapshot(roomsCollection, (snapshot) => {
    const data = snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...(docSnap.data() as Omit<Room, "id">) }));
    onChange(data);
  });

export const subscribeVenues = (onChange: (venues: Venue[]) => void) =>
  onSnapshot(venuesCollection, (snapshot) => {
    const data = sortByCreatedAt(
      snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...(docSnap.data() as Omit<Venue, "id">) }))
    );
    onChange(data);
  });

export const subscribeActiveVenues = (onChange: (venues: Venue[]) => void) =>
  subscribeVenues((venues) => onChange(venues.filter((venue) => venue.isActive !== false)));

export const createVenue = async ({ name, purpose, isActive = true }: Omit<Venue, "id" | "slug" | "createdAt">) => {
  const trimmedName = name.trim();
  const trimmedPurpose = purpose?.trim();
  const docRef = await addDoc(venuesCollection, {
    name: trimmedName,
    slug: slugify(trimmedName),
    isActive,
    createdAt: Date.now(),
    ...(trimmedPurpose ? { purpose: trimmedPurpose } : {})
  });
  return docRef.id;
};

export const updateVenue = async (
  venueId: string,
  payload: Partial<Pick<Venue, "name" | "purpose" | "isActive">>
) => {
  const updates: Record<string, unknown> = {};

  if (typeof payload.name === "string") {
    const trimmedName = payload.name.trim();
    updates.name = trimmedName;
    updates.slug = slugify(trimmedName);
  }

  if (payload.purpose !== undefined) {
    const trimmedPurpose = payload.purpose?.trim();
    updates.purpose = trimmedPurpose || null;
  }

  if (typeof payload.isActive === "boolean") {
    updates.isActive = payload.isActive;
  }

  await updateDoc(doc(venuesCollection, venueId), updates);
};

export const deleteVenue = async (venueId: string) => {
  const linkedImages = await getDocs(query(walkthroughImagesCollection, where("venueId", "==", venueId)));
  if (!linkedImages.empty) {
    throw new Error("Delete or reassign this venue's secondary images before deleting the venue.");
  }
  await deleteDoc(doc(venuesCollection, venueId));
};

export const subscribeBlockedDates = (onChange: (blocked: BlockedDateRange[]) => void) =>
  onSnapshot(blockedDatesCollection, (snapshot) => {
    const data = snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...(docSnap.data() as Omit<BlockedDateRange, "id">)
    }));
    onChange(data);
  });

export const fetchBlockedDatesByRoom = async (roomId: string): Promise<BlockedDateRange[]> => {
  const snapshot = await getDocs(query(blockedDatesCollection, where("roomId", "==", roomId)));
  return snapshot.docs.map((docSnap) => ({
    id: docSnap.id,
    ...(docSnap.data() as Omit<BlockedDateRange, "id">)
  }));
};

export const fetchAllBlockedDates = async (): Promise<BlockedDateRange[]> => {
  const snapshot = await getDocs(blockedDatesCollection);
  return snapshot.docs.map((docSnap) => ({
    id: docSnap.id,
    ...(docSnap.data() as Omit<BlockedDateRange, "id">)
  }));
};

export const createBooking = async (payload: Omit<Booking, "id" | "createdAt">) => {
  const docRef = await addDoc(bookingsCollection, {
    ...payload,
    createdAt: serverTimestamp()
  });
  return docRef.id;
};

export const updateBookingStatus = async (bookingId: string, status: BookingStatus) => {
  await updateDoc(doc(bookingsCollection, bookingId), { status });
};

export const createBlockedDates = async (payload: Omit<BlockedDateRange, "id">) => {
  const docRef = await addDoc(blockedDatesCollection, payload);
  return docRef.id;
};

export const subscribeMediaByCategory = (
  category: MediaCategory,
  onChange: (images: WalkthroughImage[]) => void,
  orderField: "order" | "createdAt" = "order",
  orderDirection: "asc" | "desc" = "asc"
) =>
  onSnapshot(
    query(walkthroughImagesCollection, where("category", "==", category)),
    (snapshot) => {
      const data = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...(docSnap.data() as Omit<WalkthroughImage, "id">)
      }));
      const sorted = [...data].sort((a, b) => {
        const aValue = orderField === "order" ? a.order : Number(a.createdAt ?? 0);
        const bValue = orderField === "order" ? b.order : Number(b.createdAt ?? 0);
        if (aValue === bValue) return 0;
        return orderDirection === "asc" ? aValue - bValue : bValue - aValue;
      });
      onChange(sorted);
    }
  );

export const subscribeWalkthroughImages = (onChange: (images: WalkthroughImage[]) => void) =>
  subscribeMediaByCategory("walkthrough", onChange, "order", "asc");

export const subscribeHeroImages = (onChange: (images: WalkthroughImage[]) => void) =>
  subscribeMediaByCategory("hero", onChange, "createdAt", "desc");

export const subscribeSecondaryImages = (onChange: (images: WalkthroughImage[]) => void) =>
  subscribeMediaByCategory("secondary", onChange, "createdAt", "desc");

export const createWalkthroughImage = async (payload: Omit<WalkthroughImage, "id" | "createdAt">) => {
  const docRef = await addDoc(walkthroughImagesCollection, {
    ...payload,
    createdAt: Date.now()
  });
  return docRef.id;
};

export const updateWalkthroughOrder = async (images: WalkthroughImage[]) => {
  const batch = writeBatch(db);
  images.forEach((image) => {
    batch.update(doc(walkthroughImagesCollection, image.id), { order: image.order });
  });
  await batch.commit();
};

export const deleteWalkthroughImage = async (imageId: string) => {
  await deleteDoc(doc(walkthroughImagesCollection, imageId));
};

export const cleanupMediaCategory = async (
  category: MediaCategory,
  keepCount: number,
  preserveIds: string[] = [],
  venueId?: string
) => {
  const orderField = category === "walkthrough" ? "order" : "createdAt";
  const orderDirection = category === "walkthrough" ? "asc" : "desc";
  const snapshot = await getDocs(query(walkthroughImagesCollection, where("category", "==", category)));
  if (snapshot.empty) return [] as WalkthroughImage[];

  const scopedItems = snapshot.docs
    .map((docSnap) => ({
      id: docSnap.id,
      data: docSnap.data() as Omit<WalkthroughImage, "id">
    }))
    .filter((item) => (category === "secondary" && venueId ? item.data.venueId === venueId : true));

  const sorted = scopedItems.sort((a, b) => {
    const aValue = orderField === "order" ? a.data.order : Number(a.data.createdAt ?? 0);
    const bValue = orderField === "order" ? b.data.order : Number(b.data.createdAt ?? 0);
    if (aValue === bValue) return 0;
    return orderDirection === "asc" ? aValue - bValue : bValue - aValue;
  });

  const deletions = sorted
    .map((item, index) => ({ ...item, index }))
    .filter((item) => item.index >= keepCount && !preserveIds.includes(item.id));

  if (!deletions.length) return [] as WalkthroughImage[];

  const batch = writeBatch(db);
  deletions.forEach((item) => batch.delete(doc(walkthroughImagesCollection, item.id)));
  await batch.commit();

  return deletions.map((item) => ({ id: item.id, ...item.data } as WalkthroughImage));
};

export const migrateLegacyMediaCategories = async (defaultCategory: MediaCategory) => {
  const snapshot = await getDocs(walkthroughImagesCollection);
  if (snapshot.empty) return 0;
  const batch = writeBatch(db);
  let migrated = 0;
  let fallbackOrder = 1;

  snapshot.docs.forEach((docSnap) => {
    const data = docSnap.data() as Partial<WalkthroughImage>;
    if (!data.category) {
      const orderValue = typeof data.order === "number" ? data.order : fallbackOrder++;
      batch.update(docSnap.ref, { category: defaultCategory, order: orderValue });
      migrated += 1;
    }
  });

  if (!migrated) return 0;
  await batch.commit();
  return migrated;
};
