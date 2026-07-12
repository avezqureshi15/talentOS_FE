import type { CommandEntry, CommandItem } from "../types";
import { fetchHiringRequestsForMentions } from "@/services/hiring-requests/hiring-request-mentions-fetcher";
import { fetchCandidatesForMentions } from "@/services/applications/candidate-mentions-fetcher";
import { fetchUsersForMentions } from "@/services/users/user-mentions-fetcher";

type FetcherFn = (query: string, page: number) => Promise<{ items: CommandItem[]; hasMore: boolean }>;

export type DataSourceEntry = {
  createEntry: () => CommandEntry;
};

function createPaginatableEntry(id: string, label: string, placeholder: string, fetch: FetcherFn): CommandEntry {
  let currentPage = 1;
  let currentQuery = "";
  const entry: CommandEntry = {
    id,
    label,
    searchPlaceholder: placeholder,
    hasMore: true,
    fetcher: async (query: string) => {
      currentQuery = query;
      currentPage = 1;
      const result = await fetch(query, 1);
      entry.hasMore = result.hasMore;
      return result.items;
    },
    loadMore: async () => {
      currentPage += 1;
      const result = await fetch(currentQuery, currentPage);
      entry.hasMore = result.hasMore;
      return result.items;
    },
  };
  return entry;
}

function createHiringRequestEntry(): CommandEntry {
  return createPaginatableEntry("hiring-request-search", "Hiring Requests", "Search hiring requests...", fetchHiringRequestsForMentions);
}

function createInterviewerEntry(): CommandEntry {
  return createPaginatableEntry(
    "interviewer-search",
    "Interviewers",
    "Search interviewers...",
    (query, page) => fetchUsersForMentions(query, page, true),
  );
}

function createCandidateEntry(): CommandEntry {
  return createPaginatableEntry("candidate-search", "Candidates", "Search candidates...", fetchCandidatesForMentions);
}

function createEmployeeEntry(): CommandEntry {
  return createPaginatableEntry("employee-search", "Employees", "Search employees...", fetchUsersForMentions);
}

function createEmployeeWithSlotsEntry(): CommandEntry {
  return createPaginatableEntry(
    "employee-slots-search",
    "Employees",
    "Search employees...",
    (query, page) => fetchUsersForMentions(query, page, true),
  );
}

export const WIZARD_REAL_DATA_SOURCES: Record<string, Record<number, DataSourceEntry>> = {
  "book-interview": {
    0: { createEntry: createHiringRequestEntry },
    1: { createEntry: createCandidateEntry },
    2: { createEntry: createInterviewerEntry },
  },
  "hr-request": {
    0: { createEntry: createHiringRequestEntry },
  },
  "employees-send-mail": {
    0: { createEntry: createEmployeeEntry },
  },
  "employees-view": {
    0: { createEntry: createEmployeeEntry },
  },
  "employees-ask-slots": {
    0: { createEntry: createEmployeeWithSlotsEntry },
  },
  "applicants-send-mail": {
    0: { createEntry: createCandidateEntry },
  },
  "applicants-view": {
    0: { createEntry: createCandidateEntry },
  },
};
