import { motion } from "framer-motion";
import { Users } from "lucide-react";
import { Link } from "react-router-dom";
import { Room } from "../../lib/types";

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export const RoomCard = ({ room }: { room: Room }) => (
  <motion.div
    variants={cardVariants}
    whileHover={{ y: -6 }}
    className="glass-card overflow-hidden rounded-3xl"
  >
    <div className="group relative h-56 overflow-hidden">
      <img
        src={room.images[0]}
        alt={room.name}
        className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-forest-900/60 via-forest-900/10 to-transparent" />
      <div className="absolute bottom-4 left-4 rounded-full bg-white/80 px-4 py-2 text-sm font-semibold">
        ${room.pricePerNight} / night
      </div>
    </div>
    <div className="space-y-4 p-6">
      <div>
        <h3 className="font-display text-xl text-forest-900">{room.name}</h3>
        <p className="text-sm text-forest-600">{room.description}</p>
      </div>
      <div className="flex items-center gap-2 text-sm text-forest-500">
        <Users className="h-4 w-4" />
        <span>Up to {room.maxGuests} guests</span>
      </div>
      <Link
        to={`/rooms/${room.id}`}
        className="inline-flex items-center justify-center rounded-full border border-forest-300 px-4 py-2 text-sm font-semibold text-forest-800 transition hover:bg-forest-50"
      >
        View details
      </Link>
    </div>
  </motion.div>
);
