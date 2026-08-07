import { useEffect, useMemo, useState } from "react";
import ErrorFallback from "@/components/ui/error-fallback/error-fallback";
import { Icon } from "@/components/ui/icons";
import LoadingSpinner from "@/components/ui/loading-spinner/loading-spinner";
import RatingPanel from "@/app/rate-candidate/components/rating-panel/rating-panel";
import SkillChips from "@/app/rate-candidate/components/skill-chips/skill-chips";
import VerdictButtons from "@/app/rate-candidate/components/verdict-buttons/verdict-buttons";
import { useRateCandidate } from "@/app/rate-candidate/hooks/use-rate-candidate";
import { RATE_LABELS, CONTEXT_SECTIONS, type ContextSection } from "./rate-candidate.constants";
import type { VerdictValue } from "@/app/rate-candidate/components/verdict-buttons/verdict-buttons.types";
import {
  buildEmptyAnswers,
  allQuestionsScored,
  questionsKey,
} from "@/app/rate-candidate/components/rating-panel/rating-panel.helpers";
import { NOTES_MAX_CHARS, RUBRIC_LEVELS } from "@/app/rate-candidate/components/rating-panel/rating-panel.constants";
import { SKILL_CHIPS } from "@/app/rate-candidate/components/skill-chips/skill-chips.constants";
import type { AnswerMap } from "@/app/rate-candidate/services/rate-candidate.types";
import type { RoundDetailApiResponse } from "@/services/applications/applications.types";
import "./rate-candidate.css";

function formatDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

function buildSections(roundDetail: RoundDetailApiResponse): ContextSection[] {
  const sections: ContextSection[] = [
    { type: "brand" },
    { type: "divider" },
    { type: "badge", text: roundDetail.round ?? "Technical Round 1" },
    { type: "title", text: roundDetail.candidate ?? "Rohan Mehta" },
  ];

  const metaItems: { icon: string; text: string }[] = [
    { icon: "bx bx-briefcase", text: roundDetail.role ?? "Frontend Engineer" },
  ];
  if (roundDetail.occurred_on) {
    metaItems.push({ icon: "bx bx-calendar", text: `Interviewed: ${formatDate(roundDetail.occurred_on)}` });
  }
  metaItems.push({ icon: "bx bx-user", text: `Interviewer: ${roundDetail.interviewer ?? "Avez Qureshi"}` });
  sections.push({ type: "meta", items: metaItems });

  sections.push({ type: "divider" });
  sections.push({
    type: "note",
    icon: "bx bx-info-circle",
    heading: "Guidelines",
    text: "Rate each criterion honestly. Your feedback helps the team make an informed hiring decision. All responses are confidential.",
  });

  return sections;
}

export default function RateCandidate() {
  const {
    formLoading,
    formError,
    formValidated,
    resolvedQuestions,
    roundDetail,
    roundLoading,
    isSubmitting,
    isSubmitted,
    handleSubmitReview,
  } = useRateCandidate();

  const [verdict, setVerdict] = useState<VerdictValue | null>(null);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [answers, setAnswers] = useState<AnswerMap>(() =>
    resolvedQuestions ? buildEmptyAnswers(resolvedQuestions) : {},
  );

  const fingerprint = useMemo(
    () => (resolvedQuestions ? questionsKey(resolvedQuestions) : ""),
    [resolvedQuestions],
  );

  useEffect(() => {
    if (resolvedQuestions) {
      setAnswers(buildEmptyAnswers(resolvedQuestions));
      setVerdict(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fingerprint]);

  const dynamicSections = useMemo(
    () => (roundDetail ? buildSections(roundDetail) : CONTEXT_SECTIONS),
    [roundDetail],
  );

  const canSubmit =
    !!resolvedQuestions &&
    allQuestionsScored(resolvedQuestions, answers) &&
    verdict !== null &&
    !isSubmitting;

  const handleRate = (key: string, score: number) => {
    setAnswers((prev) => ({ ...prev, [key]: { ...prev[key], score } }));
  };

  const handleNotes = (key: string, notes: string) => {
    setAnswers((prev) => ({ ...prev, [key]: { ...prev[key], notes } }));
  };

  const handleToggleSkill = (key: string) => {
    setSelectedSkills((prev) =>
      prev.includes(key) ? prev.filter((s) => s !== key) : [...prev, key],
    );
  };

  const handleClear = () => {
    if (resolvedQuestions) setAnswers(buildEmptyAnswers(resolvedQuestions));
    setVerdict(null);
    setSelectedSkills([]);
  };

  const handleSubmit = async () => {
    if (!canSubmit || !resolvedQuestions || !verdict) return;
    await handleSubmitReview(resolvedQuestions, answers, selectedSkills, verdict);
  };

  if (!formValidated || formLoading || roundLoading) {
    return <LoadingSpinner />;
  }

  if (formError) {
    return <ErrorFallback message={formError} />;
  }

  if (isSubmitted) {
    return (
      <div className="rate-page">
        <div className="rate-submitted">
          <i className="bx bx-check-circle submitted-icon" />
          <h2 className="submitted-title">{RATE_LABELS.SUBMITTED_TITLE}</h2>
          <p className="submitted-desc">Your review has been recorded for this candidate.</p>
          {verdict && (
            <span className="submitted-verdict">
              {verdict === "selected" ? "Selected" : "Rejected"}
            </span>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="rate-page">
      <div className="rate-layout">
        <aside className="rate-context">
          {dynamicSections.map((section, index) => {
            switch (section.type) {
              case "brand":
                return (
                  <div key={index} className="context-brand">
                    <Icon.Logo />
                  </div>
                );
              case "divider":
                return <div key={index} className="context-divider" />;
              case "badge":
                return (
                  <div key={index} className="context-badge">
                    {section.text}
                  </div>
                );
              case "title":
                return (
                  <h2 key={index} className="context-role">
                    {section.text}
                  </h2>
                );
              case "meta":
                return (
                  <div key={index} className="context-meta">
                    {section.items.map((item, i) => (
                      <div key={i} className="context-meta-item">
                        <i className={item.icon} />
                        <span>{item.text}</span>
                      </div>
                    ))}
                  </div>
                );
              case "note":
                return (
                  <div key={index} className="context-note">
                    <div className="context-note-heading">
                      <i className={section.icon} />
                      {section.heading}
                    </div>
                    <p>{section.text}</p>
                  </div>
                );
              default:
                return null;
            }
          })}
        </aside>

        <main className="rate-action">
          <div className="rate-scroll">
            <div className="action-header">
              <div>
                <div className="action-title">{RATE_LABELS.TITLE}</div>
                <div className="action-subtitle">{RATE_LABELS.SUBTITLE}</div>
              </div>
            </div>

            {resolvedQuestions && (
              <RatingPanel
                resolvedQuestions={resolvedQuestions}
                answers={answers}
                onChangeScore={handleRate}
                onChangeNotes={handleNotes}
                levels={[...RUBRIC_LEVELS]}
                notesMaxChars={NOTES_MAX_CHARS}
              />
            )}

            <div className="rate-divider" />

            <SkillChips
              title="Skills Demonstrated"
              chips={[...SKILL_CHIPS]}
              selected={selectedSkills}
              onToggle={handleToggleSkill}
            />

            <VerdictButtons value={verdict} onChange={setVerdict} />
          </div>

          <div className="rate-bottom-bar">
            <button className="rate-clear-btn" onClick={handleClear} type="button">
              <i className="bx bx-reset" />
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
}
