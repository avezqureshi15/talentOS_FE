import type { ChipVariant } from "@/components/ui/chip/chip.types";
import type { AiScreeningResult } from "@/services/ai/ai.types";

export type AiScreeningStatusBadge = {
  label: string;
  variant: ChipVariant;
  icon: string;
};

export type AiScreeningResultBadge = AiScreeningStatusBadge;

export type AiScreeningPanelProps = {
  hiringRequestId?: string;
  candidateId: number | null | undefined;
  flagged?: { flag_reason?: string | null } | null;
  result?: AiScreeningPanelViewProps;
};

export type AiScreeningPanelViewProps = {
  data: AiScreeningResult | undefined;
  isLoading: boolean;
  isError: boolean;
  isFetching: boolean;
};
