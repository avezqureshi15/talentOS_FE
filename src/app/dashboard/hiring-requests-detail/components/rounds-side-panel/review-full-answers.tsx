import type { ReviewEntity } from "./rounds-side-panel.types";
import { RATING_LABELS, ROUNDS_FALLBACK } from "./rounds-side-panel.constants";

type ReviewFullAnswersProps = {
  entity: ReviewEntity;
};

const ReviewFullAnswers = ({ entity }: ReviewFullAnswersProps) => {
  if (entity.phases.length > 0) {
    return (
      <div className="rp-full-review">
        {entity.phases.map((phase) => (
          <div key={phase.phase} className="rp-full-phase">
            <span className="rp-full-phase-title">{phase.phase}</span>
            <ul className="rp-full-answers">
              {phase.answers.map((answer, idx) => (
                <li key={`${phase.phase}-${idx}`} className="rp-full-answer">
                  <div className="rp-full-answer-header">
                    <span className="rp-full-question">{answer.question}</span>
                    <span className="rp-rating-score">
                      <span className="rp-score-earned">{answer.score}</span>
                      <span className="rp-score-sep">/</span>
                      <span className="rp-score-total">5</span>
                    </span>
                  </div>
                  {answer.notes?.trim() && (
                    <p className="rp-full-notes">{answer.notes}</p>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    );
  }

  if (entity.ratings.length > 0) {
    return (
      <div className="rp-full-review">
        <div className="rp-ratings">
          {entity.ratings.map((r, i) => (
            <div key={i} className="rp-rating-row">
              <span className="rp-rating-label">
                {RATING_LABELS[r.label] ?? (r.label === "fitscore" ? "ATS Score" : r.label)}
              </span>
              <span className="rp-rating-score">
                <span className="rp-score-earned">{r.score}</span>
                <span className="rp-score-sep">/</span>
                <span className="rp-score-total">{r.maxScore}</span>
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="rp-full-review rp-full-review--empty">
      <p>{ROUNDS_FALLBACK.NO_FULL_REVIEW}</p>
    </div>
  );
};

export default ReviewFullAnswers;
