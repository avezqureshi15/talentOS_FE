import type { NewsItem } from "./Home.types";
import NewsSection from "./NewsSection";
import "./Home.css";

export default function MarketSummary({
  items,
  openIndex,
  onToggle,
}: {
  items: NewsItem[];
  openIndex: number;
  onToggle: (index: number) => void;
}) {
  return (
    <section>
      <div className="home-section-header">
        <h2 className="home-section-title">Market Summary</h2>
        <span className="home-section-timestamp">Updated 55 seconds ago</span>
      </div>
      <NewsSection items={items} openIndex={openIndex} onToggle={onToggle} />
    </section>
  );
}
