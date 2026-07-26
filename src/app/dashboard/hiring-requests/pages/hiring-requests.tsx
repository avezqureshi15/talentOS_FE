import { useState, useCallback, useEffect, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import HiringRequestsTable from "@/app/dashboard/hiring-requests/components/table/table";
import Alerts from "@/app/dashboard/hiring-requests/components/alerts/alerts";
import Interviews from "@/app/dashboard/hiring-requests/components/interviews/interviews";
import LoadingSpinner from "@/components/ui/loading-spinner/loading-spinner";
import ErrorBoundary from "@/components/ui/error-boundary/error-boundary";
import { useHiringRequests } from "@/app/dashboard/hiring-requests/hooks/use-hiring-requests";
import { fetchHiringRequests } from "@/services/hiring-requests/hiring-requests";
import type { HiringRequestsFilters } from "@/services/hiring-requests/hiring-requests.types";
import { QUERY_KEYS, HR_TABS, ALERTS_TABS, ALERTS_CHIP_LABEL, ALERTS_DESCRIPTION } from "@/constants/constants";
import { useCmdPaletteRegistration } from "@/layouts/protected-layouts/components/command-palette/hooks/use-command-palette-registration";
import "./hiring-requests.css";

const HiringRequests = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
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

  const cmdPaletteConfig = useMemo(
    () => ({
      placeholder: "Search hiring requests...",
      sectionTitle: "Hiring Requests",
      search: async (q: string) => {
        if (!q.trim()) return [];
        const res = await fetchHiringRequests({ q, page: 1, per_page: 10 });
        return res.data.map((hr) => ({
          id: hr.id,
          label: hr.title,
          sublabel: hr.department ? `${hr.department} · ${hr.location ?? ""}` : hr.location ?? "",
          type: "hiring-request" as const,
        }));
      },
      onSelect: (item: { id: string }) => {
        navigate(`/hiring-requests/${item.id}`);
      },
    }),
    [navigate],
  );
  useCmdPaletteRegistration(cmdPaletteConfig);

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
            <div className="ac-info-card">
              <span className="ac-info-chip"><i className="bx bx-info-circle" /> {ALERTS_CHIP_LABEL}</span>
              <span className="ac-info-text">{ALERTS_DESCRIPTION}</span>
            </div>
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
            <Alerts sub={sub as "slots" | "reviews"} />
          </div>
        )}

        
      </div>
    </ErrorBoundary>
  );
};

export default HiringRequests;
