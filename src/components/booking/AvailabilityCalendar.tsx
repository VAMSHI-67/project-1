import { DayPicker } from "react-day-picker";
import { format, parseISO } from "date-fns";
import { BlockedDateRange, Booking } from "../../lib/types";

const toDays = (start: string, end: string, includeEnd: boolean) => {
  const days: Date[] = [];
  let current = parseISO(start);
  const endDate = parseISO(end);
  const lastDate = includeEnd ? endDate : new Date(endDate.getTime() - 24 * 60 * 60 * 1000);
  while (current <= lastDate) {
    days.push(current);
    current = new Date(current.getTime() + 24 * 60 * 60 * 1000);
  }
  return days;
};

export const AvailabilityCalendar = ({
  bookings,
  blockedDates
}: {
  bookings: Booking[];
  blockedDates: BlockedDateRange[];
}) => {
  const confirmedBookings = bookings.filter((booking) => booking.status !== "canceled");
  const bookedDays = confirmedBookings.flatMap((booking) =>
    toDays(booking.checkInDate, booking.checkOutDate, false)
  );
  const blockedDays = blockedDates.flatMap((block) => toDays(block.startDate, block.endDate, true));

  return (
    <div className="rounded-3xl border border-forest-100 bg-white/80 p-4">
      <DayPicker
        mode="multiple"
        selected={[]}
        modifiers={{ booked: bookedDays, blocked: blockedDays }}
        modifiersStyles={{
          booked: { backgroundColor: "#4f8242", color: "white" },
          blocked: { backgroundColor: "#c19a74", color: "white" }
        }}
      />
      <div className="mt-4 flex flex-wrap gap-4 text-xs text-forest-600">
        <span className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-forest-500" /> Booked
        </span>
        <span className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-clay-400" /> Blocked
        </span>
      </div>
      <div className="mt-4 space-y-2 text-xs text-forest-600">
        {confirmedBookings.slice(0, 3).map((booking) => (
          <div key={booking.id}>
            {format(parseISO(booking.checkInDate), "MMM dd")} - {format(parseISO(booking.checkOutDate), "MMM dd")}
          </div>
        ))}
      </div>
    </div>
  );
};
