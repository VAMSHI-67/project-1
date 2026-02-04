import { Sparkles } from "lucide-react";

export const AmenityList = ({ amenities }: { amenities: string[] }) => (
  <div className="grid gap-3 sm:grid-cols-2">
    {amenities.map((amenity) => (
      <div key={amenity} className="flex items-center gap-2 text-sm text-forest-700">
        <Sparkles className="h-4 w-4 text-gold-400" />
        <span>{amenity}</span>
      </div>
    ))}
  </div>
);
