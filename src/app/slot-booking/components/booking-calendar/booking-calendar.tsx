import { useMemo } from "react";
import { DAY_LABELS, MONTH_LABELS } from "./booking-calendar.constants";
import type { BookingCalendarProps } from "./booking-calendar.types";
import "./booking-calendar.css";

const BookingCalendar = ({ selectedDate, onChangeDate }: BookingCalendarProps) => {
  const year = selectedDate.getFullYear();
  const month = selectedDate.getMonth();

  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const maxDate = useMemo(() => {
    const d = new Date(today);
    d.setDate(today.getDate() + 3);
    return d;
  }, [today]);

  const days = useMemo(() => {
    const firstOfMonth = new Date(year, month, 1);
    const lastOfMonth = new Date(year, month + 1, 0);
    const daysInMonth = lastOfMonth.getDate();
    const startDay = firstOfMonth.getDay();
    const daysArr: (number | null)[] = [];
    for (let i = 0; i < startDay; i++) daysArr.push(null);
    for (let d = 1; d <= daysInMonth; d++) daysArr.push(d);
    return daysArr;
  }, [year, month]);

  const prevMonth = () => onChangeDate(new Date(year, month - 1, 1));
  const nextMonth = () => onChangeDate(new Date(year, month + 1, 1));

  const canGoPrev = useMemo(() => {
    const prev = new Date(year, month - 1, 1);
    return prev < today;
  }, [year, month, today]);

  const canGoNext = useMemo(() => {
    const next = new Date(year, month + 1, 1);
    next.setHours(0, 0, 0, 0);
    return next <= maxDate;
  }, [year, month, maxDate]);

  const sameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  const isInRange = (date: Date) =>
    date >= today && date <= maxDate;

  return (
    <div className="booking-calendar">
      <div className="cal-header">
        <button className="cal-nav-btn" onClick={prevMonth} type="button" disabled={!canGoPrev}>
          <i className="bx bx-chevron-left" />
        </button>
        <span className="cal-month-label">{MONTH_LABELS[month]} {year}</span>
        <button className="cal-nav-btn" onClick={nextMonth} type="button" disabled={!canGoNext}>
          <i className="bx bx-chevron-right" />
        </button>
      </div>

      <div className="cal-day-labels">
        {DAY_LABELS.map((d) => (
          <div key={d} className="cal-day-label">{d}</div>
        ))}
      </div>

      <div className="cal-grid">
        {days.map((d, i) => {
          if (d === null) return <div key={`empty-${i}`} className="cal-cell cal-cell--empty" />;

          const date = new Date(year, month, d);
          const inRange = isInRange(date);
          const isSelected = sameDay(date, selectedDate);

          return (
            <button
              key={d}
              className={`cal-cell${isSelected ? " cal-cell--selected" : ""}${!inRange ? " cal-cell--disabled" : ""}`}
              onClick={() => inRange && onChangeDate(date)}
              disabled={!inRange}
              type="button"
            >
              {d}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BookingCalendar;
