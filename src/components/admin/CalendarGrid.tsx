import { BlockedDateRange, Booking, Room } from "../../lib/types";
import { format, parseISO } from "date-fns";

export const CalendarGrid = ({
  rooms,
  bookings,
  blockedDates
}: {
  rooms: Room[];
  bookings: Booking[];
  blockedDates: BlockedDateRange[];
}) => {
  const activeBookings = bookings.filter((booking) => booking.status !== "canceled");

  return (
    <div className="space-y-6">
      {rooms.map((room) => (
        <div key={room.id} className="glass-card rounded-3xl p-6">
          <h3 className="font-display text-lg text-forest-900">{room.name}</h3>
          <div className="mt-4 flex flex-wrap gap-2">
            {activeBookings
              .filter((booking) => booking.roomId === room.id)
              .map((booking) => (
                <span
                  key={booking.id}
                  className="rounded-full bg-forest-500/90 px-3 py-1 text-xs font-semibold text-white"
                >
                  {format(parseISO(booking.checkInDate), "MMM dd")} -
                  {format(parseISO(booking.checkOutDate), "MMM dd")}
                </span>
              ))}
            {blockedDates
              .filter((block) => block.roomId === room.id)
              .map((block) => (
                <span
                  key={block.id}
                  className="rounded-full bg-clay-400/90 px-3 py-1 text-xs font-semibold text-white"
                >
                  {format(parseISO(block.startDate), "MMM dd")} -
                  {format(parseISO(block.endDate), "MMM dd")}
                </span>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
};
