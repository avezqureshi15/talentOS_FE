import { useState } from "react";
import { motion } from "framer-motion";
import "./pipeline-stages.css";
import type { PipelineStagesProps, SubItem } from "./pipeline-stages.types";

const SUB_ICON: Record<SubItem["color"], string> = {
  success: "bx bx-check-circle",
  danger: "bx bx-x-circle",
  warning: "bx bx-error-circle",
  info: "bx bx-info-circle",
};

const SUB_CLASS: Record<SubItem["color"], string> = {
  success: "pipeline-sub-item--success",
  danger: "pipeline-sub-item--danger",
  warning: "pipeline-sub-item--warning",
  info: "pipeline-sub-item--info",
};

const PipelineStages = ({ stages: initialStages }: PipelineStagesProps) => {
  const [activeKey, setActiveKey] = useState(
    initialStages.find((s) => s.isActive)?.key ?? initialStages[0]?.key,
  );

  return (
    <div className="pipeline-root">
      {initialStages.map((stage) => (
        <motion.div
          key={stage.key}
          className={`pipeline-stage ${activeKey === stage.key ? "pipeline-stage--active" : ""}`}
          onClick={() => setActiveKey(stage.key)}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          whileHover={{ backgroundColor: "var(--surface-card)" }}
        >
          {activeKey === stage.key && (
            <motion.div
              layoutId="pipeline-active-bar"
              className="pipeline-active-bar"
              transition={{ type: "spring", stiffness: 500, damping: 35 }}
            />
          )}

          <span className="pipeline-label">{stage.label}</span>
          <span className="pipeline-count">{stage.count}</span>

          {stage.subItems && stage.subItems.length > 0 && (
            <div className="pipeline-sub-items">
              {stage.subItems.map((item) => (
                <span key={item.label} className={`pipeline-sub-item ${SUB_CLASS[item.color]}`}>
                  <i className={SUB_ICON[item.color]} />
                  {item.count}
                </span>
              ))}
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
};

export default PipelineStages;
