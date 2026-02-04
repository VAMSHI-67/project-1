import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { DateRange } from "react-day-picker";
import { Room } from "../../lib/types";
import { Button } from "../shared/Button";

const bookingSchema = z.object({
  roomId: z.string().min(1),
  guestName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(6),
  guests: z.coerce.number().min(1),
  notes: z.string().optional()
});

type BookingFormValues = z.infer<typeof bookingSchema> & {
  checkInDate: string;
  checkOutDate: string;
};

export const BookingForm = ({
  rooms,
  selectedRoomId,
  dateRange,
  onSubmit,
  submitting,
  maxGuestsByRoom,
  onRoomChange
}: {
  rooms: Room[];
  selectedRoomId?: string;
  dateRange: DateRange | undefined;
  onSubmit: (values: BookingFormValues) => void;
  submitting: boolean;
  maxGuestsByRoom: Record<string, number>;
  onRoomChange?: (roomId: string) => void;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue
  } = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      roomId: selectedRoomId ?? "",
      guests: 2
    }
  });

  const roomId = watch("roomId");
  const maxGuests = useMemo(() => maxGuestsByRoom[roomId] ?? 1, [roomId, maxGuestsByRoom]);

  useEffect(() => {
    if (selectedRoomId) {
      setValue("roomId", selectedRoomId);
    }
  }, [selectedRoomId, setValue]);

  return (
    <form
      onSubmit={handleSubmit((values) => {
        if (!dateRange?.from || !dateRange?.to) {
          return;
        }
        onSubmit({
          ...values,
          checkInDate: dateRange.from.toISOString().split("T")[0],
          checkOutDate: dateRange.to.toISOString().split("T")[0]
        });
      })}
      className="space-y-4"
    >
      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-2 text-sm font-medium text-forest-700">
          Room
          <select
            {...register("roomId", {
              onChange: (event) => onRoomChange?.(event.target.value)
            })}
            className="w-full rounded-xl border border-forest-100 bg-white/80 px-4 py-3"
          >
            <option value="">Select room</option>
            {rooms.map((room) => (
              <option key={room.id} value={room.id}>
                {room.name}
              </option>
            ))}
          </select>
          {errors.roomId && <p className="text-xs text-red-600">Room is required.</p>}
        </label>
        <label className="space-y-2 text-sm font-medium text-forest-700">
          Guests
          <input
            type="number"
            min={1}
            max={maxGuests}
            {...register("guests")}
            className="w-full rounded-xl border border-forest-100 bg-white/80 px-4 py-3"
          />
          {errors.guests && (
            <p className="text-xs text-red-600">Guest count must be between 1 and {maxGuests}.</p>
          )}
        </label>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-2 text-sm font-medium text-forest-700">
          Full name
          <input
            {...register("guestName")}
            className="w-full rounded-xl border border-forest-100 bg-white/80 px-4 py-3"
          />
          {errors.guestName && <p className="text-xs text-red-600">Name is required.</p>}
        </label>
        <label className="space-y-2 text-sm font-medium text-forest-700">
          Email
          <input
            type="email"
            {...register("email")}
            className="w-full rounded-xl border border-forest-100 bg-white/80 px-4 py-3"
          />
          {errors.email && <p className="text-xs text-red-600">Valid email required.</p>}
        </label>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-2 text-sm font-medium text-forest-700">
          Phone
          <input
            type="tel"
            {...register("phone")}
            className="w-full rounded-xl border border-forest-100 bg-white/80 px-4 py-3"
          />
          {errors.phone && <p className="text-xs text-red-600">Phone is required.</p>}
        </label>
        <label className="space-y-2 text-sm font-medium text-forest-700">
          Notes
          <input
            {...register("notes")}
            className="w-full rounded-xl border border-forest-100 bg-white/80 px-4 py-3"
          />
        </label>
      </div>
      <div className="pt-4">
        <Button type="submit" disabled={submitting} className="w-full">
          {submitting ? "Submitting..." : "Submit booking"}
        </Button>
      </div>
    </form>
  );
};

export type { BookingFormValues };
