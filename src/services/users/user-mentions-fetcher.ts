import { fetchUsers } from "./users";

export type UserMentionsFetcherResultItem = {
  id: string;
  label: string;
  description: string;
  relationalId: string;
  meta?: Record<string, string>;
};

export type UserMentionsFetcherPaginatedResult = {
  items: UserMentionsFetcherResultItem[];
  hasMore: boolean;
};

export const fetchUsersForMentions = async (
  query: string,
  page: number,
  slotsInfo?: boolean,
): Promise<UserMentionsFetcherPaginatedResult> => {
  const res = await fetchUsers(query || undefined, page, 20, slotsInfo);

  const items: UserMentionsFetcherResultItem[] = res.data.map((user) => ({
    id: String(user.id),
    label: user.name,
    description: slotsInfo && user.slots_count !== undefined
      ? `${user.slots_count} slot${user.slots_count === 1 ? "" : "s"} available`
      : `${user.designation} · ${user.department}`,
    relationalId: user.emp_id,
    meta: {
      type: "interviewer",
      email: user.email,
      designation: user.designation,
      department: user.department,
      ...(slotsInfo && user.slots_count !== undefined
        ? { slots_count: String(user.slots_count), has_slots: String(user.has_slots) }
        : {}),
    },
  }));

  return { items, hasMore: res.has_more };
};
