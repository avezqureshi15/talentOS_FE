import { motion } from "framer-motion";
import { springSnap } from "@/utils/motion";
import { UI_TABLE_VIEW, UI_CARD_VIEW } from "./detail.constants";

type Props = {
  viewMode: "table" | "card";
  onChange: (mode: "table" | "card") => void;
};

const ViewToggle = ({ viewMode, onChange }: Props) => (
  <div className="persistent-view-toggle">
    <motion.button
      className={`view-toggle-icon${viewMode === "table" ? " view-toggle-icon--active" : ""}`}
      onClick={() => onChange("table")}
      title={UI_TABLE_VIEW}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={springSnap}
    >
      <i className="bx bx-border-all" />
    </motion.button>
    <motion.button
      className={`view-toggle-icon${viewMode === "card" ? " view-toggle-icon--active" : ""}`}
      onClick={() => onChange("card")}
      title={UI_CARD_VIEW}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={springSnap}
    >
      <i className="bx bx-grid" />
    </motion.button>
  </div>
);

export default ViewToggle;
