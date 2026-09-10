import type { SkeletonProps } from "./skeleton.types";
import "./skeleton.css";

const Skeleton = ({ variant = "text", width, height, borderRadius, className = "" }: SkeletonProps) => {
  return (
    <div
      className={`skeleton skeleton--${variant} ${className}`}
      style={{ width, height, borderRadius }}
      aria-hidden="true"
    />
  );
};

export default Skeleton;
