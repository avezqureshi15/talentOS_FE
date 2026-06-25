import type { NewsItem } from "../home.types";

export type MarketSummaryProps = {
  items: NewsItem[];
  openIndex: number;
  onToggle: (index: number) => void;
};
