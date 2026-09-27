"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import type { BrowserAuthSession } from "@/lib/auth/session";
import {
  clearBrowserAuthSession,
  createInitialAuthState,
  setBrowserAuthSession,
  type BrowserAuthState,
} from "@/lib/auth/auth-state";

interface AuthContextValue {
  session: BrowserAuthSession | null;
  isAuthenticated: boolean;
  setSession: (session: BrowserAuthSession) => void;
  clearSession: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, setState] = useState<BrowserAuthState>(
    createInitialAuthState,
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      session: state.session,
      isAuthenticated: state.session !== null,

      setSession: (session) => {
        setState((current) =>
          setBrowserAuthSession(current, session),
        );
      },

      clearSession: () => {
        setState((current) =>
          clearBrowserAuthSession(current),
        );
      },
    }),
    [state],
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider.");
  }

  return context;
}
