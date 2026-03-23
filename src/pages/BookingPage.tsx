import { useMemo, useState } from "react";
import { AlertCircle, CheckCircle2, Clock3, MessageCircle } from "lucide-react";
import { Card } from "../components/shared/Card";
import { siteConfig, whatsappBookingLink } from "../data/site";

const HOURS_12 = 12 * 60 * 60 * 1000;

const formatDateTime = (value: string) => {
  if (!value) return "";
  const date = new Date(value);
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(date);
};

export const BookingPage = () => {
  const [guestName, setGuestName] = useState("");
  const [phone, setPhone] = useState("");
  const [guests, setGuests] = useState(16);
  const [checkInDate, setCheckInDate] = useState("");
  const [checkInTime, setCheckInTime] = useState("12:00");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [checkOutTime, setCheckOutTime] = useState("11:00");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState<string | null>(null);

  const buildDateTime = (date: string, time: string) => {
    if (!date || !time) return "";
    return `${date}T${time}`;
  };

  const duration = useMemo(() => {
    const checkIn = buildDateTime(checkInDate, checkInTime);
    const checkOut = buildDateTime(checkOutDate, checkOutTime);
    if (!checkIn || !checkOut) return null;
    const start = new Date(checkIn).getTime();
    const end = new Date(checkOut).getTime();
    if (Number.isNaN(start) || Number.isNaN(end) || end <= start) return null;
    const diff = end - start;
    const hours = diff / (1000 * 60 * 60);
    const days = diff / (1000 * 60 * 60 * 24);
    return { hours, days, diff };
  }, [checkInDate, checkInTime, checkOutDate, checkOutTime]);

  const sendToWhatsApp = () => {
    setError(null);

    const checkIn = buildDateTime(checkInDate, checkInTime);
    const checkOut = buildDateTime(checkOutDate, checkOutTime);

    if (!guestName.trim() || !phone.trim() || !checkIn || !checkOut) {
      setError("Please fill your name, phone number, and booking date/time details.");
      return;
    }

    if (!duration || duration.diff < HOURS_12) {
      setError("Minimum booking duration is 12 hours for the whole farmstay.");
      return;
    }

    const bookingMessage = [
      "Hi Kanvera Farms, I would like to book the whole farmstay.",
      `Name: ${guestName}`,
      `Phone: ${phone}`,
      `Guests: ${guests}`,
      `Check-in: ${formatDateTime(checkIn)}`,
      `Check-out: ${formatDateTime(checkOut)}`,
      `Duration: ${duration.hours.toFixed(1)} hours (~${duration.days.toFixed(2)} days)`,
      notes.trim() ? `Notes: ${notes}` : null
    ]
      .filter(Boolean)
      .join("\n");

    const whatsappUrl = `${whatsappBookingLink}?text=${encodeURIComponent(bookingMessage)}`;
    const popup = window.open(whatsappUrl, "_blank", "noopener,noreferrer");
    if (!popup) {
      window.location.assign(whatsappUrl);
    }
  };

  return (
    <div className="section-padding">
      <div className="mb-10">
        <p className="text-sm uppercase tracking-[0.2em] text-forest-500">Whole Property Booking</p>
        <h1 className="mt-3 font-display text-4xl text-forest-900">Book the entire Kanvera Farms stay.</h1>
        <p className="mt-3 max-w-2xl text-forest-600">
          This is an exclusive full-property booking. Minimum duration is <strong>12 hours</strong>, and bookings can
          be extended to multiple days.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
        <Card>
          <h2 className="font-display text-2xl text-forest-900">Booking Details</h2>
          <p className="mt-2 text-sm text-forest-600">
            Share your preferred schedule and we will continue confirmation on WhatsApp.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <label className="space-y-2 text-sm font-medium text-forest-700">
              Full Name
              <input
                value={guestName}
                onChange={(event) => setGuestName(event.target.value)}
                className="w-full rounded-xl border border-forest-100 bg-white/80 px-4 py-3"
                placeholder="Your name"
              />
            </label>
            <label className="space-y-2 text-sm font-medium text-forest-700">
              Phone Number
              <input
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                className="w-full rounded-xl border border-forest-100 bg-white/80 px-4 py-3"
                placeholder="Your WhatsApp number"
              />
            </label>
            <label className="space-y-2 text-sm font-medium text-forest-700">
              Check-in Date
              <input
                type="date"
                value={checkInDate}
                onChange={(event) => setCheckInDate(event.target.value)}
                className="w-full rounded-xl border border-forest-100 bg-white/80 px-4 py-3"
              />
            </label>
            <label className="space-y-2 text-sm font-medium text-forest-700">
              Check-in Time
              <input
                type="time"
                value={checkInTime}
                onChange={(event) => setCheckInTime(event.target.value)}
                className="w-full rounded-xl border border-forest-100 bg-white/80 px-4 py-3"
              />
            </label>
            <label className="space-y-2 text-sm font-medium text-forest-700">
              Check-out Date
              <input
                type="date"
                value={checkOutDate}
                onChange={(event) => setCheckOutDate(event.target.value)}
                className="w-full rounded-xl border border-forest-100 bg-white/80 px-4 py-3"
              />
            </label>
            <label className="space-y-2 text-sm font-medium text-forest-700">
              Check-out Time
              <input
                type="time"
                value={checkOutTime}
                onChange={(event) => setCheckOutTime(event.target.value)}
                className="w-full rounded-xl border border-forest-100 bg-white/80 px-4 py-3"
              />
            </label>
            <label className="space-y-2 text-sm font-medium text-forest-700">
              Number of Guests
              <input
                type="number"
                min={1}
                value={guests}
                onChange={(event) => setGuests(Number(event.target.value) || 1)}
                className="w-full rounded-xl border border-forest-100 bg-white/80 px-4 py-3"
              />
            </label>
            <label className="space-y-2 text-sm font-medium text-forest-700 md:col-span-2">
              Notes (optional)
              <textarea
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                rows={4}
                className="w-full rounded-xl border border-forest-100 bg-white/80 px-4 py-3"
                placeholder="Occasion, food preferences, special requests..."
              />
            </label>
          </div>

          {error && (
            <p className="mt-4 inline-flex items-center gap-2 rounded-xl bg-red-50 px-4 py-2 text-sm text-red-700">
              <AlertCircle className="h-4 w-4" /> {error}
            </p>
          )}

          <button
            type="button"
            onClick={sendToWhatsApp}
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-forest-700 via-forest-600 to-forest-500 px-5 py-3 text-sm font-semibold text-white shadow-glow transition hover:scale-[1.02]"
          >
            <MessageCircle className="h-4 w-4" /> Continue Booking on WhatsApp
          </button>
        </Card>

        <Card className="space-y-4">
          <h2 className="font-display text-2xl text-forest-900">Booking Policy</h2>
          <div className="rounded-2xl bg-forest-50 p-4 text-sm text-forest-700">
            <p className="inline-flex items-center gap-2 font-semibold text-forest-900">
              <Clock3 className="h-4 w-4" /> Minimum duration: 12 hours
            </p>
            <p className="mt-2">After 12 hours, you can extend your booking to full-day or multiple-day stays.</p>
          </div>

          {duration && duration.diff >= HOURS_12 && (
            <div className="rounded-2xl bg-emerald-50 p-4 text-sm text-emerald-700">
              <p className="inline-flex items-center gap-2 font-semibold">
                <CheckCircle2 className="h-4 w-4" /> Duration valid
              </p>
              <p className="mt-2">
                {duration.hours.toFixed(1)} hours (~{duration.days.toFixed(2)} days)
              </p>
            </div>
          )}

          <div className="rounded-2xl border border-forest-100 bg-white/80 p-4 text-sm text-forest-600">
            <p className="font-medium text-forest-900">Direct Contact</p>
            <p className="mt-1">{siteConfig.contact.phoneDisplay}</p>
            <p className="mt-1">{siteConfig.contact.address}</p>
          </div>
        </Card>
      </div>
    </div>
  );
};
