import { motion } from "framer-motion";

const SkeletonRow = () => (
  <motion.div
    className="table-row"
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ type: "spring", stiffness: 300, damping: 25 }}
  >
    <div className="role-cell">
      <div className="skeleton skeleton-title" />
      <div className="skeleton skeleton-meta" />
    </div>
    <div className="skeleton skeleton-badge" />
    <div className="skeleton skeleton-badge" />
    <div className="skeleton skeleton-badge" />
    <div className="skeleton skeleton-date" />
  </motion.div>
);

export default SkeletonRow;
