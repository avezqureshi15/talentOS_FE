import BookingCalendar from "@/app/slot-booking/components/booking-calendar/booking-calendar";
import SlotPicker from "@/app/slot-booking/components/slot-picker/slot-picker";
import LoadingSpinner from "@/components/ui/loading-spinner/loading-spinner";
import ErrorFallback from "@/components/ui/error-fallback/error-fallback";
import { Icon } from "@/components/ui/icons";
import { BOOKING_LABELS, FORM_ERRORS, CONTEXT_SECTIONS } from "./slot-booking.constants";
import { useSlotBooking } from "@/app/slot-booking/hooks/use-slot-booking";
import "./slot-booking.css";

const SlotBooking = () => {
  const {
    formId,
    formValid,
    formLoading,
    formError,
    formErrorMessage,
    selectedDate,
    setSelectedDate,
    selectedSlots,
    customSlots,
    slots,
    totalSlotsCount,
    isSubmitting,
    isConfirmed,
    handleToggleSlot,
    handleAddCustomSlot,
    handleRemoveCustomSlot,
    handleConfirm,
  } = useSlotBooking();

  if (!formId) {
    return (
      <div className="booking-page">
        <div className="booking-confirmed">
          <ErrorFallback title="Missing Link" message={FORM_ERRORS.MISSING} />
        </div>
      </div>
    );
  }

  if (formLoading) {
    return (
      <div className="booking-page">
        <div className="booking-confirmed">
          <LoadingSpinner size="lg" fullPage />
        </div>
      </div>
    );
  }

  if (formError || !formValid) {
    return (
      <div className="booking-page">
        <div className="booking-confirmed">
          <ErrorFallback title="Booking Unavailable" message={formErrorMessage} />
        </div>
      </div>
    );
  }

  if (isConfirmed) {
    return (
      <div className="booking-page">
        <div className="booking-confirmed">
          <i className="bx bx-check-circle confirmed-icon" />
          <h2 className="confirmed-title">{BOOKING_LABELS.CONFIRMED}</h2>
          <p className="confirmed-desc">
            {totalSlotsCount} slot{totalSlotsCount > 1 ? "s" : ""} submitted
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
                customSlots={customSlots}
                onAddCustomSlot={handleAddCustomSlot}
                onRemoveCustomSlot={handleRemoveCustomSlot}
              />
            </div>
          </div>

          <div className="action-bottom">
            {totalSlotsCount > 0 && (
              <button className="booking-confirm-btn" onClick={handleConfirm} type="button" disabled={isSubmitting}>
                <i className={`bx ${isSubmitting ? "bx-loader-alt bx-spin" : "bx-calendar-check"}`} />
                {isSubmitting
                  ? "Submitting..."
                  : `${BOOKING_LABELS.CONFIRM} (${totalSlotsCount})`
                }
              </button>
            )}

            {totalSlotsCount === 0 && (
              <p className="booking-hint">{BOOKING_LABELS.NO_SLOTS}</p>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default SlotBooking;
