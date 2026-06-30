import { createContext } from "react";

export type User = {
  id: number;
  email: string;
  name: string;
};

export type AuthContextValue = {
  user: User | null;
  isLoading: boolean;
  login: (credential: string) => Promise<void>;
  logout: () => Promise<void>;
  getAccessToken: () => string | null;
};

export const AuthContext = createContext<AuthContextValue | null>(null);
