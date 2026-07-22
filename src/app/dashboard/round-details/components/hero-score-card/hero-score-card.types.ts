import type { AIRecommendation } from "../../pages/round-details.types";

export type HeroScoreCardProps = {
  aiRecommendation: AIRecommendation;
  overallScore: number;
  criteriaMet: number;
  totalCriteria: number;
  aiSummary: string;
};
