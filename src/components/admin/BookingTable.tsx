import { Booking, BookingStatus, Room } from "../../lib/types";
import { Button } from "../shared/Button";

const isFinalizedStatus = (status: BookingStatus) => status === "confirmed" || status === "canceled";

export const BookingTable = ({
  bookings,
  rooms,
  onStatusChange
}: {
  bookings: Booking[];
  rooms: Room[];
  onStatusChange: (bookingId: string, status: BookingStatus) => void;
}) => {
  const roomMap = Object.fromEntries(rooms.map((room) => [room.id, room]));
  const getRoomLabel = (roomId: string) => {
    if (roomId === "whole-property") {
      return "Whole property";
    }
    return roomMap[roomId]?.name ?? "-";
  };

  return (
    <div className="overflow-hidden rounded-3xl border border-forest-100 bg-white/80">
      <table className="w-full text-left text-sm">
        <thead className="bg-forest-100/60 text-forest-700">
          <tr>
            <th className="p-4">Guest</th>
            <th className="p-4">Venue</th>
            <th className="p-4">Room</th>
            <th className="p-4">Dates</th>
            <th className="p-4">Guests</th>
            <th className="p-4">Status</th>
            <th className="p-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => (
            <tr key={booking.id} className="border-t border-forest-100">
              <td className="p-4 font-medium text-forest-900">{booking.guestName}</td>
              <td className="p-4">{booking.venueName ?? "-"}</td>
              <td className="p-4">{getRoomLabel(booking.roomId)}</td>
              <td className="p-4">
                {booking.checkInDate} to {booking.checkOutDate}
              </td>
              <td className="p-4">{booking.guests}</td>
              <td className="p-4">
                <span className="rounded-full bg-forest-100 px-3 py-1 text-xs font-semibold capitalize text-forest-700">
                  {booking.status}
                </span>
              </td>
              <td className="flex flex-wrap gap-2 p-4">
                {booking.status === "pending" ? (
                  <>
                    <Button variant="outline" onClick={() => onStatusChange(booking.id, "confirmed")}>
                      Confirm
                    </Button>
                    <Button variant="ghost" onClick={() => onStatusChange(booking.id, "canceled")}>
                      Cancel
                    </Button>
                  </>
                ) : (
                  <span className="text-xs font-medium text-forest-500">
                    {isFinalizedStatus(booking.status) ? "Finalized" : "No actions"}
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
