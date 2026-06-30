import { create } from "zustand";
import { fetchHiringRequestById } from "@/services/hiring-requests/hiring-requests";
import { fetchApplicationById } from "@/services/applications/applications";
import { fetchUserByEmpId } from "@/services/users/users";

export type EntityType = "hiring-request" | "candidate" | "user";

type ResolverCache = Record<string, string | null | undefined>;

type EntityResolverState = {
  hiringRequestCache: ResolverCache;
  candidateCache: ResolverCache;
  userCache: ResolverCache;
  loadingIds: Record<string, boolean>;
  resolveHiringRequest: (id: string) => Promise<string | null | undefined>;
  resolveCandidate: (id: string) => Promise<string | null | undefined>;
  resolveUser: (empId: string) => Promise<string | null | undefined>;
  getLabel: (type: EntityType, id: string) => string | null | undefined;
  isLoading: (id: string) => boolean;
};

export const useEntityResolverStore = create<EntityResolverState>((set, get) => ({
  hiringRequestCache: {},
  candidateCache: {},
  userCache: {},
  loadingIds: {},

  resolveHiringRequest: async (id: string) => {
    const cached = get().hiringRequestCache[id];
    if (cached !== undefined) return cached;
    if (get().loadingIds[id]) return;

    set((s) => ({ loadingIds: { ...s.loadingIds, [id]: true } }));
    try {
      const hr = await fetchHiringRequestById(id);
      const label = hr.title;
      set((s) => ({
        hiringRequestCache: { ...s.hiringRequestCache, [id]: label },
        loadingIds: { ...s.loadingIds, [id]: false },
      }));
      return label;
    } catch {
      set((s) => ({
        hiringRequestCache: { ...s.hiringRequestCache, [id]: null },
        loadingIds: { ...s.loadingIds, [id]: false },
      }));
      return;
    }
  },

  resolveCandidate: async (id: string) => {
    const cached = get().candidateCache[id];
    if (cached !== undefined) return cached;
    if (get().loadingIds[id]) return;

    set((s) => ({ loadingIds: { ...s.loadingIds, [id]: true } }));
    try {
      const candidate = await fetchApplicationById(id);
      const label = candidate.name ?? candidate.email ?? "Unknown";
      set((s) => ({
        candidateCache: { ...s.candidateCache, [id]: label },
        loadingIds: { ...s.loadingIds, [id]: false },
      }));
      return label;
    } catch {
      set((s) => ({
        candidateCache: { ...s.candidateCache, [id]: null },
        loadingIds: { ...s.loadingIds, [id]: false },
      }));
      return;
    }
  },

  resolveUser: async (empId: string) => {
    const cached = get().userCache[empId];
    if (cached !== undefined) return cached;
    if (get().loadingIds[empId]) return;

    set((s) => ({ loadingIds: { ...s.loadingIds, [empId]: true } }));
    try {
      const user = await fetchUserByEmpId(empId);
      if (!user) {
        set((s) => ({
          userCache: { ...s.userCache, [empId]: null },
          loadingIds: { ...s.loadingIds, [empId]: false },
        }));
        return;
      }
      const label = user.name;
      set((s) => ({
        userCache: { ...s.userCache, [empId]: label },
        loadingIds: { ...s.loadingIds, [empId]: false },
      }));
      return label;
    } catch {
      set((s) => ({
        userCache: { ...s.userCache, [empId]: null },
        loadingIds: { ...s.loadingIds, [empId]: false },
      }));
      return;
    }
  },

  getLabel: (type: EntityType, id: string) => {
    if (!id) return;
    const cache = type === "hiring-request"
      ? get().hiringRequestCache
      : type === "candidate"
        ? get().candidateCache
        : get().userCache;
    return cache[id];
  },

  isLoading: (id: string) => !!get().loadingIds[id],
}));
