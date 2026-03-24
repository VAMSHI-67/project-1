import { useEffect, useState } from "react";
import { CalendarGrid } from "../../components/admin/CalendarGrid";
import { DateBlockForm, DateBlockValues } from "../../components/admin/DateBlockForm";
import { createBlockedDates, subscribeBlockedDates, subscribeBookings, subscribeRooms } from "../../lib/firestore";
import { BlockedDateRange, Booking, Room } from "../../lib/types";
import { AdminHeader } from "../../components/admin/AdminHeader";

export const AdminCalendarPage = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [blockedDates, setBlockedDates] = useState<BlockedDateRange[]>([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const unsubscribeRooms = subscribeRooms(setRooms);
    const unsubscribeBookings = subscribeBookings(setBookings);
    const unsubscribeBlocked = subscribeBlockedDates(setBlockedDates);
    return () => {
      unsubscribeRooms();
      unsubscribeBookings();
      unsubscribeBlocked();
    };
  }, []);

  const handleBlock = async (values: DateBlockValues) => {
    setSubmitting(true);
    const id = await createBlockedDates(values);
    setBlockedDates((prev) => [...prev, { id, ...values }]);
    setSubmitting(false);
  };

  return (
    <div className="section-padding">
      <AdminHeader eyebrow="Calendar" title="Block dates & manage availability" />
      <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr]">
        <div className="glass-card rounded-3xl p-6">
          <h2 className="font-display text-xl text-forest-900">Block dates</h2>
          <p className="mt-2 text-sm text-forest-600">Reserve dates for maintenance or private events.</p>
          <div className="mt-4">
            <DateBlockForm rooms={rooms} onSubmit={handleBlock} submitting={submitting} />
          </div>
        </div>
        <div className="space-y-4">
          <div className="glass-card rounded-3xl p-4">
            <div className="flex flex-wrap gap-4 text-xs text-forest-600">
              <span className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-forest-500" /> Booked
              </span>
              <span className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-clay-400" /> Blocked
              </span>
            </div>
          </div>
          <CalendarGrid rooms={rooms} bookings={bookings} blockedDates={blockedDates} />
        </div>
      </div>
    </div>
  );
};
