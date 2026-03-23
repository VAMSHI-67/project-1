import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { RoomCard } from "../components/rooms/RoomCard";
import { demoRooms } from "../data/rooms";
import { subscribeRoomImages } from "../lib/firestore";
import { WalkthroughImage } from "../lib/types";

export const RoomsPage = () => {
  const [roomImages, setRoomImages] = useState<WalkthroughImage[]>([]);

  useEffect(() => {
    const unsubscribe = subscribeRoomImages(setRoomImages);
    return () => unsubscribe();
  }, []);

  const roomsWithImages = useMemo(() => {
    if (!roomImages.length) return demoRooms;
    return demoRooms.map((room, index) => {
      const total = roomImages.length;
      const imageSet = [
        roomImages[index % total].url,
        roomImages[(index + 1) % total].url,
        roomImages[(index + 2) % total].url
      ];
      return { ...room, images: imageSet };
    });
  }, [roomImages]);

  return (
    <div className="section-padding">
      <div className="mb-10">
        <p className="text-sm uppercase tracking-[0.2em] text-forest-500">Our Rooms</p>
        <h1 className="mt-3 font-display text-4xl text-forest-900">Suites designed for slow, luxe stays.</h1>
        <p className="mt-3 text-forest-600">
          Each room blends natural textures, soft lighting, and thoughtful amenities that celebrate farm-to-table living.
        </p>
      </div>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={{ visible: { transition: { staggerChildren: 0.2 } } }}
        className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
      >
        {roomsWithImages.map((room) => (
          <RoomCard key={room.id} room={room} />
        ))}
      </motion.div>
    </div>
  );
};
