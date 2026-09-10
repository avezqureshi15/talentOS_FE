import { motion } from "framer-motion";
import type { ChipProps } from "./chip.types";
import { CHIP_VARIANTS, CHIP_SIZES } from "./chip.constants";
import { springSnap } from "@/utils/motion";
import "./chip.css";

const Chip = ({
  children,
  variant = "neutral",
  size = "md",
  icon,
  onRemove,
  onClick,
  active = false,
  disabled = false,
  className = "",
  title,
}: ChipProps) => {
  const classNames = [
    "chip",
    CHIP_VARIANTS[variant],
    CHIP_SIZES[size],
    onClick ? "chip--clickable" : "",
    disabled ? "chip--disabled" : "",
    active ? "chip--active" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const content = (
    <>
      {icon && <i className={`bx ${icon} chip-icon`} />}
      {children}
      {onRemove && (
        <button
          className="chip-remove"
          onClick={(e) => {
            e.stopPropagation();
            onRemove(e);
          }}
          type="button"
          aria-label="Remove"
        >
          <i className="bx bx-x" />
        </button>
      )}
    </>
  );

  if (onClick) {
    return (
      <motion.button
        className={classNames}
        onClick={onClick}
        disabled={disabled}
        type="button"
        title={title}
        whileHover={!disabled ? { scale: 1.04 } : undefined}
        whileTap={!disabled ? { scale: 0.96 } : undefined}
        transition={springSnap}
      >
        {content}
      </motion.button>
    );
  }

  return (
    <span className={classNames} title={title}>
      {content}
    </span>
  );
};

export default Chip;
