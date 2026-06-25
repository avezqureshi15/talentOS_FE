import type { NewsItem } from "../home.types";
import type { NewsSectionProps } from "./news-section.types";

export default function NewsSection({ items, openIndex, onToggle }: NewsSectionProps) {
  return (
    <div className="news-card">
      {items.map((item: NewsItem, i: number) => (
        <div key={i} className="news-item">
          <button
            className="news-item-btn"
            onClick={() => onToggle(i)}
          >
            <span
              className={`news-item-title ${
                openIndex === i ? "news-item-title--active" : "news-item-title--inactive"
              }`}
            >
              {item.title}
            </span>
            <span className="news-item-arrow">{openIndex === i ? "∧" : "∨"}</span>
          </button>
          {openIndex === i && item.body && (
            <div className="news-item-body">{item.body}</div>
          )}
        </div>
      ))}
    </div>
  );
}
