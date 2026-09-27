"use client";

import { useMemo } from "react";

import { useAuth } from "@/components/providers/AuthProvider";
import { createAuthenticatedFetcher } from "@/lib/auth/authenticated-fetch";

export function useAuthenticatedFetch(): typeof fetch {
  const { session } = useAuth();

  return useMemo(
    () => createAuthenticatedFetcher(session),
    [session],
  );
}
