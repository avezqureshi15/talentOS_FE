import type { MarketSummaryProps } from "./market-summary.types";
import NewsSection from "../news-section/news-section";
import { MARKET_SUMMARY_TITLE, TIMESTAMP_TEXT } from "../home.constants";

export default function MarketSummary({ items, openIndex, onToggle }: MarketSummaryProps) {
  return (
    <section>
      <div className="home-section-header">
        <h2 className="home-section-title">{MARKET_SUMMARY_TITLE}</h2>
        <span className="home-section-timestamp">{TIMESTAMP_TEXT}</span>
      </div>
      <NewsSection items={items} openIndex={openIndex} onToggle={onToggle} />
    </section>
  );
}
