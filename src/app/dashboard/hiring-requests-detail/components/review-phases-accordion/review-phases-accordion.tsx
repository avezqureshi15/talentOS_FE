import { useCallback, useMemo, useState } from "react";
import {
  REVIEW_PHASE_MAX_SCORE,
  overallAverageScore,
  phaseAverageScore,
  scoreTone,
} from "./review-phases-accordion.helpers";
import type { ReviewPhasesAccordionProps } from "./review-phases-accordion.types";
import ReviewScoreChip from "./review-score-chip";
import "./review-phases-accordion.css";

const ReviewPhasesAccordion = ({
  phases,
  averageRating,
  maxScore = REVIEW_PHASE_MAX_SCORE,
}: ReviewPhasesAccordionProps) => {
  const phaseIds = useMemo(
    () => phases.map((phase, index) => `${index}:${phase.phase}`),
    [phases],
  );
  const phasesKey = useMemo(() => phaseIds.join("|"), [phaseIds]);

  const [openState, setOpenState] = useState<{ key: string; ids: Set<string> } | null>(null);
  const openIds = openState?.key === phasesKey
    ? openState.ids
    : (phaseIds[0] ? new Set([phaseIds[0]]) : new Set<string>());

  const togglePhase = useCallback((id: string) => {
    setOpenState((prev) => {
      const current = prev?.key === phasesKey
        ? prev.ids
        : (phaseIds[0] ? new Set([phaseIds[0]]) : new Set<string>());
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return { key: phasesKey, ids: next };
    });
  }, [phaseIds, phasesKey]);

  const overall = overallAverageScore(phases, averageRating);
  if (phases.length === 0) return null;

  return (
    <div className="rpa-root">
      <div className="rpa-list">
        {phases.map((phase, index) => {
          const id = phaseIds[index];
          const isOpen = openIds.has(id);
          const phaseAvg = phaseAverageScore(phase.answers);

          return (
            <div
              key={id}
              className={`rpa-card${isOpen ? " rpa-card--open" : ""}`}
            >
              <button
                type="button"
                className="rpa-card-header"
                onClick={() => togglePhase(id)}
                aria-expanded={isOpen}
              >
                <div className="rpa-card-header-main">
                  <span className="rpa-step">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="rpa-phase-name">{phase.phase}</span>
                </div>
                <div className="rpa-card-header-meta">
                  {phaseAvg !== null && (
                    <ReviewScoreChip score={phaseAvg} maxScore={maxScore} />
                  )}
                  <i className={`bx bx-chevron-down rpa-chevron${isOpen ? " rpa-chevron--open" : ""}`} />
                </div>
              </button>

              {isOpen && (
                <div className="rpa-card-body">
                  <ol className="rpa-answers">
                    {phase.answers.map((answer, answerIndex) => {
                      const tone = scoreTone(answer.score, maxScore);
                      return (
                        <li
                          key={`${id}:${answerIndex}`}
                          className={`rpa-answer rpa-answer--${tone}`}
                        >
                          <div className="rpa-answer-top">
                            <span className="rpa-question">{answer.question}</span>
                            <ReviewScoreChip score={answer.score} maxScore={maxScore} />
                          </div>
                          {answer.notes && (
                            <p className="rpa-notes">{answer.notes}</p>
                          )}
                        </li>
                      );
                    })}
                  </ol>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {overall !== null && (
        <div className="rpa-overall">
          <span className="rpa-overall-label">Average</span>
          <ReviewScoreChip score={overall} maxScore={maxScore} />
        </div>
      )}
    </div>
  );
};

export default ReviewPhasesAccordion;
