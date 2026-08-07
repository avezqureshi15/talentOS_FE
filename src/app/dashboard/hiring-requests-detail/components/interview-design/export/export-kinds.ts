import { PLANNER_KIND_SWITCHER_LABELS } from "../components/planner-kind-switcher/planner-kind-switcher.constants";

export type InterviewDesignExportKind = "all" | "screening" | "interview" | "review";

export type InterviewDesignExportOption = {
  kind: InterviewDesignExportKind;
  key: string;
  label: string;
  icon: string;
};

export const INTERVIEW_DESIGN_EXPORT_OPTIONS: readonly InterviewDesignExportOption[] = [
  {
    kind: "all",
    key: "export",
    label: "Export ALL",
    icon: "bx-download",
  },
  {
    kind: "screening",
    key: "export-screening",
    label: `Export ${PLANNER_KIND_SWITCHER_LABELS.SCREENING}`,
    icon: "bx-download",
  },
  {
    kind: "interview",
    key: "export-interview",
    label: `Export ${PLANNER_KIND_SWITCHER_LABELS.INTERVIEW}`,
    icon: "bx-download",
  },
  {
    kind: "review",
    key: "export-review",
    label: `Export ${PLANNER_KIND_SWITCHER_LABELS.REVIEW}`,
    icon: "bx-download",
  },
] as const;
