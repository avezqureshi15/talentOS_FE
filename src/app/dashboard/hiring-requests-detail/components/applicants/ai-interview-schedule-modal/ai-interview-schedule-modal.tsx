import { useState } from "react";
import BaseModal from "@/components/ui/modal/base-modal";
import Button from "@/components/ui/button/button";
import Select from "@/components/ui/select/select";
import { useToastStore } from "@/store/toast.store";
import { ToastType } from "@/components/ui/toast/toast.types";
import { useScheduleAiInterview } from "@/hooks/use-schedule-ai-interview";
import { useUnscheduleAiInterview } from "@/hooks/use-unschedule-ai-interview";
import { useCallWindowData } from "@/app/dashboard/hiring-requests-detail/components/call-window/hooks/use-call-window-data";
import { CALL_WINDOW_DEFAULT_TIMEZONE, CALL_WINDOW_TIMEZONE_OPTIONS } from "@/app/dashboard/hiring-requests-detail/components/call-window/call-window.constants";
import type { AiInterviewScheduleModalProps } from "./ai-interview-schedule-modal.types";
import "./ai-interview-schedule-modal.css";

const AiInterviewScheduleModal = ({
  open,
  candidateName,
  candidateId,
  hiringRequestId,
  currentSlot,
  onClose,
  onScheduled,
}: AiInterviewScheduleModalProps) => {
  const { data: callWindow } = useCallWindowData(hiringRequestId);
  const scheduleMutation = useScheduleAiInterview();
  const unscheduleMutation = useUnscheduleAiInterview();

  const hasCurrentSlot = Boolean(currentSlot);
  const [scheduledDate, setScheduledDate] = useState(() => (currentSlot ? currentSlot.slice(0, 10) : ""));
  const [scheduledTime, setScheduledTime] = useState(() => (currentSlot ? currentSlot.slice(11, 16) : ""));
  const [timezone, setTimezone] = useState(() => callWindow?.screening_timezone || CALL_WINDOW_DEFAULT_TIMEZONE);

  const isPending = scheduleMutation.isPending || unscheduleMutation.isPending;

  const handleSchedule = () => {
    if (!scheduledDate || !scheduledTime) return;
    scheduleMutation.mutate(
      {
        hiringRequestId,
        candidateId,
        scheduled_date: scheduledDate,
        scheduled_time: scheduledTime,
        timezone,
      },
      {
        onSuccess: () => {
          useToastStore.getState().addToast("AI interview slot scheduled", ToastType.SUCCESS);
          onScheduled();
        },
        onError: () => {
          useToastStore.getState().addToast("Failed to schedule AI interview slot", ToastType.ERROR);
        },
      },
    );
  };

  const handleUnschedule = () => {
    unscheduleMutation.mutate(
      { hiringRequestId, candidateId },
      {
        onSuccess: () => {
          useToastStore.getState().addToast("AI interview slot cleared — candidate can join anytime", ToastType.INFO);
          onScheduled();
        },
        onError: () => {
          useToastStore.getState().addToast("Failed to clear AI interview slot", ToastType.ERROR);
        },
      },
    );
  };

  return (
    <BaseModal
      open={open}
      onClose={onClose}
      title="Schedule AI Interview"
      icon="bx-calendar"
      className="aism-modal"
    >
      <div className="aism-body">
        <p className="aism-desc">
          Set the slot for <strong>{candidateName}</strong>. The interview link stays the same —
          it only becomes joinable at the scheduled time (and inside the grace window).
        </p>

        <div className="aism-form">
          <label className="aism-field">
            <span className="aism-label">Date</span>
            <div className="aism-input-wrap">
              <i className="bx bx-calendar" />
              <input
                type="date"
                className="aism-input"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                disabled={isPending}
              />
            </div>
          </label>
          <label className="aism-field">
            <span className="aism-label">Time</span>
            <div className="aism-input-wrap">
              <i className="bx bx-time" />
              <input
                type="time"
                className="aism-input"
                value={scheduledTime}
                onChange={(e) => setScheduledTime(e.target.value)}
                disabled={isPending}
              />
            </div>
          </label>
          <label className="aism-field">
            <span className="aism-label">Timezone</span>
            <div className="aism-input-wrap aism-input-wrap--select">
              <i className="bx bx-globe" />
              <Select
                options={CALL_WINDOW_TIMEZONE_OPTIONS}
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                disabled={isPending}
              />
            </div>
          </label>
        </div>

        <div className="aism-footer">
          {hasCurrentSlot && (
            <Button
              variant="danger"
              className="aism-btn--clear"
              onClick={handleUnschedule}
              loading={unscheduleMutation.isPending}
              loadingText="Clearing..."
              disabled={scheduleMutation.isPending}
            >
              Clear Slot
            </Button>
          )}
          <div className="aism-footer-right">
            <Button variant="secondary" className="aism-btn--ghost" onClick={onClose} disabled={isPending}>
              Cancel
            </Button>
            <Button
              variant="primary"
              className="aism-btn--primary"
              onClick={handleSchedule}
              loading={scheduleMutation.isPending}
              loadingText="Scheduling..."
              disabled={!scheduledDate || !scheduledTime || unscheduleMutation.isPending}
            >
              {hasCurrentSlot ? "Reschedule" : "Schedule"}
            </Button>
          </div>
        </div>
      </div>
    </BaseModal>
  );
};

export default AiInterviewScheduleModal;
