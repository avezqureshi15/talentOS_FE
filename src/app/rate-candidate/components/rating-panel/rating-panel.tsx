import type { RatingPanelProps } from "./rating-panel.types";
import { answerKey, averageScore } from "./rating-panel.helpers";
import "./rating-panel.css";

const RatingPanel = ({
  phases,
  answers,
  onChangeScore,
  onChangeNotes,
  levels,
  notesMaxChars,
}: RatingPanelProps) => {
  const avg = averageScore(answers);
  const avgLabel = avg > 0 ? avg.toFixed(1) : "—";

  return (
    <div className="rating-panel">
      <div className="rating-panel-header">
        <h3 className="rating-panel-title">Rate Criteria</h3>
        <span className="rating-panel-avg">Avg: {avgLabel}/5</span>
      </div>

      <div className="rating-phases">
        {phases.map((phase, pi) => (
          <div key={`${pi}-${phase.phase}`} className="rating-phase">
            <h4 className="rating-phase-title">{phase.phase}</h4>
            <div className="rating-list">
              {phase.questions.map((question, qi) => {
                const key = answerKey(pi, qi);
                const answer = answers[key] ?? { score: 0, notes: "" };
                const val = answer.score;
                const level = levels.find((l) => l.score === val);
                return (
                  <div key={key} className="rating-row">
                    <span className="rating-label">{question}</span>
                    <div className="rating-track">
                      {levels.map((l) => (
                        <button
                          key={l.score}
                          className={`rating-segment${val === l.score ? " rating-segment--active" : ""}`}
                          onClick={() => onChangeScore(key, l.score)}
                          type="button"
                        >
                          {l.score}
                        </button>
                      ))}
                    </div>
                    {level && (
                      <div className="rating-rubric">
                        <i className={`${level.icon} rating-rubric-icon`} />
                        <div>
                          <span className="rating-rubric-label">{level.label}</span>
                          <span className="rating-rubric-desc">{level.desc}</span>
                        </div>
                      </div>
                    )}
                    <div className="rating-notes">
                      <textarea
                        className="rating-notes-input"
                        rows={2}
                        value={answer.notes}
                        onChange={(e) => onChangeNotes(key, e.target.value.slice(0, notesMaxChars))}
                        placeholder="Optional notes for this question"
                        maxLength={notesMaxChars}
                      />
                      <span className="rating-notes-counter">
                        {answer.notes.length}/{notesMaxChars}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RatingPanel;
