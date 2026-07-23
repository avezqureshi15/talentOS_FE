import httpClient from "@/services/http-client";
import { API_ENDPOINTS } from "@/constants/api-endpoints";

export type SettingEntry = {
  key: string;
  value: string;
};

export type SettingsResponse = {
  settings: SettingEntry[];
};

export const getSettings = () =>
  httpClient.get<SettingsResponse>(API_ENDPOINTS.SETTINGS);

export const updateSettings = (settings: SettingEntry[]) =>
  httpClient.patch<SettingsResponse>(API_ENDPOINTS.SETTINGS, { settings });
