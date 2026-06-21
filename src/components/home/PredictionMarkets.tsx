import type { PredictionRow } from "./Home.types";
import "./Home.css";

export default function PredictionMarkets({ rows }: { rows: PredictionRow[] }) {
  return (
    <div className="prediction-card">
      <div className="prediction-header">
        <span className="prediction-header-title">Prediction Markets</span>
      </div>
      <div className="prediction-body">
        <div className="prediction-question">
          Bitcoin above ___ on June 4?
        </div>
        {rows.map((r) => (
          <div key={r.price} className="prediction-row">
            <span className="prediction-price">{r.price}</span>
            <div className="prediction-bar-track">
              <div
                className={`prediction-bar-fill prediction-bar-fill--${r.up ? "up" : "other"}`}
                style={{ '--bar-width': r.prob } as React.CSSProperties}
              />
            </div>
            <span className="prediction-prob">{r.prob}</span>
            <span
              className={`prediction-change prediction-change--${r.up ? "up" : "other"}`}
            >
              {r.up ? "↗" : "—"} {r.change}
            </span>
          </div>
        ))}
        <div className="prediction-footer">
          <span>$5.6M vol.</span>
          <span>+11 on Polymarket</span>
        </div>
      </div>
      <div className="prediction-bottom">
        <div className="prediction-bottom-text">
          What price will Bitcoin hit in June?
        </div>
      </div>
    </div>
  );
}
