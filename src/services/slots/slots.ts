import httpClient from "@/services/http-client";
import { API_ENDPOINTS } from "@/constants/api-endpoints";
import type { CommandItem } from "@/components/shared/mentions/types";

export type SlotResponseItem = {
  id: string;
  label: string;
  description: string;
  relationalId: string;
};

export type SlotByEmployeeResponse = {
  data: SlotResponseItem[];
};

export const fetchSlotsByEmployee = async (empId: string): Promise<CommandItem[]> => {
  const { data } = await httpClient.get<SlotByEmployeeResponse>(`${API_ENDPOINTS.SLOTS}employee/${empId}`);
  return data.data.map((slot) => ({
    id: slot.id,
    label: slot.label,
    description: slot.description,
    relationalId: slot.relationalId,
  }));
};
