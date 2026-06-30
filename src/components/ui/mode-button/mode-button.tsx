import "./mode-button.css";
import type { ModeButtonProps } from "./mode-button.types";

const ModeButton = ({ icon }: ModeButtonProps) => {
  return (
    <button className="mode-btn">
      Fast Mode {icon}
    </button>
  );
};

export default ModeButton;