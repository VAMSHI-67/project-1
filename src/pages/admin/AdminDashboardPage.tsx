import { useEffect, useState } from "react";
import { motion, animate } from "framer-motion";
import { CalendarCheck, CreditCard, Users } from "lucide-react";
import { subscribeBookings, subscribeRooms } from "../../lib/firestore";
import { Booking, Room } from "../../lib/types";
import { ToggleSwitch } from "../../components/shared/ToggleSwitch";

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
  const [autoConfirm, setAutoConfirm] = useState(true);

  useEffect(() => {
    const unsubscribeBookings = subscribeBookings(setBookings);
    const unsubscribeRooms = subscribeRooms(setRooms);
    return () => {
      unsubscribeBookings();
      unsubscribeRooms();
    };
  }, []);

  const upcoming = bookings.filter((booking) => booking.status !== "canceled");
  const occupancy = Math.min(100, Math.round((upcoming.length / Math.max(rooms.length, 1)) * 100));

  return (
    <div className="section-padding">
      <div className="mb-10">
        <p className="text-sm uppercase tracking-[0.2em] text-forest-500">Dashboard</p>
        <h1 className="mt-3 font-display text-4xl text-forest-900">Welcome back, host.</h1>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={<Users className="h-5 w-5" />} label="Total bookings" value={bookings.length} />
        <StatCard icon={<CalendarCheck className="h-5 w-5" />} label="Upcoming stays" value={upcoming.length} />
        <StatCard icon={<CreditCard className="h-5 w-5" />} label="Revenue estimate" value={upcoming.length * 220} />
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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-3xl p-6"
        >
          <h2 className="font-display text-xl text-forest-900">Automation</h2>
          <div className="mt-4 flex items-center justify-between text-sm text-forest-600">
            <span>Auto-confirm bookings</span>
            <ToggleSwitch enabled={autoConfirm} onChange={setAutoConfirm} />
          </div>
          <p className="mt-3 text-xs text-forest-500">Toggle demo-only automation flows.</p>
        </motion.div>
      </div>
    </div>
  );
};
