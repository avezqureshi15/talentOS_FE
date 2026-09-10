export type TimelineMarker = {
  time: number;
  label: string;
};

export type TimelineEntry = {
  time: number;
  label: string;
  note: string;
};

export type VideoPlayerProps = {
  videoSrc: string;
  markers?: TimelineMarker[];
  storageKey?: string;
  timelineHeight?: number;
};
