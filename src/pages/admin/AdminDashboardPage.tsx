import { useEffect, useMemo, useState } from "react";
import { motion, animate } from "framer-motion";
import { CalendarCheck, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { subscribeBookings, subscribeRooms } from "../../lib/firestore";
import { Booking, Room } from "../../lib/types";
import { addDays, differenceInCalendarDays, max, min, parseISO, startOfDay } from "date-fns";
import { AdminHeader } from "../../components/admin/AdminHeader";

const StatCard = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) => {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const controls = animate(0, value, {
      duration: 1.2,
      onUpdate: (latest) => setDisplay(Math.round(latest))
    });
    return () => controls.stop();
  }, [value]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card rounded-3xl p-6"
    >
      <div className="flex items-center gap-3 text-forest-600">{icon}</div>
      <p className="mt-3 text-3xl font-semibold text-forest-900">{display}</p>
      <p className="text-sm text-forest-500">{label}</p>
    </motion.div>
  );
};

export const AdminDashboardPage = () => {
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

  const upcoming = bookings.filter((booking) => booking.status !== "canceled");

  const occupancy = useMemo(() => {
    const totalRooms = rooms.length;
    if (!totalRooms) return 0;
    const today = startOfDay(new Date());
    const windowEnd = addDays(today, 7);
    const roomNights = totalRooms * differenceInCalendarDays(windowEnd, today);
    if (!roomNights) return 0;

    const bookedNights = upcoming.reduce((sum, booking) => {
      const checkIn = parseISO(booking.checkInDate);
      const checkOut = parseISO(booking.checkOutDate);
      if (checkOut <= today || checkIn >= windowEnd) return sum;

      const overlapStart = max([checkIn, today]);
      const overlapEnd = min([checkOut, windowEnd]);
      const nights = Math.max(0, differenceInCalendarDays(overlapEnd, overlapStart));
      return sum + nights;
    }, 0);

    return Math.min(100, Math.round((bookedNights / roomNights) * 100));
  }, [rooms.length, upcoming]);

  return (
    <div className="section-padding">
      <AdminHeader
        eyebrow="Dashboard"
        title="Welcome back, host."
        action={
          <Link
            to="/admin/walkthrough"
            className="rounded-full bg-gradient-to-r from-forest-700 via-forest-600 to-forest-500 px-5 py-3 text-sm font-semibold text-white shadow-glow"
          >
            Upload walkthrough images
          </Link>
        }
      />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <StatCard icon={<Users className="h-5 w-5" />} label="Total bookings" value={bookings.length} />
        <StatCard icon={<CalendarCheck className="h-5 w-5" />} label="Upcoming stays" value={upcoming.length} />
        <StatCard icon={<CalendarCheck className="h-5 w-5" />} label="7-day occupancy" value={occupancy} />
      </div>
      <div className="mt-10 grid gap-6 lg:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-3xl p-6 lg:col-span-2"
        >
          <h2 className="font-display text-xl text-forest-900">Upcoming stays timeline</h2>
          <div className="mt-4 space-y-3">
            {upcoming.slice(0, 5).map((booking) => (
              <div key={booking.id} className="flex items-center justify-between rounded-2xl bg-forest-50 px-4 py-3">
                <div>
                  <p className="text-sm font-semibold text-forest-800">{booking.guestName}</p>
                  <p className="text-xs text-forest-500">
                    {booking.checkInDate} → {booking.checkOutDate}
                  </p>
                </div>
                <span className="rounded-full bg-forest-100 px-3 py-1 text-xs text-forest-600">
                  {booking.status}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-3xl p-6"
        >
          <h2 className="font-display text-xl text-forest-900">Today arrivals</h2>
          <p className="mt-3 text-4xl font-semibold text-forest-900">{upcoming.slice(0, 2).length}</p>
          <p className="text-sm text-forest-500">Guests checking in today.</p>
        </motion.div>
      </div>
    </div>
  );
};
