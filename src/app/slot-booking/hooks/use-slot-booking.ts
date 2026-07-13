import { useState, useCallback, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { validateForm, createSlots } from "@/app/slot-booking/services/slot-booking";
import { SLOT_VALIDATION, BOOKING_LABELS, FORM_ERRORS } from "@/app/slot-booking/pages/slot-booking.constants";
import { QUERY_KEYS, SLOT_DURATION_MINUTES } from "@/constants/constants";
import { getSlotBounds } from "@/app/slot-booking/utils/slot-env-utils";
import { useToast } from "@/hooks/use-toast";
import type { SlotsCreateRequest } from "@/app/slot-booking/services/slot-booking.types";

const MIN_MINUTES = SLOT_VALIDATION.MIN_HOUR * 60;
const MAX_MINUTES = SLOT_VALIDATION.MAX_HOUR * 60;

const toMinutes = (value: string) => {
  const [h, m] = value.split(":").map(Number);
  return h * 60 + m;
};

const isToday = (date: Date) => {
  const now = new Date();
  return (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()
  );
};

const fmt = (h: number, m: number) => {
  const period = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 || 12;
  const mins = String(Math.round(m)).padStart(2, "0");
  return `${hour12}:${mins} ${period}`;
};

const toValue = (h: number, m: number, endH: number, endM: number) =>
  `${String(h).padStart(2, "0")}:${String(Math.round(m)).padStart(2, "0")}-${String(endH).padStart(2, "0")}:${String(Math.round(endM)).padStart(2, "0")}`;

const genSlots = () => {
  const duration = SLOT_DURATION_MINUTES;
  const bounds = getSlotBounds();
  const slots: { label: string; value: string; available: boolean }[] = [];
  for (let h = bounds.MIN_HOUR; h < bounds.GEN_END_HOUR; h++) {
    for (let m = 0; m < 60; m += duration) {
      const totalStart = h * 60 + m;
      const totalEnd = totalStart + duration;
      const endH = Math.floor(totalEnd / 60);
      const endM = totalEnd % 60;
      const value = toValue(h, m, endH, endM);
      slots.push({
        label: `${fmt(h, m)} – ${fmt(endH, endM)}`,
        value,
        available: true,
      });
    }
  }
  return slots;
};

const ALL_SLOTS = genSlots();

const formatDateKey = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

const toDateTime = (dateKey: string, timeStr: string) => {
  const [h, m] = timeStr.split(":").map(Number);
  const [y, mo, d] = dateKey.split("-").map(Number);
  const dt = new Date(y, mo - 1, d, h, m, 0, 0);
  return dt.toISOString();
};

export function useSlotBooking() {
  const { formId = "" } = useParams<{ formId: string }>();
  const toast = useToast();

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedSlotsByDate, setSelectedSlotsByDate] = useState<Record<string, string[]>>({});
  const [customSlotsByDate, setCustomSlotsByDate] = useState<Record<string, string[]>>({});

  const formQuery = useQuery({
    queryKey: [QUERY_KEYS.SLOT_FORM, formId],
    queryFn: () => validateForm(formId),
    enabled: !!formId,
    retry: false,
  });

  const createMutation = useMutation({
    mutationFn: (payload: SlotsCreateRequest) => createSlots(payload),
  });

  const empId = formQuery.data?.emp_id ?? "";
  const currentKey = formatDateKey(selectedDate);

  const formErrorMessage = useMemo(() => {
    if (!formId) return FORM_ERRORS.MISSING;
    if (!formQuery.isError && formQuery.data && !formQuery.data.valid) {
      switch (formQuery.data.reason) {
        case "NOT_FOUND": return FORM_ERRORS.NOT_FOUND;
        case "EXPIRED": return FORM_ERRORS.EXPIRED;
        case "ALREADY_SUBMITTED": return FORM_ERRORS.ALREADY_SUBMITTED;
        default: return FORM_ERRORS.INVALID;
      }
    }
    if (formQuery.error) return FORM_ERRORS.INVALID;
    return "";
  }, [formId, formQuery.data, formQuery.isError, formQuery.error]);

  const selectedSlots = selectedSlotsByDate[currentKey] ?? [];
  const customSlots = customSlotsByDate[currentKey] ?? [];

  const totalSlotsCount = useMemo(() => {
    let count = 0;
    for (const key of Object.keys(selectedSlotsByDate)) {
      count += selectedSlotsByDate[key].length;
    }
    for (const key of Object.keys(customSlotsByDate)) {
      count += customSlotsByDate[key].length;
    }
    return count;
  }, [selectedSlotsByDate, customSlotsByDate]);

  const handleToggleSlot = useCallback((value: string) => {
    setSelectedSlotsByDate((prev) => {
      const current = prev[currentKey] ?? [];
      const next = current.includes(value)
        ? current.filter((s) => s !== value)
        : [...current, value];
      return { ...prev, [currentKey]: next };
    });
  }, [currentKey]);

  const handleAddCustomSlot = useCallback((value: string) => {
    const [start, end] = value.split("-");
    const startMin = toMinutes(start);
    const endMin = toMinutes(end);

    if (startMin < MIN_MINUTES || startMin >= MAX_MINUTES || endMin <= startMin || endMin > MAX_MINUTES) {
      toast.warning(SLOT_VALIDATION.OUT_OF_RANGE_MSG);
      return;
    }

    if (isToday(selectedDate) && startMin <= new Date().getHours() * 60 + new Date().getMinutes()) {
      toast.warning(SLOT_VALIDATION.PAST_TIME_MSG);
      return;
    }

    setCustomSlotsByDate((prev) => {
      const current = prev[currentKey] ?? [];
      if (current.includes(value)) return prev;
      return { ...prev, [currentKey]: [...current, value] };
    });
  }, [selectedDate, currentKey, toast]);

  const handleRemoveCustomSlot = useCallback((value: string) => {
    setCustomSlotsByDate((prev) => {
      const current = prev[currentKey] ?? [];
      return { ...prev, [currentKey]: current.filter((s) => s !== value) };
    });
  }, [currentKey]);

  const handleConfirm = useCallback(() => {
    if (!empId) return;

    const allSlotValues: { dateKey: string; value: string }[] = [];

    for (const key of Object.keys(selectedSlotsByDate)) {
      for (const value of selectedSlotsByDate[key]) {
        allSlotValues.push({ dateKey: key, value });
      }
    }
    for (const key of Object.keys(customSlotsByDate)) {
      for (const value of customSlotsByDate[key]) {
        allSlotValues.push({ dateKey: key, value });
      }
    }

    const payload: SlotsCreateRequest = {
      emp_id: empId,
      slots: allSlotValues.map(({ dateKey, value }) => {
        const [start, end] = value.split("-");
        return {
          start_at: toDateTime(dateKey, start),
          end_at: toDateTime(dateKey, end),
        };
      }),
    };

    createMutation.mutate(payload, {
      onSuccess: () => {
        toast.success(BOOKING_LABELS.CONFIRMED);
      },
      onError: () => {
        toast.error(BOOKING_LABELS.CONFIRM_FAILED);
      },
    });
  }, [selectedSlotsByDate, customSlotsByDate, empId, createMutation, toast]);

  const slots = useMemo(() => {
    if (!selectedDate) return [];

    if (!isToday(selectedDate)) return ALL_SLOTS;

    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    return ALL_SLOTS.filter((slot) => {
      const start = slot.value.split("-")[0];
      return toMinutes(start) > currentMinutes;
    });
  }, [selectedDate]);

  return {
    formId,
    formValid: formQuery.data?.valid ?? false,
    formLoading: formQuery.isLoading,
    formError: formQuery.isError,
    formErrorMessage,
    empId,
    selectedDate,
    setSelectedDate,
    selectedSlots,
    customSlots,
    totalSlotsCount,
    slots,
    isSubmitting: createMutation.isPending,
    submitError: createMutation.isError,
    isConfirmed: createMutation.isSuccess,
    handleToggleSlot,
    handleAddCustomSlot,
    handleRemoveCustomSlot,
    handleConfirm,
  };
}
