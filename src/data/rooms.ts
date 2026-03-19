import { Room } from "../lib/types";
import b1 from "../assets/images/b1.jpg";
import b2 from "../assets/images/b2.jpg";
import k1 from "../assets/images/k1.jpg";
import k2 from "../assets/images/k2.jpg";
import k3 from "../assets/images/k3.jpg";
import k4 from "../assets/images/k4.jpg";
import k5 from "../assets/images/k5.jpg";
import k6 from "../assets/images/k6.jpg";
import k7 from "../assets/images/k7.jpg";

export const demoRooms: Room[] = [
  {
    id: "meadow-suite",
    name: "Meadow Suite",
    description:
      "Wake up to rolling pastures, a private balcony, and handcrafted interiors inspired by local timber.",
    pricePerNight: 240,
    maxGuests: 2,
    amenities: ["King bed", "Mountain view", "Soaking tub", "Private balcony", "Farm breakfast"],
    images: [k3, k4, k5]
  },
  {
    id: "orchard-cabin",
    name: "Orchard Cabin",
    description:
      "A cozy cedar cabin tucked beside the orchard, with firelight evenings and private garden seating.",
    pricePerNight: 180,
    maxGuests: 3,
    amenities: ["Queen bed", "Fireplace", "Garden patio", "Kitchenette", "Organic toiletries"],
    images: [b1, b2, k6]
  },
  {
    id: "brookside-loft",
    name: "Brookside Loft",
    description:
      "An airy loft with panoramic views, a reading nook, and direct access to the river trail.",
    pricePerNight: 210,
    maxGuests: 4,
    amenities: ["Two double beds", "Panoramic view", "Reading nook", "Outdoor shower", "Yoga mats"],
    images: [k7, k2, k1]
  }
];
