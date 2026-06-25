import type { WatchlistSectionProps } from "./watchlist-section.types";
import { WATCHLIST_TITLE } from "../home.constants";

export default function WatchlistSection({ items }: WatchlistSectionProps) {
  return (
    <div className="watchlist-card">
      <div className="watchlist-header">
        <span className="watchlist-header-title">{WATCHLIST_TITLE}</span>
        <span className="watchlist-header-add">⊞</span>
      </div>
      {items.map((s) => (
        <div key={s.ticker} className="watchlist-item">
          <div
            className="watchlist-color-box"
            style={{ '--box-color': s.color }}
          >
            {s.name.slice(0, 2).toUpperCase()}
          </div>
          <div className="watchlist-item-info">
            <div className="watchlist-item-name">{s.name}</div>
            <div className="watchlist-item-ticker">{s.ticker}</div>
          </div>
          <div className="watchlist-item-price">
            <div className="watchlist-item-price-val">{s.price}</div>
            <div className={`watchlist-item-price-change watchlist-item-price-change--${s.down ? "down" : "up"}`}>
              {s.change}
            </div>
          </div>
          <span className="watchlist-item-star">☆</span>
        </div>
      ))}
    </div>
  );
}
