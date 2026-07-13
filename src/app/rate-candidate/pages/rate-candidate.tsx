import { useState, useCallback } from "react";
import { Icon } from "@/components/ui/icons";
import LoadingSpinner from "@/components/ui/loading-spinner/loading-spinner";
import ErrorFallback from "@/components/ui/error-fallback/error-fallback";
import RatingPanel from "@/app/rate-candidate/components/rating-panel/rating-panel";
import ReviewForm from "@/app/rate-candidate/components/review-form/review-form";
import SkillChips from "@/app/rate-candidate/components/skill-chips/skill-chips";
import VerdictButtons from "@/app/rate-candidate/components/verdict-buttons/verdict-buttons";
import type { VerdictValue } from "@/app/rate-candidate/components/verdict-buttons/verdict-buttons.types";
import { RATE_LABELS } from "./rate-candidate.constants";
import { RATING_CRITERIA, RUBRIC_LEVELS } from "@/app/rate-candidate/components/rating-panel/rating-panel.constants";
import { SKILL_CHIPS } from "@/app/rate-candidate/components/skill-chips/skill-chips.constants";
import { CONTEXT_SECTIONS } from "./rate-candidate.constants";
import { useRateCandidate } from "../hooks/use-rate-candidate";
import "./rate-candidate.css";

const initRatings = () => {
  const r: Record<string, number> = {};
  RATING_CRITERIA.forEach((c) => { r[c.key] = 0; });
  return r;
};

