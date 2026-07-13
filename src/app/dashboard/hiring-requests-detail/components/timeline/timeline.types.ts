export type TimelineStatus = "waiting" | "queued" | "success";

export type TimelineStep = {
  id: string;
  title: string;
  description: string;
  status: TimelineStatus;
  date?: string;
  actor?: string;
  actionUrl?: string;
  actionLabel?: string;
};

export type TimelineSheetProps = {
  openId: number | null;
  onClose: () => void;
};
