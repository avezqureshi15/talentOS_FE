import { fetchHiringRequests } from "./hiring-requests";

export type MentionsFetcherResultItem = {
  id: string;
  label: string;
  description: string;
  relationalId: string;
};

export type MentionsFetcherPaginatedResult = {
  items: MentionsFetcherResultItem[];
  hasMore: boolean;
};

export const fetchHiringRequestsForMentions = async (
  query: string,
  page: number,
): Promise<MentionsFetcherPaginatedResult> => {
  const res = await fetchHiringRequests({
    q: query || undefined,
    page,
    per_page: 20,
  });

  const items: MentionsFetcherResultItem[] = res.data.map((hr) => ({
    id: hr.id,
    label: hr.title,
    description: `${hr.department} · ${hr.location}`,
    relationalId: hr.supabase_job_id || hr.id,
  }));

  return { items, hasMore: res.has_more };
};
