import { useEffect, useMemo, useState } from "react";
import BaseModal from "@/components/ui/modal/base-modal";
import Button from "@/components/ui/button/button";
import LoadingSpinner from "@/components/ui/loading-spinner/loading-spinner";
import Select from "@/components/ui/select/select";
import { useCallWindowData } from "./hooks/use-call-window-data";
import {
  CALL_WINDOW_DEFAULT_FROM,
  CALL_WINDOW_DEFAULT_TIMEZONE,
  CALL_WINDOW_DEFAULT_TO,
  CALL_WINDOW_TIMEZONE_OPTIONS,
} from "./call-window.constants";
import type { CallWindowModalProps } from "./call-window-modal.types";
import "./call-window-modal.css";

const toMinutes = (value: string): number => {
  const [h, m] = value.split(":").map(Number);
  return (h || 0) * 60 + (m || 0);
};

const CallWindowModal = ({
  open,
  onClose,
  hiringRequestId,
  canEdit,
}: CallWindowModalProps) => {
  const { data: windowData, isLoading, error, refetch, save } =
    useCallWindowData(hiringRequestId);

  const [isEditing, setIsEditing] = useState(false);
  const [fromTime, setFromTime] = useState(CALL_WINDOW_DEFAULT_FROM);
  const [toTime, setToTime] = useState(CALL_WINDOW_DEFAULT_TO);
  const [timezone, setTimezone] = useState(CALL_WINDOW_DEFAULT_TIMEZONE);

  useEffect(() => {
    if (windowData) {
      setFromTime((windowData.screening_call_from ?? CALL_WINDOW_DEFAULT_FROM).slice(0, 5));
      setToTime((windowData.screening_call_to ?? CALL_WINDOW_DEFAULT_TO).slice(0, 5));
      setTimezone(windowData.screening_timezone || CALL_WINDOW_DEFAULT_TIMEZONE);
    }
  }, [windowData]);

  useEffect(() => {
    if (!open) setIsEditing(false);
  }, [open]);

  const withinWindow = useMemo(() => {
    if (!fromTime || !toTime) return null;
    const now = new Date();
    let hour = now.getHours();
    let minute = now.getMinutes();
    try {
      const parts = new Intl.DateTimeFormat("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        hourCycle: "h23",
        timeZone: timezone,
      }).formatToParts(now);
      hour = Number(parts.find((p) => p.type === "hour")?.value) || hour;
      minute = Number(parts.find((p) => p.type === "minute")?.value) || minute;
    } catch {
      // fall back to the browser's local time
    }
    const mins = hour * 60 + minute;
    const from = toMinutes(fromTime);
    const to = toMinutes(toTime);
    if (from <= to) return mins >= from && mins <= to;
    return mins >= from || mins <= to;
  }, [fromTime, toTime, timezone]);

  const handleSave = () => {
    if (!fromTime || !toTime) return;
    save.mutate(
      {
        screening_call_from: fromTime,
        screening_call_to: toTime,
        screening_timezone: timezone,
      },
      {
        onSuccess: () => {
          setIsEditing(false);
          refetch();
        },
      },
    );
  };

  return (
    <BaseModal
      open={open}
      onClose={onClose}
      title="Call Window"
      icon="bx-alarm-alt"
      className="cwm-modal"
    >
      <div className="cwm-body">
        {isLoading ? (
          <div className="cwm-status">
            <LoadingSpinner size="sm" />
            <span>Loading call window...</span>
          </div>
        ) : error ? (
          <div className="cwm-status cwm-status--error">
            <span>Could not load call window.</span>
            <button type="button" className="cwm-retry-btn" onClick={() => refetch()}>
              Retry
            </button>
          </div>
        ) : (
          <>
            <div className="cwm-card">
              <div className="cwm-card-header">
                <p className="cwm-desc">
                  AI screening (voice) calls are only placed within this window. Calls triggered
                  outside the window are queued until it opens. Overnight windows are supported
                  (e.g. 22:00 to 06:00).
                </p>
                <span
                  className={`cwm-pill${
                    withinWindow === null
                      ? ""
                      : withinWindow
                        ? " cwm-pill--within"
                        : " cwm-pill--outside"
                  }`}
                >
                  {withinWindow === null
                    ? "No window set"
                    : withinWindow
                      ? "Within window"
                      : "Outside window"}
                </span>
              </div>

              <div className="cwm-form">
                <label className="cwm-field">
                  <span className="cwm-label">Timezone</span>
                  <Select
                    options={CALL_WINDOW_TIMEZONE_OPTIONS}
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                    disabled={!isEditing || save.isPending}
                  />
                </label>
                <div className="cwm-time-grid">
                  <label className="cwm-field">
                    <span className="cwm-label">From</span>
                    <input
                      type="time"
                      className="cwm-time-input"
                      value={fromTime}
                      onChange={(e) => setFromTime(e.target.value)}
                      disabled={!isEditing || save.isPending}
                    />
                  </label>
                  <label className="cwm-field">
                    <span className="cwm-label">To</span>
                    <input
                      type="time"
                      className="cwm-time-input"
                      value={toTime}
                      onChange={(e) => setToTime(e.target.value)}
                      disabled={!isEditing || save.isPending}
                    />
                  </label>
                </div>
              </div>

              {!canEdit && (
                <p className="cwm-readonly-note">
                  <i className="bx bxs-lock-alt" />
                  Read only — only users with interview plan edit permission can change the call
                  window.
                </p>
              )}
              {isEditing && <p className="cwm-hint">Changes apply immediately when saved.</p>}
              {windowData?.sync_status === "draft" && windowData.sync_errors.length > 0 && (
                <p className="cwm-warning">{windowData.sync_errors[0]}</p>
              )}
              {save.isError && (
                <p className="cwm-warning">
                  Failed to save — ai-recruitment-poc unreachable. Try again.
                </p>
              )}
            </div>

            <div className="cwm-footer">
              {isEditing ? (
                <>
                  <Button
                    variant="secondary"
                    onClick={() => setIsEditing(false)}
                    disabled={save.isPending}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    onClick={handleSave}
                    loading={save.isPending}
                    loadingText="Saving..."
                    disabled={!fromTime || !toTime}
                  >
                    Save Changes
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="secondary" onClick={onClose}>
                    Close
                  </Button>
                  {canEdit && (
                    <Button variant="primary" onClick={() => setIsEditing(true)}>
                      Edit
                    </Button>
                  )}
                </>
              )}
            </div>
          </>
        )}
      </div>
    </BaseModal>
  );
};

export default CallWindowModal;
