import {
  addDoc,
  collection,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where
} from "firebase/firestore";
import { db } from "./firebase";
import { BlockedDateRange, Booking, BookingStatus, Room } from "./types";

export const roomsCollection = collection(db, "rooms");
export const bookingsCollection = collection(db, "bookings");
export const blockedDatesCollection = collection(db, "blockedDates");

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
