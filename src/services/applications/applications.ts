import httpClient from "@/services/http-client";
import type { ApplicationsResponse, Application } from "./applications.types";

export const fetchApplications = async (): Promise<Application[]> => {
  const { data } = await httpClient.get<ApplicationsResponse>("/applications/");
  return data.data;
};
