export type Room = {
  id: string;
  name: string;
  description: string;
  pricePerNight: number;
  maxGuests: number;
  amenities: string[];
  images: string[];
};

export type BookingStatus = "pending" | "confirmed" | "canceled";

export type Booking = {
  id: string;
  roomId: string;
  guestName: string;
  email: string;
  phone: string;
  guests: number;
  checkInDate: string;
  checkOutDate: string;
  status: BookingStatus;
  createdAt: string;
  notes?: string;
};

export type BlockedDateRange = {
  id: string;
  roomId: string;
  startDate: string;
  endDate: string;
  reason: string;
};
