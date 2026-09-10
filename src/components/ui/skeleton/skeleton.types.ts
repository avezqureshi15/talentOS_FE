export type SkeletonVariant = "text" | "circle" | "rect";

export type SkeletonProps = {
  variant?: SkeletonVariant;
  width?: string;
  height?: string;
  borderRadius?: string;
  className?: string;
};
