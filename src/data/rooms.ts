import { Room } from "../lib/types";

export const demoRooms: Room[] = [
  {
    id: "meadow-suite",
    name: "Meadow Suite",
    description:
      "Wake up to rolling pastures, a private balcony, and handcrafted interiors inspired by local timber.",
    pricePerNight: 240,
    maxGuests: 2,
    amenities: ["King bed", "Mountain view", "Soaking tub", "Private balcony", "Farm breakfast"],
    images: [
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1505691723518-36a5ac3be353?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80"
    ]
  },
  {
    id: "orchard-cabin",
    name: "Orchard Cabin",
    description:
      "A cozy cedar cabin tucked beside the orchard, with firelight evenings and private garden seating.",
    pricePerNight: 180,
    maxGuests: 3,
    amenities: ["Queen bed", "Fireplace", "Garden patio", "Kitchenette", "Organic toiletries"],
    images: [
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1502672023488-70e25813eb80?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?auto=format&fit=crop&w=1200&q=80"
    ]
  },
  {
    id: "brookside-loft",
    name: "Brookside Loft",
    description:
      "An airy loft with panoramic views, a reading nook, and direct access to the river trail.",
    pricePerNight: 210,
    maxGuests: 4,
    amenities: ["Two double beds", "Panoramic view", "Reading nook", "Outdoor shower", "Yoga mats"],
    images: [
      "https://images.unsplash.com/photo-1505691723518-36a5ac3be353?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1499696010181-8e90c19a48e0?auto=format&fit=crop&w=1200&q=80"
    ]
  }
];
