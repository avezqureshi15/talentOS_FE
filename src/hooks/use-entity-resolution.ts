import { useEffect, useMemo } from "react";
import { useEntityResolverStore, type EntityType } from "@/store/entity-resolver.store";

export type EntityToResolve = {
  key: string;
  type: EntityType;
  id: string;
};

export type EntityResolutionResult = {
  resolved: Record<string, string | null | undefined>;
  loading: boolean;
};

export function useEntityResolution(entities: EntityToResolve[]): EntityResolutionResult {
  const resolveHiringRequest = useEntityResolverStore((s) => s.resolveHiringRequest);
  const resolveCandidate = useEntityResolverStore((s) => s.resolveCandidate);
  const resolveUser = useEntityResolverStore((s) => s.resolveUser);
  const getLabel = useEntityResolverStore((s) => s.getLabel);
  const loadingIds = useEntityResolverStore((s) => s.loadingIds);

  useEffect(() => {
    for (const entity of entities) {
      if (!entity.id) continue;
      const label = getLabel(entity.type, entity.id);
      if (label !== undefined) continue;

      switch (entity.type) {
        case "hiring-request":
          resolveHiringRequest(entity.id);
          break;
        case "candidate":
          resolveCandidate(entity.id);
          break;
        case "user":
          resolveUser(entity.id);
          break;
      }
    }
  }, [entities, getLabel, resolveHiringRequest, resolveCandidate, resolveUser]);

  const resolved = useMemo(() => {
    const result: Record<string, string | null | undefined> = {};
    for (const entity of entities) {
      if (!entity.id) {
        result[entity.key] = undefined;
        continue;
      }
      result[entity.key] = getLabel(entity.type, entity.id);
    }
    return result;
  }, [entities, getLabel]);

  const loading = entities.some((e) => e.id && loadingIds[e.id]);

  return { resolved, loading };
}
