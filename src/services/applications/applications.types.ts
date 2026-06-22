export type ApplicationJobListing = {
  title: string;
  department: string;
  location: string;
};

export type Application = {
  id: string;
  job_id: string;
  name: string;
  email: string;
  phone: string;
  cover_letter: string;
  resume_url: string | null;
  status: string;
  created_at: string;
  job_listings: ApplicationJobListing | null;
};

export type ApplicationsResponse = {
  data: Application[];
};
