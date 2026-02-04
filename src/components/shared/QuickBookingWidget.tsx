import { useState } from "react";
import { CalendarDays } from "lucide-react";
import { Modal } from "./Modal";
import { demoRooms } from "../../data/rooms";
import { Link } from "react-router-dom";

export const QuickBookingWidget = () => {
  const [open, setOpen] = useState(false);
  const [roomId, setRoomId] = useState(demoRooms[0]?.id ?? "");

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full bg-gradient-to-r from-forest-700 via-forest-600 to-forest-500 px-5 py-3 text-sm font-semibold text-white shadow-glow"
      >
        <CalendarDays className="h-4 w-4" /> Quick Booking
      </button>
      <Modal open={open} onClose={setOpen}>
        <div className="space-y-4">
          <h3 className="font-display text-xl text-forest-900">Quick Booking</h3>
          <p className="text-sm text-forest-600">Select a room and continue to the full booking flow.</p>
          <label className="block text-sm font-medium text-forest-700">
            Room
            <select
              value={roomId}
              onChange={(event) => setRoomId(event.target.value)}
              className="mt-2 w-full rounded-xl border border-forest-100 bg-white/80 px-4 py-3"
            >
              {demoRooms.map((room) => (
                <option key={room.id} value={room.id}>
                  {room.name}
                </option>
              ))}
            </select>
          </label>
          <Link
            to={`/booking?room=${roomId}`}
            onClick={() => setOpen(false)}
            className="inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-forest-700 via-forest-600 to-forest-500 px-5 py-3 text-sm font-semibold text-white shadow-glow transition hover:scale-[1.02]"
          >
            Continue to booking
          </Link>
        </div>
      </Modal>
    </>
  );
};
