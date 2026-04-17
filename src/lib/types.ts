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
  venueId?: string;
  venueName?: string;
  guestName: string;
  email: string;
  phone: string;
  guests: number;
  checkInDate: string;
  checkOutDate: string;
  status: BookingStatus;
  createdAt: number;
  notes?: string;
};

export type BlockedDateRange = {
  id: string;
  roomId: string;
  startDate: string;
  endDate: string;
  reason: string;
};

export type MediaCategory = "hero" | "walkthrough" | "secondary";

export type Venue = {
  id: string;
  name: string;
  slug: string;
  purpose?: string;
  isActive: boolean;
  createdAt: number;
};

export type WalkthroughImage = {
  id: string;
  url: string;
  caption?: string;
  order: number;
  storagePath: string;
  createdAt: number;
  category: MediaCategory;
  venueId?: string;
};
