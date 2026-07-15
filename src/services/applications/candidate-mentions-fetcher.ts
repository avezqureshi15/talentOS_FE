import { fetchApplicationsPaginated } from "./applications";

export type CandidateMentionsFetcherResultItem = {
  id: string;
  label: string;
  description: string;
  relationalId: string;
};

export type CandidateMentionsFetcherPaginatedResult = {
  items: CandidateMentionsFetcherResultItem[];
  hasMore: boolean;
};

export const fetchCandidatesForMentions = async (
  query: string,
  page: number,
  jobId?: string,
): Promise<CandidateMentionsFetcherPaginatedResult> => {
  const limit = 20;
  const offset = (page - 1) * limit;

  const res = await fetchApplicationsPaginated(jobId, undefined, undefined, undefined, undefined, undefined, limit, offset, undefined, query || undefined);

  const items: CandidateMentionsFetcherResultItem[] = res.data.map((candidate) => ({
    id: candidate.id,
    label: candidate.name ?? candidate.email ?? "Unknown",
    description: [candidate.location, candidate.years_of_experience ? `${candidate.years_of_experience} exp` : ""].filter(Boolean).join(" · "),
    relationalId: candidate.id,
  }));

  const hasMore = offset + limit < res.total;

  return { items, hasMore };
};
