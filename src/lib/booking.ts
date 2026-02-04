import { format, isAfter, isBefore, isEqual, parseISO } from "date-fns";
import { BlockedDateRange, Booking } from "./types";

export const formatDate = (value: Date) => format(value, "yyyy-MM-dd");

export const isRangeOverlap = (
  start: string,
  end: string,
  existingStart: string,
  existingEnd: string
) => {
  const startDate = parseISO(start);
  const endDate = parseISO(end);
  const existingStartDate = parseISO(existingStart);
  const existingEndDate = parseISO(existingEnd);
  return isBefore(startDate, existingEndDate) && isAfter(endDate, existingStartDate);
};

export const hasAvailabilityConflict = (
  start: string,
  end: string,
  bookings: Booking[],
  blocks: BlockedDateRange[]
) => {
  const activeBookings = bookings.filter((booking) => booking.status !== "canceled");
  const bookingConflict = activeBookings.some((booking) =>
    isRangeOverlap(start, end, booking.checkInDate, booking.checkOutDate)
  );
  if (bookingConflict) {
    return true;
  }
  return blocks.some((block) => isRangeOverlap(start, end, block.startDate, block.endDate));
};

export const validateDateRange = (start: string, end: string) => {
  const startDate = parseISO(start);
  const endDate = parseISO(end);
  if (!start || !end) {
    return "Select check-in and check-out dates.";
  }
  if (isAfter(startDate, endDate) || isEqual(startDate, endDate)) {
    return "Check-out must be after check-in.";
  }
  return null;
};
