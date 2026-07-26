export type Organization = {
  id: number;
  name: string;
  slug: string;
  is_active: boolean;
  verification_status: string;
  user_count: number;
  logo_url: string | null;
  website: string | null;
  phone: string | null;
  description: string | null;
  address_line1: string | null;
  address_line2: string | null;
  city: string | null;
  state: string | null;
  postal_code: string | null;
  country: string | null;
  gst_number: string | null;
  created_at: string;
  updated_at: string;
};

export type UpdateOrganizationPayload = {
  logo_url?: string | null;
  website?: string | null;
  phone?: string | null;
  description?: string | null;
  address_line1?: string | null;
  address_line2?: string | null;
  city?: string | null;
  state?: string | null;
  postal_code?: string | null;
  country?: string | null;
  gst_number?: string | null;
};
