import type { HiringRequest } from "@/services/hiring-requests/hiring-requests.types";

export type JobDetailProps = {
  hiringRequest: HiringRequest;
};

export type Segment = "jd" | "applicants" | "final-verdict";
