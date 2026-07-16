import httpClient from "@/services/http-client";
import { API_ENDPOINTS, PAGINATION } from "@/constants/api-endpoints";
import type { CommandItem } from "@/components/shared/mentions/types";

type RoundListItem = {
  id: string;
  name: string | null;
  round_verdict: string | null;
  candidate_name: string | null;
  candidate_id: string | null;
  position_title: string | null;
  created_at: string | null;
};

type PaginatedRoundResponse = {
  items: RoundListItem[];
  total: number;
  page: number;
  per_page: number;
  has_more: boolean;
};

export type RoundMentionsFetcherResult = {
  items: CommandItem[];
  hasMore: boolean;
};

export const fetchRoundsForMentions = async (
  query: string,
  page: number,
  candidateId?: string,
): Promise<RoundMentionsFetcherResult> => {
  const perPage = 20;
  const params: Record<string, string | number> = { page, per_page: perPage };
  if (query) params.search = query;
  if (candidateId) params.candidate_id = candidateId;
  const res = await httpClient.get<PaginatedRoundResponse>(
    API_ENDPOINTS.ROUNDS,
    { params },
  );

  const items: CommandItem[] = res.data.items.map((r) => ({
    id: r.id,
    label: `${r.name ?? "Round"} - ${r.candidate_name ?? "Unknown"}`,
    description: r.position_title ?? "",
    relationalId: r.candidate_id ?? r.id,
  }));

  return { items, hasMore: res.data.has_more };
};