const RateCandidate = () => {
  const { formId, formLoading, formError, formValid, formValidated, roundDetail, roundLoading, isSubmitting, isSubmitted, submitError, handleSubmitReview } = useRateCandidate();

  const [ratings, setRatings] = useState<Record<string, number>>(initRatings);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [review, setReview] = useState("");
  const [verdict, setVerdict] = useState<VerdictValue | null>(null);

  const handleChangeRating = useCallback((key: string, value: number) => {
    setRatings((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleToggleSkill = useCallback((key: string) => {
    setSelectedSkills((prev) =>
      prev.includes(key) ? prev.filter((s) => s !== key) : [...prev, key],
    );
  }, []);

  const handleVerdict = useCallback((value: VerdictValue) => {
    setVerdict(value);
  }, []);

  const handleClear = useCallback(() => {
    setRatings(initRatings());
    setSelectedSkills([]);
    setReview("");
    setVerdict(null);
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!verdict) return;
    try {
      await handleSubmitReview(ratings, selectedSkills, review, verdict);
    } catch {
      // error surfaced by submitError
    }
  }, [ratings, selectedSkills, review, verdict, handleSubmitReview]);

  if (formLoading || (!formValidated && !!formId)) {
    return (
      <div className="rate-page"><LoadingSpinner /></div>
    );
  }

  if (formError) {
    return (
      <div className="rate-page">
        <ErrorFallback title="Review Form" message={formError} />
      </div>
    );
  }

  if (!formValid || !formId) {
    return (
      <div className="rate-page">
        <ErrorFallback title="Review Form" message="Invalid review link." />
      </div>
    );
  }

  if (isSubmitted) {
    const values = Object.values(ratings).filter(Boolean);
    const avg = values.length > 0 ? (values.reduce((a, b) => a + b, 0) / values.length).toFixed(1) : "—";
    const labelMap: Record<VerdictValue, string> = { selected: "Selected", rejected: "Rejected" };
    return (
      <div className="rate-page">
        <div className="rate-submitted">
          <i className="bx bx-check-circle submitted-icon" />
          <h2 className="submitted-title">{RATE_LABELS.SUBMITTED_TITLE}</h2>
          <p className="submitted-desc">Average Rating: {avg}/4</p>
          {verdict && <p className="submitted-verdict">{labelMap[verdict]}</p>}
        </div>
      </div>
    );
  }

  const dynamicSections = roundDetail
    ? [
        { type: "brand" as const },
        { type: "divider" as const },
        { type: "badge" as const, text: roundDetail.round ?? "Interview" },
        { type: "title" as const, text: roundDetail.candidate ?? "Candidate" },
        {
          type: "meta" as const,
          items: [
            ...(roundDetail.role ? [{ icon: "bx bx-briefcase" as const, text: roundDetail.role }] : []),
            ...(roundDetail.occurred_on ? [{ icon: "bx bx-calendar" as const, text: `Interviewed: ${roundDetail.occurred_on}` }] : []),
            ...(roundDetail.interviewer ? [{ icon: "bx bx-user" as const, text: `Interviewer: ${roundDetail.interviewer}` }] : []),
          ],
        },
        { type: "divider" as const },
        {
          type: "note" as const,
          icon: "bx bx-info-circle" as const,
          heading: "Guidelines",
          text: "Rate each criterion honestly. Your feedback helps the team make an informed hiring decision. All responses are confidential.",
        },
      ]
    : CONTEXT_SECTIONS;

  const canSubmit = Object.values(ratings).some(Boolean) && verdict !== null && !isSubmitting;

  return (
    <div className="rate-page">
      <div className="rate-layout">
        <aside className="rate-context">
          <div className="context-body">
            {dynamicSections.map((section, i) => {
              switch (section.type) {
                case "brand":
                  return <div key={i} className="context-brand"><Icon.Logo /></div>;
                case "divider":
                  return <div key={i} className="context-divider" />;
                case "badge":
                  return <span key={i} className="context-badge">{section.text}</span>;
                case "title":
                  return <h2 key={i} className="context-role">{section.text}</h2>;
                case "meta":
                  return (
                    <div key={i} className="context-meta">
                      {section.items.map((item, j) => (
                        <div key={j} className="context-meta-item">
                          <i className={item.icon} />
                          <span>{item.text}</span>
                        </div>
                      ))}
                    </div>
                  );
                case "note":
                  return (
                    <div key={i} className="context-note">
                      <div className="context-note-heading">
                        <i className={section.icon} />
                        <span>{section.heading}</span>
                      </div>
                      <p>{section.text}</p>
                    </div>
                  );
              }
            })}
          </div>
        </aside>

        <main className="rate-action">
          {roundLoading && <LoadingSpinner />}

          {!roundLoading && (
            <>
              <div className="rate-scroll">
                <div className="action-header">
                  <h1 className="action-title">{RATE_LABELS.TITLE}</h1>
                  <span className="action-subtitle">{RATE_LABELS.SUBTITLE}</span>
                </div>

                <div className="rate-main">
                  <RatingPanel
                    criteria={[...RATING_CRITERIA]}
                    ratings={ratings}
                    onChangeRating={handleChangeRating}
                    levels={[...RUBRIC_LEVELS]}
                  />

                  <div className="rate-divider" />

                  <SkillChips
                    title="Hard Skills Verified"
                    chips={[...SKILL_CHIPS]}
                    selected={selectedSkills}
                    onToggle={handleToggleSkill}
                  />

                  <div className="rate-divider" />

                  <ReviewForm
                    review={review}
                    onChangeReview={setReview}
                    maxChars={RATE_LABELS.MAX_CHARS}
                  />

                  <div className="rate-divider" />

                  <VerdictButtons
                    value={verdict}
                    onChange={handleVerdict}
                  />
                </div>
              </div>

              <div className="rate-bottom-bar">
                {submitError && <span className="rate-error">{submitError}</span>}
                <button className="rate-clear-btn" onClick={handleClear} type="button" disabled={isSubmitting}>
                  <i className="bx bx-refresh" />
                  {RATE_LABELS.CLEAR}
                </button>
                <button
                  className="rate-submit-btn"
                  onClick={handleSubmit}
                  disabled={!canSubmit}
                  type="button"
                >
                  {isSubmitting ? <LoadingSpinner /> : <i className="bx bx-send" />}
                  {isSubmitting ? "Submitting..." : RATE_LABELS.SUBMIT}
                </button>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default RateCandidate;
