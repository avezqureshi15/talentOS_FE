import type { RatingPanelProps } from "./rating-panel.types";
import "./rating-panel.css";

const RatingPanel = ({ criteria, ratings, onChangeRating, levels }: RatingPanelProps) => {
  const values = Object.values(ratings).filter(Boolean);
  const avg = values.length > 0 ? (values.reduce((a, b) => a + b, 0) / values.length).toFixed(1) : "—";

  return (
    <div className="rating-panel">
      <div className="rating-panel-header">
        <h3 className="rating-panel-title">Rate Criteria</h3>
        <span className="rating-panel-avg">Avg: {avg}/4</span>
      </div>

      <div className="rating-list">
        {criteria.map((c) => {
          const val = ratings[c.key] ?? 0;
          const level = levels.find((l) => l.score === val);
          return (
            <div key={c.key} className="rating-row">
              <span className="rating-label">{c.label}</span>
              <div className="rating-track">
                {levels.map((l) => (
                  <button
                    key={l.score}
                    className={`rating-segment${val === l.score ? " rating-segment--active" : ""}`}
                    onClick={() => onChangeRating(c.key, l.score)}
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
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RatingPanel;
