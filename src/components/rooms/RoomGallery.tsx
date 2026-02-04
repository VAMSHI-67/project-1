import { motion } from "framer-motion";

export const RoomGallery = ({ images }: { images: string[] }) => (
  <div className="grid gap-4 md:grid-cols-3">
    {images.map((image, index) => (
      <motion.div
        key={image}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        className="overflow-hidden rounded-3xl"
      >
        <img src={image} alt="Room" className="h-56 w-full object-cover" />
      </motion.div>
    ))}
  </div>
);
