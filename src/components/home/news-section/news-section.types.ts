import type { NewsItem } from "../home.types";

export type NewsSectionProps = {
  items: NewsItem[];
  openIndex: number;
  onToggle: (index: number) => void;
};
