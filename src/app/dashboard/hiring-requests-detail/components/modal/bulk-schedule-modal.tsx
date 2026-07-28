import { useState, useRef } from "react";
import BaseModal from "@/components/ui/modal/base-modal";
import "./bulk-schedule-modal.css";

type BulkScheduleModalProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: (params: { scheduledDate: string; scheduledTime: string; scheduledEndDate?: string; scheduledEndTime?: string }) => void;
  title: string;
  dateLabel: string;
  includeEnd?: boolean;
};

const formatDisplayDate = (val: string) => {
  if (!val) return "Select date";
  const [y, m, d] = val.split("-");
  return `${d}/${m}/${y}`;
};

export default function BulkScheduleModal({ open, onClose, onConfirm, title, dateLabel, includeEnd = false }: BulkScheduleModalProps) {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("");

  const dateRef = useRef<HTMLInputElement>(null);
  const timeRef = useRef<HTMLInputElement>(null);
  const endDateRef = useRef<HTMLInputElement>(null);
  const endTimeRef = useRef<HTMLInputElement>(null);

  const handleConfirm = () => {
    if (!date || !time) return;
    if (includeEnd && (!endDate || !endTime)) return;
    onConfirm({ scheduledDate: date, scheduledTime: time, scheduledEndDate: includeEnd ? endDate : undefined, scheduledEndTime: includeEnd ? endTime : undefined });
    setDate(""); setTime(""); setEndDate(""); setEndTime("");
  };

  const handleClose = () => {
    setDate(""); setTime(""); setEndDate(""); setEndTime("");
    onClose();
  };

  const isValid = date && time && (!includeEnd || (endDate && endTime));

  return (
    <BaseModal open={open} onClose={handleClose}>
      <div className="bsm-body">
        <h3 className="bsm-title">{title}</h3>

        <div className="bsm-fields">
          <div>
            <label className="bsm-label">{dateLabel}</label>
            <div className="bsm-row">
              <button type="button" className="bsm-trigger" onClick={() => dateRef.current?.showPicker()}>
                <i className="bx bx-calendar" />
                <span>{formatDisplayDate(date)}</span>
              </button>
              <input ref={dateRef} type="date" value={date} onChange={(e) => setDate(e.target.value)} className="bsm-hidden" />
              <button type="button" className="bsm-trigger bsm-trigger--time" onClick={() => timeRef.current?.showPicker()}>
                <i className="bx bx-time-five" />
                <span>{time || "Select time"}</span>
              </button>
              <input ref={timeRef} type="time" value={time} onChange={(e) => setTime(e.target.value)} className="bsm-hidden" />
            </div>
          </div>

          {includeEnd && (
            <div>
              <label className="bsm-label">End Date & Time</label>
              <div className="bsm-row">
                <button type="button" className="bsm-trigger" onClick={() => endDateRef.current?.showPicker()}>
                  <i className="bx bx-calendar" />
                  <span>{formatDisplayDate(endDate)}</span>
                </button>
                <input ref={endDateRef} type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="bsm-hidden" />
                <button type="button" className="bsm-trigger bsm-trigger--time" onClick={() => endTimeRef.current?.showPicker()}>
                  <i className="bx bx-time-five" />
                  <span>{endTime || "Select time"}</span>
                </button>
                <input ref={endTimeRef} type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} className="bsm-hidden" />
              </div>
            </div>
          )}
        </div>

        <div className="bsm-actions">
          <button onClick={handleClose} className="bsm-btn bsm-btn--cancel" type="button">Cancel</button>
          <button onClick={handleConfirm} disabled={!isValid} className="bsm-btn bsm-btn--confirm" type="button">Confirm</button>
        </div>
      </div>
    </BaseModal>
  );
}
