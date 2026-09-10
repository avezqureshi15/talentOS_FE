import httpClient from "@/services/http-client";
import { API_ENDPOINTS } from "@/constants/api-endpoints";

export type AiScreeningSettings = {
  enforce_phone_geography: boolean;
  allowed_phone_regions: string[];
  screening_enabled: boolean;
  screening_max_retries: number;
  screening_retry_delay_seconds: number;
  updated_at?: string | null;
  source?: "tenant" | "poc" | "default";
};

export type AiScreeningSettingsUpdate = Partial<
  Pick<
    AiScreeningSettings,
    | "enforce_phone_geography"
    | "allowed_phone_regions"
    | "screening_enabled"
    | "screening_max_retries"
    | "screening_retry_delay_seconds"
  >
>;

export const DEFAULT_AI_SCREENING_SETTINGS: AiScreeningSettings = {
  enforce_phone_geography: false,
  allowed_phone_regions: [],
  screening_enabled: true,
  screening_max_retries: 3,
  screening_retry_delay_seconds: 1800,
  source: "default",
};

let cached: AiScreeningSettings | null = null;
let inflight: Promise<AiScreeningSettings> | null = null;

export function getCachedAiScreeningSettings(): AiScreeningSettings | null {
  return cached;
}

export async function loadAiScreeningSettings(force = false): Promise<AiScreeningSettings> {
  if (cached && !force) return cached;
  if (inflight && !force) return inflight;
  inflight = httpClient
    .get<AiScreeningSettings>(API_ENDPOINTS.SETTINGS_AI_SCREENING, {
      toastOnError: false,
      skip403Toast: true,
    })
    .then(({ data }) => {
      cached = { ...DEFAULT_AI_SCREENING_SETTINGS, ...data };
      return cached;
    })
    .catch(() => {
      cached = { ...DEFAULT_AI_SCREENING_SETTINGS };
      return cached;
    })
    .finally(() => {
      inflight = null;
    });
  return inflight;
}

export async function saveAiScreeningSettings(
  payload: AiScreeningSettingsUpdate,
): Promise<AiScreeningSettings> {
  const { data } = await httpClient.patch<AiScreeningSettings>(
    API_ENDPOINTS.SETTINGS_AI_SCREENING,
    payload,
    { toastOnError: false },
  );
  cached = { ...DEFAULT_AI_SCREENING_SETTINGS, ...data };
  return cached;
}
