import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { AmenityList } from "../components/rooms/AmenityList";
import { RoomGallery } from "../components/rooms/RoomGallery";
import { AvailabilityCalendar } from "../components/booking/AvailabilityCalendar";
import { Skeleton } from "../components/shared/Skeleton";
import { demoRooms } from "../data/rooms";
import { fetchBlockedDatesByRoom, fetchBookingsByRoom } from "../lib/firestore";
import { BlockedDateRange, Booking } from "../lib/types";

export const RoomDetailPage = () => {
  const { roomId } = useParams();
  const room = useMemo(() => demoRooms.find((item) => item.id === roomId), [roomId]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [blockedDates, setBlockedDates] = useState<BlockedDateRange[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!roomId) return;
    const loadAvailability = async () => {
      setLoading(true);
      const [bookingsData, blockedData] = await Promise.all([
        fetchBookingsByRoom(roomId),
        fetchBlockedDatesByRoom(roomId)
      ]);
      setBookings(bookingsData);
      setBlockedDates(blockedData);
      setLoading(false);
    };
    loadAvailability();
  }, [roomId]);

  if (!room) {
    return <div className="section-padding">Room not found.</div>;
  }

  return (
    <div className="section-padding">
      <div className="grid gap-10 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-8">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-forest-500">{room.name}</p>
            <h1 className="mt-2 font-display text-4xl text-forest-900">{room.description}</h1>
          </div>
          <RoomGallery images={room.images} />
          <div>
            <h2 className="font-display text-2xl text-forest-900">Amenities</h2>
            <AmenityList amenities={room.amenities} />
          </div>
        </div>
        <div className="space-y-6">
          <div className="glass-card rounded-3xl p-6">
            <p className="text-sm uppercase tracking-[0.2em] text-forest-500">From</p>
            <p className="mt-2 text-3xl font-semibold text-forest-900">${room.pricePerNight}</p>
            <p className="text-sm text-forest-600">per night · up to {room.maxGuests} guests</p>
            <Link
              to={`/booking?room=${room.id}`}
              className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-forest-700 via-forest-600 to-forest-500 px-5 py-3 text-sm font-semibold text-white shadow-glow transition hover:scale-[1.02]"
            >
              Book this room
            </Link>
          </div>
          <div>
            <h3 className="font-display text-xl text-forest-900">Availability calendar</h3>
            {loading ? (
              <div className="space-y-3 rounded-3xl border border-forest-100 bg-white/80 p-6">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-52" />
                <Skeleton className="h-4 w-44" />
              </div>
            ) : (
              <AvailabilityCalendar bookings={bookings} blockedDates={blockedDates} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
