import { useEffect, useState } from "react";
import { Booking, BookingStatus, Room } from "../../lib/types";
import { subscribeBookings, subscribeRooms, updateBookingStatus } from "../../lib/firestore";
import { BookingTable } from "../../components/admin/BookingTable";
import { AdminHeader } from "../../components/admin/AdminHeader";

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
    const booking = bookings.find((item) => item.id === bookingId);
    if (!booking || booking.status !== "pending") {
      return;
    }
    await updateBookingStatus(bookingId, status);
    setBookings((prev) => prev.map((booking) => (booking.id === bookingId ? { ...booking, status } : booking)));
  };

  return (
    <div className="section-padding">
      <AdminHeader eyebrow="Bookings" title="Manage reservations" />
      <BookingTable bookings={bookings} rooms={rooms} onStatusChange={handleStatusChange} />
    </div>
  );
};
