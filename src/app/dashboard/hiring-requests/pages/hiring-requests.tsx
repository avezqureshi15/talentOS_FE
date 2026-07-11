import { useState, useCallback, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import HiringRequestsTable from "@/app/dashboard/hiring-requests/components/table/table";
import Slots from "@/app/dashboard/hiring-requests/components/slots/slots";
import Reviews from "@/app/dashboard/hiring-requests/components/reviews/reviews";
import Interviews from "@/app/dashboard/hiring-requests/components/interviews/interviews";
import LoadingSpinner from "@/components/ui/loading-spinner/loading-spinner";
import ErrorBoundary from "@/components/ui/error-boundary/error-boundary";
import { useHiringRequests } from "@/app/dashboard/hiring-requests/hooks/use-hiring-requests";
import type { HiringRequestsFilters } from "@/services/hiring-requests/hiring-requests.types";
import { QUERY_KEYS, HR_TABS, ALERTS_TABS, ALERTS_DESCRIPTION } from "@/constants/constants";
import "./hiring-requests.css";

const HiringRequests = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const tab = searchParams.get("tab") || "hiring-requests";
  const sub = searchParams.get("sub") || "slots";
  const highlight = searchParams.get("highlight") === "true";
  const setTab = (key: string) => setSearchParams({ tab: key });

  useEffect(() => {
    if (!highlight) return;
    const t = setTimeout(() => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        next.delete("highlight");
        return next;
      }, { replace: true });
    }, 2000);
    return () => clearTimeout(t);
  }, [highlight, setSearchParams]);

  const [filters, setFilters] = useState<HiringRequestsFilters>({
    page: 1,
    per_page: 10,
  });
  const { data, isLoading, error } = useHiringRequests(filters);
  const queryClient = useQueryClient();

  const handleRetry = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.HIRING_REQUESTS, filters] });
  }, [queryClient, filters]);

  const handleFilterChange = useCallback((patch: Partial<HiringRequestsFilters>) => {
    setFilters((prev) => ({ ...prev, ...patch, page: 1 }));
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  }, []);

  const handlePerPageChange = useCallback((per_page: number) => {
    setFilters((prev) => ({ ...prev, per_page, page: 1 }));
  }, []);

  return (
    <ErrorBoundary>
      <div className="hiring-requests-page">
        <div className="hr-tabs">
          {HR_TABS.map((t) => (
            <button
              key={t.key}
              className={`hr-tab${tab === t.key ? " hr-tab--active" : ""}${highlight && t.key === "alerts" ? " hr-tab--blip" : ""}`}
              onClick={() => setTab(t.key)}
              type="button"
            >
              <i className={t.icon} />
              {t.label}
              {highlight && t.key === "alerts" && <span className="hr-tab__badge" />}
            </button>
          ))}
        </div>

        {tab === "hiring-requests" && (
          isLoading && !data ? (
            <LoadingSpinner fullPage />
          ) : (
            <HiringRequestsTable
              filters={filters}
              data={data?.data ?? []}
              page={data?.page ?? 1}
              perPage={data?.per_page ?? 10}
              total={data?.total ?? 0}
              totalPages={data?.total_pages ?? 1}
              isLoading={isLoading}
              error={error?.message ?? null}
              onRetry={handleRetry}
              onFilterChange={handleFilterChange}
              onPageChange={handlePageChange}
              onPerPageChange={handlePerPageChange}
            />
          )
        )}

        {tab === "interviews" && <Interviews />}

        {tab === "alerts" && (
          <div className="ac-content">
            <p className="ac-description">{ALERTS_DESCRIPTION}</p>
            <div className="ac-tabs">
              {ALERTS_TABS.map((st) => (
                <button
                  key={st.key}
                  className={`ac-tab${sub === st.key ? " ac-tab--active" : ""}`}
                  onClick={() => setSearchParams({ tab: "alerts", sub: st.key })}
                  type="button"
                >
                  <i className={st.icon} />
                  {st.label}
                </button>
              ))}
            </div>
            {sub === "slots" ? <Slots /> : sub === "reviews" ? <Reviews /> : <div className="hr-tab-placeholder">Coming soon</div>}
          </div>
        )}

        
      </div>
    </ErrorBoundary>
  );
};

export default HiringRequests;
