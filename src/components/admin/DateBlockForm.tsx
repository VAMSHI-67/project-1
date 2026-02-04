import { useState } from "react";
import { useForm } from "react-hook-form";
import { DateRange } from "react-day-picker";
import { Room } from "../../lib/types";
import { Button } from "../shared/Button";
import { DateRangePicker } from "../booking/DateRangePicker";
import { formatDate, validateDateRange } from "../../lib/booking";

export type DateBlockValues = {
  roomId: string;
  startDate: string;
  endDate: string;
  reason: string;
};

export const DateBlockForm = ({
  rooms,
  onSubmit,
  submitting
}: {
  rooms: Room[];
  onSubmit: (values: DateBlockValues) => void;
  submitting: boolean;
}) => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [error, setError] = useState<string | null>(null);
  const { register, handleSubmit } = useForm<DateBlockValues>({
    defaultValues: {
      roomId: rooms[0]?.id ?? ""
    }
  });

  return (
    <form
      onSubmit={handleSubmit((values) => {
        if (!dateRange?.from || !dateRange?.to) {
          setError("Select a start and end date.");
          return;
        }
        const startDate = formatDate(dateRange.from);
        const endDate = formatDate(dateRange.to);
        const rangeError = validateDateRange(startDate, endDate);
        if (rangeError) {
          setError(rangeError);
          return;
        }
        setError(null);
        onSubmit({ ...values, startDate, endDate });
      })}
      className="space-y-4"
    >
      <label className="block text-sm font-medium text-forest-700">
        Room
        <select
          {...register("roomId")}
          className="mt-2 w-full rounded-xl border border-forest-100 bg-white/80 px-4 py-3"
        >
          {rooms.map((room) => (
            <option key={room.id} value={room.id}>
              {room.name}
            </option>
          ))}
        </select>
      </label>
      <div className="rounded-3xl border border-forest-100 bg-white/70 p-4">
        <DateRangePicker value={dateRange} onChange={setDateRange} disabledDates={[]} />
      </div>
      <label className="block text-sm font-medium text-forest-700">
        Reason
        <input
          {...register("reason")}
          className="mt-2 w-full rounded-xl border border-forest-100 bg-white/80 px-4 py-3"
        />
      </label>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <Button type="submit" disabled={submitting} className="w-full">
        {submitting ? "Blocking..." : "Block dates"}
      </Button>
    </form>
  );
};
