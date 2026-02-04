import { motion } from "framer-motion";

export const ToggleSwitch = ({
  enabled,
  onChange
}: {
  enabled: boolean;
  onChange: (value: boolean) => void;
}) => (
  <button
    type="button"
    onClick={() => onChange(!enabled)}
    className={`relative h-7 w-12 rounded-full transition ${enabled ? "bg-forest-600" : "bg-forest-200"}`}
    aria-pressed={enabled}
  >
    <motion.span
      layout
      className="absolute top-1 h-5 w-5 rounded-full bg-white shadow"
      animate={{ x: enabled ? 20 : 4 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    />
  </button>
);
