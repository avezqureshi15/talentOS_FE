import { motion } from "framer-motion";
import type { ButtonProps } from "./button.types";
import { BUTTON_LOADING_SPINNER_CLASS } from "./button.constants";
import { springSnap } from "@/utils/motion";
import "./button.css";

const Button = ({
  children,
  onClick,
  type = "button",
  variant,
  size,
  loading = false,
  disabled = false,
  icon,
  iconPosition = "left",
  className = "",
  title,
  fullWidth = false,
  loadingText,
}: ButtonProps) => {
  const classes = [
    className,
    loading && "btn--loading",
    variant && `btn--${variant}`,
    size && `btn--${size}`,
    fullWidth && "btn--full",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <motion.button
      className={classes}
      onClick={onClick}
      type={type}
      disabled={disabled || loading}
      title={title}
      whileHover={!disabled && !loading ? { scale: 1.02 } : undefined}
      whileTap={!disabled && !loading ? { scale: 0.97 } : undefined}
      transition={springSnap}
    >
      {loading ? (
        <>
          <i className={BUTTON_LOADING_SPINNER_CLASS} />
          <span>{loadingText ?? children}</span>
        </>
      ) : (
        <>
          {icon && iconPosition === "left" && <i className={icon} />}
          {children}
          {icon && iconPosition === "right" && <i className={icon} />}
        </>
      )}
    </motion.button>
  );
};

export default Button;
