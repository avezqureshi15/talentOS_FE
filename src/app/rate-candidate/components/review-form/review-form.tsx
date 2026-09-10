import type { ReviewFormProps } from "./review-form.types";
import { REVIEW_LABELS } from "./review-form.constants";
import "./review-form.css";

const ReviewForm = ({ review, onChangeReview, maxChars }: ReviewFormProps) => {
  const remaining = maxChars - review.length;
  const isOver = remaining < 0;

  return (
    <div className="review-form">
      <h3 className="review-form-title">{REVIEW_LABELS.TITLE}</h3>
      <p className="review-helper">{REVIEW_LABELS.HELPER}</p>
      <textarea
        className={`review-textarea${isOver ? " review-textarea--over" : ""}`}
        rows={5}
        value={review}
        onChange={(e) => onChangeReview(e.target.value)}
        placeholder={REVIEW_LABELS.PLACEHOLDER}
        maxLength={maxChars + 50}
      />
      <span className={`review-counter${isOver ? " review-counter--over" : ""}`}>
        {review.length}/{maxChars}
      </span>
    </div>
  );
};

export default ReviewForm;
