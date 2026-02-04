import { DayPicker, DateRange } from "react-day-picker";
import { startOfDay } from "date-fns";
import { formatDate } from "../../lib/booking";

export const DateRangePicker = ({
  value,
  onChange,
  disabledDates
}: {
  value: DateRange | undefined;
  onChange: (range: DateRange | undefined) => void;
  disabledDates: string[];
}) => {
  const today = startOfDay(new Date());
  const disabled = [
    { before: today },
    ...disabledDates.map((date) => new Date(date))
  ];

  return (
    <div className="rounded-3xl border border-forest-100 bg-white/70 p-4">
      <DayPicker
        mode="range"
        selected={value}
        onSelect={onChange}
        disabled={disabled}
        numberOfMonths={2}
        fromDate={today}
        modifiersStyles={{
          selected: { backgroundColor: "#3c6832", color: "white" },
          range_middle: { backgroundColor: "#dce7d7", color: "#2f5127" }
        }}
      />
      {value?.from && value?.to && (
        <p className="mt-3 text-sm text-forest-600">
          Selected: {formatDate(value.from)} → {formatDate(value.to)}
        </p>
      )}
    </div>
  );
};
