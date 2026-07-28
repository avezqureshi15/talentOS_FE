import { motion } from "framer-motion";
import { springSnap } from "@/utils/motion";
import { UI_TABLE_VIEW, UI_CARD_VIEW } from "./detail.constants";

type Props = {
  viewMode: "table" | "card";
  onChange: (mode: "table" | "card") => void;
};

const ViewToggle = ({ viewMode, onChange }: Props) => (
  <div className="persistent-view-toggle">
    <div className="segmented-control">
      <motion.button
        className={`view-toggle-icon${viewMode === "table" ? " view-toggle-icon--active" : ""}`}
        onClick={() => onChange("table")}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        transition={springSnap}
      >
        <i className="bx bx-border-all" />
        <span className="view-toggle-label">{UI_TABLE_VIEW}</span>
      </motion.button>
      <motion.button
        className={`view-toggle-icon${viewMode === "card" ? " view-toggle-icon--active" : ""}`}
        onClick={() => onChange("card")}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        transition={springSnap}
      >
        <i className="bx bx-grid" />
        <span className="view-toggle-label">{UI_CARD_VIEW}</span>
      </motion.button>
    </div>
  </div>
);

export default ViewToggle;
