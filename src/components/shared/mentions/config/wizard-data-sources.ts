import type { CommandEntry, CommandItem } from "../types";
import { fetchHiringRequestsForMentions } from "@/services/hiring-requests/hiring-request-mentions-fetcher";
import { fetchCandidatesForMentions } from "@/services/applications/candidate-mentions-fetcher";
import { fetchUsersForMentions } from "@/services/users/user-mentions-fetcher";
import { fetchInterviewsForMentions } from "@/services/interviews/interview-mentions-fetcher";
import { fetchAlertsForMentions } from "@/services/alerts/alert-mentions-fetcher";
import { fetchRoundsForMentions } from "@/services/rounds/round-mentions-fetcher";

type FetcherFn = (query: string, page: number) => Promise<{ items: CommandItem[]; hasMore: boolean }>;

export type DataSourceEntry = {
  createEntry: (context?: Record<string, string>) => CommandEntry;
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

function createCandidateEntry(context?: Record<string, string>): CommandEntry {
  const jobId = context?.jobId;
  return createPaginatableEntry(
    "candidate-search",
    "Candidates",
    "Search candidates...",
    (query, page) => fetchCandidatesForMentions(query, page, jobId),
  );
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

function createInterviewsByCandidateEntry(context?: Record<string, string>): CommandEntry {
  const candidateId = context?.candidateId;
  return createPaginatableEntry(
    "interview-by-candidate-search", "Interviews", "Search interviews...",
    (query, page) => fetchInterviewsForMentions(query, page, candidateId),
  );
}

function createRoundsByCandidateEntry(context?: Record<string, string>): CommandEntry {
  const candidateId = context?.candidateId;
  return createPaginatableEntry(
    "round-by-candidate-search", "Rounds", "Search rounds...",
    (query, page) => fetchRoundsForMentions(query, page, candidateId),
  );
}

function createAlertEntry(): CommandEntry {
  return createPaginatableEntry("alert-search", "Alerts", "Search alerts...", fetchAlertsForMentions);
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
  "send-mail": {
    0: { createEntry: createEmployeeEntry },
  },
  "employees-view": {
    0: { createEntry: createEmployeeEntry },
  },
  "employees-ask-slots": {
    0: { createEntry: createEmployeeWithSlotsEntry },
  },
  "applicants-view": {
    0: { createEntry: createCandidateEntry },
  },
  "interviews": {
    0: { createEntry: createCandidateEntry },
    1: { createEntry: createInterviewsByCandidateEntry },
  },
  "alerts": {
    0: { createEntry: createAlertEntry },
  },
  "rounds": {
    0: { createEntry: createCandidateEntry },
    1: { createEntry: createRoundsByCandidateEntry },
  },
};
