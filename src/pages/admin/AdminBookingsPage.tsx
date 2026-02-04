import { useEffect, useState } from "react";
import { Booking, BookingStatus, Room } from "../../lib/types";
import { subscribeBookings, subscribeRooms, updateBookingStatus } from "../../lib/firestore";
import { BookingTable } from "../../components/admin/BookingTable";

export const AdminBookingsPage = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);

  useEffect(() => {
    const unsubscribeBookings = subscribeBookings(setBookings);
    const unsubscribeRooms = subscribeRooms(setRooms);
    return () => {
      unsubscribeBookings();
      unsubscribeRooms();
    };
  }, []);

  const handleStatusChange = async (bookingId: string, status: BookingStatus) => {
    await updateBookingStatus(bookingId, status);
    setBookings((prev) => prev.map((booking) => (booking.id === bookingId ? { ...booking, status } : booking)));
  };

  return (
    <div className="section-padding">
      <div className="mb-8">
        <p className="text-sm uppercase tracking-[0.2em] text-forest-500">Bookings</p>
        <h1 className="mt-3 font-display text-4xl text-forest-900">Manage reservations</h1>
      </div>
      <BookingTable bookings={bookings} rooms={rooms} onStatusChange={handleStatusChange} />
    </div>
  );
};
