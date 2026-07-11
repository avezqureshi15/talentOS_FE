import { useState, useCallback } from "react";
import BookingCalendar from "@/app/slot-booking/components/booking-calendar/booking-calendar";
import SlotPicker from "@/app/slot-booking/components/slot-picker/slot-picker";
import { Icon } from "@/components/ui/icons";
import { BOOKING_LABELS, MOCK_SLOTS, CONTEXT_SECTIONS } from "./slot-booking.constants";
import type { MockSlot } from "./slot-booking.constants";
import "./slot-booking.css";

const SlotBooking = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedSlots, setSelectedSlots] = useState<string[]>([]);
  const [confirmed, setConfirmed] = useState(false);

  const handleToggleSlot = useCallback((value: string) => {
    setSelectedSlots((prev) =>
      prev.includes(value) ? prev.filter((s) => s !== value) : [...prev, value],
    );
  }, []);

  const handleConfirm = useCallback(() => {
    setConfirmed(true);
  }, []);

  const slots: MockSlot[] = selectedDate ? MOCK_SLOTS : [];

  /* Payload shape when sending to backend:
     {
       date: "2026-06-26",
       time_slots: ["10:00-10:30", "11:00-11:30"],
       timezone: "Asia/Kolkata",
     }
     Backend stores:
     {
       id: uuid,
       date: date,
       time_slots: string[],
       timezone: string,
       status: "pending" | "confirmed" | "cancelled",
       created_at: timestamp,
       updated_at: timestamp,
     }
  */

  if (confirmed) {
    return (
      <div className="booking-page">
        <div className="booking-confirmed">
          <i className="bx bx-check-circle confirmed-icon" />
          <h2 className="confirmed-title">{BOOKING_LABELS.CONFIRMED}</h2>
          <p className="confirmed-desc">
            {selectedDate.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
            {selectedSlots.length > 0 && (
              <> &middot; {selectedSlots.length} slot{selectedSlots.length > 1 ? "s" : ""}</>
            )}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="booking-page">
      <div className="booking-layout">
        <aside className="booking-context">
          <div className="context-body">
            {CONTEXT_SECTIONS.map((section, i) => {
              switch (section.type) {
                case "brand":
                  return <div key={i} className="context-brand"><Icon.Logo /></div>;
                case "divider":
                  return <div key={i} className="context-divider" />;
                case "badge":
                  return <span key={i} className="context-badge">{section.text}</span>;
                case "title":
                  return <h2 key={i} className="context-role">{section.text}</h2>;
                case "meta":
                  return (
                    <div key={i} className="context-meta">
                      {section.items.map((item, j) => (
                        <div key={j} className="context-meta-item">
                          <i className={item.icon} />
                          <span>{item.text}</span>
                        </div>
                      ))}
                    </div>
                  );
                case "note":
                  return (
                    <div key={i} className="context-note">
                      <div className="context-note-heading">
                        <i className={section.icon} />
                        <span>{section.heading}</span>
                      </div>
                      <p>{section.text}</p>
                    </div>
                  );
              }
            })}
          </div>
        </aside>

        <main className="booking-action">
          <div className="action-header">
            <h1 className="action-title">Select Date & Time</h1>
          </div>

          <div className="action-main">
            <div className="action-calendar-wrap">
              <BookingCalendar
                selectedDate={selectedDate}
                onChangeDate={setSelectedDate}
              />
            </div>

            <div className="action-slots-wrap">
              <h3 className="action-slots-title">Available Slots</h3>
              <SlotPicker
                slots={slots}
                selectedSlots={selectedSlots}
                onToggleSlot={handleToggleSlot}
              />
            </div>
          </div>

          <div className="action-bottom">
            {selectedSlots.length > 0 && (
              <button className="booking-confirm-btn" onClick={handleConfirm} type="button">
                <i className="bx bx-calendar-check" />
                {BOOKING_LABELS.CONFIRM} ({selectedSlots.length})
              </button>
            )}

            {selectedSlots.length === 0 && (
              <p className="booking-hint">{BOOKING_LABELS.NO_SLOTS}</p>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default SlotBooking;
