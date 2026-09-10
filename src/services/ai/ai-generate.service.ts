import httpClient from "@/services/http-client";
import { API_ENDPOINTS } from "@/constants/api-endpoints";

export type GenerateStructuredInput = {
  prompt: string;
  inputData?: Record<string, unknown>;
  responseSchema: Record<string, unknown>;
  useEvaluationModel?: boolean;
};

export const generateStructured = async ({
  prompt,
  inputData = {},
  responseSchema,
  useEvaluationModel = false,
}: GenerateStructuredInput): Promise<Record<string, unknown>> => {
  const { data } = await httpClient.post<{ result: Record<string, unknown> }>(
    API_ENDPOINTS.AI_GENERATE,
    {
      prompt,
      input_data: inputData,
      response_schema: responseSchema,
      use_evaluation_model: useEvaluationModel,
    },
  );
  return data.result;
};
