import { useEffect, useMemo, useState } from "react";
import { DateRange } from "react-day-picker";
import { formatDate, hasAvailabilityConflict, validateDateRange } from "../lib/booking";
import {
  createBooking,
  fetchBlockedDatesByRoom,
  fetchBookingsByRoom,
  fetchRooms
} from "../lib/firestore";
import { BlockedDateRange, Booking, Room } from "../lib/types";
import { DateRangePicker } from "../components/booking/DateRangePicker";
import { BookingForm, BookingFormValues } from "../components/booking/BookingForm";
import { Card } from "../components/shared/Card";
import { CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { useSearchParams } from "react-router-dom";
import { demoRooms } from "../data/rooms";

const expandRange = (start: string, end: string, includeEnd: boolean) => {
  const dates: string[] = [];
  const current = new Date(start);
  const endDate = new Date(end);
  const lastDate = includeEnd ? endDate : new Date(endDate.getTime() - 24 * 60 * 60 * 1000);
  while (current <= lastDate) {
    dates.push(formatDate(current));
    current.setDate(current.getDate() + 1);
  }
  return dates;
};

export const BookingPage = () => {
  const [rooms, setRooms] = useState<Room[]>(demoRooms);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [loading, setLoading] = useState(false);
  const [confirmation, setConfirmation] = useState<Booking | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [searchParams] = useSearchParams();
  const preselectedRoom = searchParams.get("room") ?? undefined;
  const [activeRoomId, setActiveRoomId] = useState(preselectedRoom ?? demoRooms[0]?.id ?? "");

  useEffect(() => {
    const loadRooms = async () => {
      const roomData = await fetchRooms();
      if (roomData.length > 0) {
        setRooms(roomData);
        if (!activeRoomId) {
          setActiveRoomId(preselectedRoom ?? roomData[0]?.id ?? "");
        }
      }
    };
    loadRooms();
  }, [activeRoomId, preselectedRoom]);

  const maxGuestsByRoom = useMemo(
    () => Object.fromEntries(rooms.map((room) => [room.id, room.maxGuests])),
    [rooms]
  );

  const [disabledDates, setDisabledDates] = useState<string[]>([]);

  useEffect(() => {
    const roomId = activeRoomId || preselectedRoom || rooms[0]?.id;
    if (!roomId) return;
    const loadAvailability = async () => {
      const [bookingsData, blockedData] = await Promise.all([
        fetchBookingsByRoom(roomId),
        fetchBlockedDatesByRoom(roomId)
      ]);
      const bookedDays = bookingsData
        .filter((booking) => booking.status !== "canceled")
        .flatMap((booking) => expandRange(booking.checkInDate, booking.checkOutDate, false));
      const blockedDays = blockedData.flatMap((block) => expandRange(block.startDate, block.endDate, true));
      setDisabledDates([...new Set([...bookedDays, ...blockedDays])]);
    };
    loadAvailability();
  }, [activeRoomId, preselectedRoom, rooms]);

  const handleBookingSubmit = async (values: BookingFormValues) => {
    setError(null);
    setLoading(true);
    const rangeError = validateDateRange(values.checkInDate, values.checkOutDate);
    if (rangeError) {
      setError(rangeError);
      setLoading(false);
      return;
    }

    const selectedRoom = rooms.find((room) => room.id === values.roomId);
    if (selectedRoom && values.guests > selectedRoom.maxGuests) {
      setError(`Guest count exceeds max of ${selectedRoom.maxGuests}.`);
      setLoading(false);
      return;
    }

    const [bookingsData, blockedData] = await Promise.all([
      fetchBookingsByRoom(values.roomId),
      fetchBlockedDatesByRoom(values.roomId)
    ]);
    if (hasAvailabilityConflict(values.checkInDate, values.checkOutDate, bookingsData, blockedData)) {
      setError("Those dates are unavailable. Please pick another range.");
      setLoading(false);
      return;
    }

    await createBooking({
      roomId: values.roomId,
      guestName: values.guestName,
      email: values.email,
      phone: values.phone,
      guests: values.guests,
      checkInDate: values.checkInDate,
      checkOutDate: values.checkOutDate,
      status: "pending",
      notes: values.notes
    });

    setConfirmation({
      id: "confirmed",
      roomId: values.roomId,
      guestName: values.guestName,
      email: values.email,
      phone: values.phone,
      guests: values.guests,
      checkInDate: values.checkInDate,
      checkOutDate: values.checkOutDate,
      status: "pending",
      createdAt: new Date().toISOString(),
      notes: values.notes
    });
    setLoading(false);
  };

  return (
    <div className="section-padding">
      <div className="mb-10">
        <p className="text-sm uppercase tracking-[0.2em] text-forest-500">Booking</p>
        <h1 className="mt-3 font-display text-4xl text-forest-900">Reserve your GreenNest experience.</h1>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr]">
        <Card>
          <h2 className="font-display text-2xl text-forest-900">Select your dates</h2>
          <p className="mt-2 text-sm text-forest-600">Past dates and blocked stays are disabled.</p>
          <div className="mt-4">
            <DateRangePicker value={dateRange} onChange={setDateRange} disabledDates={disabledDates} />
          </div>
          {error && (
            <motion.p
              initial={{ x: -8, opacity: 0 }}
              animate={{ x: [0, -6, 6, -4, 4, 0], opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="mt-4 text-sm text-red-600"
            >
              {error}
            </motion.p>
          )}
        </Card>
        <Card>
          {!confirmation ? (
            <>
              <h2 className="font-display text-2xl text-forest-900">Guest details</h2>
              <p className="mt-2 text-sm text-forest-600">We will confirm your stay within 24 hours.</p>
              <div className="mt-4">
                <BookingForm
                  rooms={rooms}
                  selectedRoomId={activeRoomId}
                  dateRange={dateRange}
                  onSubmit={handleBookingSubmit}
                  submitting={loading}
                  maxGuestsByRoom={maxGuestsByRoom}
                  onRoomChange={setActiveRoomId}
                />
              </div>
            </>
          ) : (
            <div className="space-y-4 text-center">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 120 }}
              >
                <CheckCircle2 className="mx-auto h-12 w-12 text-forest-600" />
              </motion.div>
              <h2 className="font-display text-2xl text-forest-900">Booking confirmed!</h2>
              <p className="text-sm text-forest-600">
                We have reserved {confirmation.checkInDate} → {confirmation.checkOutDate}.
              </p>
              <p className="text-xs text-forest-500">A confirmation email will arrive shortly.</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};
