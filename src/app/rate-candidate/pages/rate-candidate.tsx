import { useState, useCallback } from "react";
import { Icon } from "@/components/ui/icons";
import RatingPanel from "@/app/rate-candidate/components/rating-panel/rating-panel";
import ReviewForm from "@/app/rate-candidate/components/review-form/review-form";
import SkillChips from "@/app/rate-candidate/components/skill-chips/skill-chips";
import VerdictButtons from "@/app/rate-candidate/components/verdict-buttons/verdict-buttons";
import type { VerdictValue } from "@/app/rate-candidate/components/verdict-buttons/verdict-buttons.types";
import { RATE_LABELS, CONTEXT_SECTIONS } from "./rate-candidate.constants";
import { RATING_CRITERIA, RUBRIC_LEVELS } from "@/app/rate-candidate/components/rating-panel/rating-panel.constants";
import { SKILL_CHIPS } from "@/app/rate-candidate/components/skill-chips/skill-chips.constants";
import "./rate-candidate.css";

const initRatings = () => {
  const r: Record<string, number> = {};
  RATING_CRITERIA.forEach((c) => { r[c.key] = 0; });
  return r;
};

const RateCandidate = () => {
  const [ratings, setRatings] = useState<Record<string, number>>(initRatings);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [review, setReview] = useState("");
  const [verdict, setVerdict] = useState<VerdictValue | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleChangeRating = useCallback((key: string, value: number) => {
    setRatings((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleToggleSkill = useCallback((key: string) => {
    setSelectedSkills((prev) =>
      prev.includes(key) ? prev.filter((s) => s !== key) : [...prev, key]
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

  const handleSubmit = useCallback(() => {
    setSubmitted(true);
  }, []);

  if (submitted) {
    const values = Object.values(ratings).filter(Boolean);
    const avg = values.length > 0 ? (values.reduce((a, b) => a + b, 0) / values.length).toFixed(1) : "—";
    const labelMap: Record<VerdictValue, string> = { reject: "Rejected", hold: "On Hold", advance: "Advanced" };
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

  const canSubmit = Object.values(ratings).some(Boolean) && verdict !== null;

  return (
    <div className="rate-page">
      <div className="rate-layout">
        <aside className="rate-context">
          <div className="context-body">
            {CONTEXT_SECTIONS.map((section, i) => {
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
            <button className="rate-clear-btn" onClick={handleClear} type="button">
              <i className="bx bx-refresh" />
              {RATE_LABELS.CLEAR}
            </button>
            <button
              className="rate-submit-btn"
              onClick={handleSubmit}
              disabled={!canSubmit}
              type="button"
            >
              <i className="bx bx-send" />
              {RATE_LABELS.SUBMIT}
            </button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default RateCandidate;
