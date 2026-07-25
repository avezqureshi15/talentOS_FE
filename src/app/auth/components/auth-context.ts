import { createContext } from "react";

export type User = {
  id: number;
  email: string;
  name: string;
  picture?: string;
  role: "superadmin" | "admin" | "hr" | "viewer";
  tenant_id: number | null;
  auth_provider: "google" | "email";
  is_active: boolean;
  permissions?: string[];
};

export type AuthContextValue = {
  user: User | null;
  isLoading: boolean;
  login: (credential: string) => Promise<void>;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, fullName: string, orgName: string) => Promise<void>;
  logout: () => Promise<void>;
  getAccessToken: () => string | null;
};

export const AuthContext = createContext<AuthContextValue | null>(null);
