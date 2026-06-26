import type { PredictionMarketsProps } from "./prediction-markets.types";
import {
  PREDICTION_TITLE,
  PREDICTION_QUESTION,
  PREDICTION_VOLUME,
  PREDICTION_POLYMARKET,
  PREDICTION_BOTTOM_TEXT,
} from "@/components/home/home.constants";

export default function PredictionMarkets({ rows }: PredictionMarketsProps) {
  return (
    <div className="prediction-card">
      <div className="prediction-header">
        <span className="prediction-header-title">{PREDICTION_TITLE}</span>
      </div>
      <div className="prediction-body">
        <div className="prediction-question">
          {PREDICTION_QUESTION}
        </div>
        {rows.map((r) => (
          <div key={r.price} className="prediction-row">
            <span className="prediction-price">{r.price}</span>
            <div className="prediction-bar-track">
              <div
                className={`prediction-bar-fill prediction-bar-fill--${r.up ? "up" : "other"}`}
                style={{ '--bar-width': r.prob }}
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
          <span>{PREDICTION_VOLUME}</span>
          <span>{PREDICTION_POLYMARKET}</span>
        </div>
      </div>
      <div className="prediction-bottom">
        <div className="prediction-bottom-text">
          {PREDICTION_BOTTOM_TEXT}
        </div>
      </div>
    </div>
  );
}
