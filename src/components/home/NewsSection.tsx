import type { NewsItem } from "./Home.types";
import "./Home.css";

export default function NewsSection({
  items,
  openIndex,
  onToggle,
}: {
  items: NewsItem[];
  openIndex: number;
  onToggle: (index: number) => void;
}) {
  return (
    <div className="news-card">
      {items.map((item, i) => (
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
