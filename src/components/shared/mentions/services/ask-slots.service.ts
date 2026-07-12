import httpClient from "@/services/http-client";
import { API_ENDPOINTS } from "@/constants/api-endpoints";

export type AskSlotsResultItem = {
  emp_id: string;
  status: "SUCCESS" | "FAILED";
  message: string;
};

export type AskSlotsResponse = {
  message: string;
  results: AskSlotsResultItem[];
};

export const askSlotsForEmployee = async (empId: string): Promise<AskSlotsResponse> => {
  const { data } = await httpClient.post<AskSlotsResponse>(
    API_ENDPOINTS.ASK_FORM,
    { emp_ids: [empId], type: "SLOTS" },
  );
  return data;
};
