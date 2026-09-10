import httpClient from "@/services/http-client";
import { API_ENDPOINTS } from "@/constants/api-endpoints";
import type { Organization, UpdateOrganizationPayload } from "./organization.types";

export const getOrganization = () =>
  httpClient.get<Organization>(API_ENDPOINTS.ADMIN_ORGANIZATION);

export const updateOrganization = (payload: UpdateOrganizationPayload) =>
  httpClient.patch<Organization>(API_ENDPOINTS.ADMIN_ORGANIZATION, payload);
