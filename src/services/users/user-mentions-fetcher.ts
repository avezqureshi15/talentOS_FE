import { fetchUsers } from "./users";

export type UserMentionsFetcherResultItem = {
  id: string;
  label: string;
  description: string;
  relationalId: string;
};

export type UserMentionsFetcherPaginatedResult = {
  items: UserMentionsFetcherResultItem[];
  hasMore: boolean;
};

export const fetchUsersForMentions = async (
  query: string,
  page: number,
): Promise<UserMentionsFetcherPaginatedResult> => {
  const res = await fetchUsers(query || undefined, page, 20);

  const items: UserMentionsFetcherResultItem[] = res.data.map((user) => ({
    id: String(user.id),
    label: user.name,
    description: `${user.designation} · ${user.department}`,
    relationalId: user.emp_id,
  }));

  return { items, hasMore: res.has_more };
};
