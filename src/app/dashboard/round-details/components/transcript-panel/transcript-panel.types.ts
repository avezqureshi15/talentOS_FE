import type { TranscriptSection } from "../../pages/round-details.types";

export type TranscriptPanelProps = {
  sections: TranscriptSection[];
  onSeek?: (timeInSeconds: number) => void;
  collapsible?: boolean;
  showSectionHeader?: boolean;
  showBadge?: boolean;
};
