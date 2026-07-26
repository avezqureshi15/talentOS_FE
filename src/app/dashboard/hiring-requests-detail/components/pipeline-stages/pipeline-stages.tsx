import { motion } from "framer-motion";
import "./pipeline-stages.css";
import type { PipelineStagesProps, SubItem } from "./pipeline-stages.types";

const SUB_CLASS: Record<SubItem["color"], string> = {
  success: "pipeline-sub-item--success",
  danger: "pipeline-sub-item--danger",
  warning: "pipeline-sub-item--warning",
  info: "pipeline-sub-item--info",
};

const PipelineStages = ({ stages, activeKey, onStageChange }: PipelineStagesProps) => {
  return (
    <div className="pipeline-root">
      {stages.map((stage) => (
        <motion.div
          key={stage.key}
          className={`pipeline-stage pipeline-stage--${stage.key} ${activeKey === stage.key ? "pipeline-stage--active" : ""}`}
          onClick={() => onStageChange(stage.key)}
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

          {stage.key === "evaluated" ? (
            <div className="pipeline-metrics-row">
              <span className="pipeline-count">{stage.count}</span>
              {stage.subItems && stage.subItems.length > 0 && (
                <div className="pipeline-sub-items-right">
                  {stage.subItems.map((item) => (
                    <span key={item.label} className={`pipeline-sub-item ${SUB_CLASS[item.color]}`}>
                      {item.count}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <span className="pipeline-count">{stage.count}</span>
          )}
        </motion.div>
      ))}
    </div>
  );
};

export default PipelineStages;