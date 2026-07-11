import { SR_LABELS } from "./schedule-round-modal.constants";
import type { Interviewer, TimeSlot, DaySchedule } from "./schedule-round-modal.types";

type SrStep1Props = {
  search: string;
  onSearchChange: (v: string) => void;
  filtered: Interviewer[];
  selectedInterviewer: Interviewer | null;
  onSelectInterviewer: (iv: Interviewer) => void;
  weekSchedule: DaySchedule[];
  selectedSlot: { dayIdx: number; time: string } | null;
  onSlotClick: (dayIdx: number, slot: TimeSlot) => void;
};

const SrStep1 = ({ search, onSearchChange, filtered, selectedInterviewer, onSelectInterviewer, weekSchedule, selectedSlot, onSlotClick }: SrStep1Props) => (
  <div className="sr-two-col">
    <div className="sr-left-col">
      <div className="sr-interviewer-search">
        <i className="bx bx-search sr-search-icon" />
        <input className="sr-search-input" placeholder={SR_LABELS.INTERVIEWER_PLACEHOLDER} value={search} onChange={(e) => onSearchChange(e.target.value)} />
      </div>
      <div className="sr-interviewer-list">
        {filtered.map((iv) => (
          <button key={iv.id} className={`sr-interviewer-item ${selectedInterviewer?.id === iv.id ? "sr-interviewer-item--selected" : ""}`} onClick={() => onSelectInterviewer(iv)} type="button">
            <div className="sr-interviewer-avatar">{iv.name.charAt(0)}</div>
            <div className="sr-interviewer-info">
              <span className="sr-interviewer-name">{iv.name}</span>
              <span className="sr-interviewer-role">{iv.role}</span>
            </div>
            {selectedInterviewer?.id === iv.id && <i className="bx bx-check sr-interviewer-check" />}
          </button>
        ))}
      </div>
    </div>
    <div className="sr-right-col">
      {selectedInterviewer ? (
        <div className="sr-calendar-section">
          <span className="sr-section-label">{SR_LABELS.SELECT_SLOT}</span>
          <div className="sr-calendar-grid">
            {weekSchedule.map((day, dayIdx) => (
              <div key={day.date} className="sr-day-col">
                <div className="sr-day-header">
                  <div className="sr-day-name">{day.day}</div>
                  <div className="sr-day-date">{day.date}</div>
                </div>
                {day.slots.map((ts) => (
                  <div key={ts.time} className={`sr-slot sr-slot--${ts.status} ${selectedSlot?.dayIdx === dayIdx && selectedSlot?.time === ts.time ? "sr-slot--selected" : ""}`} onClick={() => onSlotClick(dayIdx, ts)}>
                    {ts.time}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="sr-empty-slots">{SR_LABELS.NO_INTERVIEWER}</div>
      )}
    </div>
  </div>
);

export default SrStep1;
