import { useToastStore } from "@/store/toast.store";
import { ToastType } from "@/components/ui/toast/toast.types";
import type { InterviewLinkChipProps } from "./interview-link-chip.types";
import "./interview-link-chip.css";

const COPIED_MESSAGE = "Interview link copied to clipboard";
const COPY_FAILED_MESSAGE = "Could not copy the link. Please try again.";

const copyToClipboard = async (value: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(value);
    return true;
  } catch {
    return false;
  }
};

const InterviewLinkChip = ({ url }: InterviewLinkChipProps) => {
  const addToast = useToastStore((s) => s.addToast);

  if (!url) return null;

  const handleClick = async () => {
    const ok = await copyToClipboard(url);
    addToast(
      ok ? COPIED_MESSAGE : COPY_FAILED_MESSAGE,
      ok ? ToastType.SUCCESS : ToastType.ERROR,
    );
  };

  return (
    <button type="button" className="ilc-btn" onClick={handleClick}>
      <i className="bx bx-link ilc-icon" />
      Copy interview link
    </button>
  );
};

export default InterviewLinkChip;
