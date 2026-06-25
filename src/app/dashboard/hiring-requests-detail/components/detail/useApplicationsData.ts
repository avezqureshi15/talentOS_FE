import { useMemo } from "react";
import { useApplications } from "@/app/dashboard/hiring-requests/hooks/use-applications";
import type { Applicant } from "@/app/dashboard/hiring-requests-detail/components/applicants/applicants.types";

export const useApplicationsData = (jobId: string, filter: string, enabled: boolean) => {
  const { data: apiApplications, isLoading } = useApplications(jobId, filter, enabled);

  const applicants: Applicant[] = useMemo(() => {
    if (!apiApplications) return [];
    return apiApplications.map((app) => ({
      id: app.id,
      name: app.name ?? "",
      email: app.email ?? "",
      phone: app.phone ?? "",
      coverLetter: app.cover_letter ?? "",
      aiSummary: app.summary_md ?? undefined,
      experienceYears: 0,
      currentRole: "",
      currentCompany: "",
      linkedinUrl: "",
      cvUrl: app.resume_url ?? "",
      status: "new",
      score: app.fit_score ?? undefined,
    }));
  }, [apiApplications]);

  return { applicants, isLoading };
};
