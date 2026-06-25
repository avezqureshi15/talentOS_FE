import "./loading-spinner.css";
import type { LoadingSpinnerProps } from "./loading-spinner.types";

export default function LoadingSpinner({
  size = "md",
  label,
  fullPage = false,
}: LoadingSpinnerProps) {
  const content = (
    <div className={`spinner spinner--${size}`}>
      <div className="spinner__dot spinner__dot--1" />
      <div className="spinner__dot spinner__dot--2" />
      <div className="spinner__dot spinner__dot--3" />
      {label && <p className="spinner__label">{label}</p>}
    </div>
  );

  if (fullPage) {
    return <div className="spinner--full-page">{content}</div>;
  }

  return content;
}
