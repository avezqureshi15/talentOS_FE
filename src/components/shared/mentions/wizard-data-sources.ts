import type { CommandEntry } from "./mentions.types";
import { fetchHiringRequestsForMentions } from "@/services/hiring-requests/hiring-request-mentions-fetcher";
import { fetchCandidatesForMentions } from "@/services/applications/candidate-mentions-fetcher";
import { fetchUsersForMentions } from "@/services/users/user-mentions-fetcher";

export type DataSourceEntry = {
  createEntry: () => CommandEntry;
};

function createHiringRequestEntry(): CommandEntry {
  let currentPage = 1;
  let currentQuery = "";
  const entry: CommandEntry = {
    id: "hiring-request-search",
    label: "Hiring Requests",
    searchPlaceholder: "Search hiring requests...",
    hasMore: true,
    fetcher: async (query: string) => {
      currentQuery = query;
      currentPage = 1;
      const result = await fetchHiringRequestsForMentions(query, 1);
      entry.hasMore = result.hasMore;
      return result.items;
    },
    loadMore: async () => {
      currentPage += 1;
      const result = await fetchHiringRequestsForMentions(currentQuery, currentPage);
      entry.hasMore = result.hasMore;
      return result.items;
    },
  };
  return entry;
}

function createInterviewerEntry(): CommandEntry {
  let currentPage = 1;
  let currentQuery = "";
  const entry: CommandEntry = {
    id: "interviewer-search",
    label: "Interviewers",
    searchPlaceholder: "Search interviewers...",
    hasMore: true,
    fetcher: async (query: string) => {
      currentQuery = query;
      currentPage = 1;
      const result = await fetchUsersForMentions(query, 1);
      entry.hasMore = result.hasMore;
      return result.items;
    },
    loadMore: async () => {
      currentPage += 1;
      const result = await fetchUsersForMentions(currentQuery, currentPage);
      entry.hasMore = result.hasMore;
      return result.items;
    },
  };
  return entry;
}

function createCandidateEntry(): CommandEntry {
  let currentPage = 1;
  let currentQuery = "";
  const entry: CommandEntry = {
    id: "candidate-search",
    label: "Candidates",
    searchPlaceholder: "Search candidates...",
    hasMore: true,
    fetcher: async (query: string) => {
      currentQuery = query;
      currentPage = 1;
      const result = await fetchCandidatesForMentions(query, 1);
      entry.hasMore = result.hasMore;
      return result.items;
    },
    loadMore: async () => {
      currentPage += 1;
      const result = await fetchCandidatesForMentions(currentQuery, currentPage);
      entry.hasMore = result.hasMore;
      return result.items;
    },
  };
  return entry;
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
  "employees-ping": {
    1: { createEntry: createCandidateEntry },
  },
  "applicants": {
    1: { createEntry: createCandidateEntry },
  },
};
