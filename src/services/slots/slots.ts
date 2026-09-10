import httpClient from "@/services/http-client";
import { API_ENDPOINTS, PAGINATION } from "@/constants/api-endpoints";
import type { CommandItem } from "@/components/shared/mentions/types";
import type { SlotApiItem } from "./slots.types";

export type { SlotApiItem };

const SLOTS_PER_PAGE: number = 50;

export type PaginatedSlotsResponse = {
  data: SlotApiItem[];
  total: number;
  page: number;
  per_page: number;
  has_more: boolean;
};

function extractSlots(res: SlotApiItem[] | PaginatedSlotsResponse): { items: SlotApiItem[]; total: number } {
  if (Array.isArray(res)) {
    return { items: res, total: res.length };
  }
  return { items: res.data, total: res.total };
}

function toCommandItems(slots: SlotApiItem[], empId: string): CommandItem[] {
  return slots.map((slot) => ({
    id: slot.id,
    label: slot.label,
    description: slot.day,
    relationalId: empId,
  }));
}

export const fetchSlotsByEmployee = async (
  empId: string,
  page: number = PAGINATION.DEFAULT_PAGE,
  per_page: number = SLOTS_PER_PAGE,
): Promise<CommandItem[]> => {
  const params: Record<string, string | number> = { page, per_page };
  const res = await httpClient.get<SlotApiItem[] | PaginatedSlotsResponse>(
    `${API_ENDPOINTS.SLOTS_EMPLOYEE}/${empId}`,
    { params },
  );
  const { items } = extractSlots(res.data);
  return toCommandItems(items, empId);
};

export async function fetchInterviewerSchedule(
  empId: string,
): Promise<CommandItem[]> {
  return fetchSlotsByEmployee(empId);
}
