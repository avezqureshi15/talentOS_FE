import type { ChipProps } from "./chip.types";
import { CHIP_VARIANTS, CHIP_SIZES } from "./chip.constants";
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
      <button className={classNames} onClick={onClick} disabled={disabled} type="button" title={title}>
        {content}
      </button>
    );
  }

  return (
    <span className={classNames} title={title}>
      {content}
    </span>
  );
};

export default Chip;
