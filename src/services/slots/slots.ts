import httpClient from "@/services/http-client";
import { API_ENDPOINTS } from "@/constants/api-endpoints";
import type { CommandItem } from "@/components/shared/mentions/types";

export type SlotApiItem = {
  id: string;
  label: string;
  day: string;
};

export const fetchSlotsByEmployee = async (empId: string): Promise<CommandItem[]> => {
  const { data } = await httpClient.get<SlotApiItem[]>(`${API_ENDPOINTS.SLOTS_EMPLOYEE}/${empId}`);
  return data.map((slot) => ({
    id: slot.id,
    label: slot.label,
    description: slot.day,
    relationalId: empId,
  }));
};
