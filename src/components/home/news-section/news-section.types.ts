import type { NewsItem } from "@/components/home/home.types";

export type NewsSectionProps = {
  items: NewsItem[];
  openIndex: number;
  onToggle: (index: number) => void;
};
