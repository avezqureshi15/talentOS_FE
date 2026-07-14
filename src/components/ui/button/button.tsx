import type { ButtonProps } from "./button.types";
import { BUTTON_LOADING_SPINNER_CLASS } from "./button.constants";
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
    <button
      className={classes}
      onClick={onClick}
      type={type}
      disabled={disabled || loading}
      title={title}
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
    </button>
  );
};

export default Button;
