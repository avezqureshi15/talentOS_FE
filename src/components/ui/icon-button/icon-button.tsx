import { motion } from "framer-motion";
import "./icon-button.css";
import type { IconButtonProps } from "./icon-button.types";
import { springSnap } from "@/utils/motion";

const IconButton: React.FC<IconButtonProps> = ({
  children,
  onClick,
  className = "",
  size = "md",
  title,
}) => {
  return (
    <motion.button
      onClick={onClick}
      className={`icon-btn icon-btn--${size} ${className}`}
      title={title}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      transition={springSnap}
    >
      {children}
    </motion.button>
  );
};

export default IconButton;