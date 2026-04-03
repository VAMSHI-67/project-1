import { HTMLMotionProps, motion } from "framer-motion";
import { clsx } from "clsx";

const buttonVariants = {
  rest: { scale: 1 },
  hover: { scale: 1.03 },
  tap: { scale: 0.98 }
};

type ButtonProps = HTMLMotionProps<"button"> & {
  variant?: "primary" | "ghost" | "outline";
};

export const Button = ({ variant = "primary", className, ...props }: ButtonProps) => {
  const styles = {
    primary:
      "bg-gradient-to-r from-forest-700 via-forest-600 to-forest-500 text-white shadow-glow",
    ghost: "bg-white/30 text-forest-900 hover:bg-white/60",
    outline: "border border-forest-300 text-forest-800 hover:bg-forest-50"
  };

  return (
    <motion.button
      type="button"
      variants={buttonVariants}
      initial="rest"
      whileHover="hover"
      whileTap="tap"
      className={clsx(
        "rounded-full px-5 py-3 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest-600",
        styles[variant],
        className
      )}
      {...props}
    />
  );
};
