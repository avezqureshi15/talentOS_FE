import { forwardRef } from "react";
import { Video } from "lucide-react";
import CustomVideo from "@/components/shared/custom-video/custom-video";
import type { CustomVideoHandle } from "@/components/shared/custom-video/custom-video.types";
import type { RecordingPanelProps } from "./recording-panel.types";

const RecordingPanel = forwardRef<CustomVideoHandle, RecordingPanelProps>(({ recordingUrl }, ref) => {
  if (recordingUrl) {
    return <CustomVideo ref={ref} src={recordingUrl} />;
  }
  return (
    <div className="rd-video-placeholder">
      <Video className="rd-video-placeholder-icon" />
      <p className="rd-video-placeholder-text">
        The interview recording will appear here once processing completes.
      </p>
    </div>
  );
});

RecordingPanel.displayName = "RecordingPanel";

export default RecordingPanel;
