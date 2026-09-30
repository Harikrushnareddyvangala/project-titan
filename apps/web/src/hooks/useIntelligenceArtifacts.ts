"use client";

import { useCallback, useEffect, useState } from "react";

import type { IntelligenceArtifact } from "@/types/intelligence";

import { useAuthenticatedFetch } from "@/hooks/useAuthenticatedFetch";

interface IntelligenceArtifactsResponse {
  artifacts: IntelligenceArtifact[];
}

function isIntelligenceArtifactsResponse(
  value: unknown,
): value is IntelligenceArtifactsResponse {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as { artifacts?: unknown };

  return Array.isArray(candidate.artifacts);
}

export function useIntelligenceArtifacts() {
  const authenticatedFetch = useAuthenticatedFetch();

  const [artifacts, setArtifacts] = useState<IntelligenceArtifact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await authenticatedFetch(
        "/api/intelligence/artifacts",
      );

      const payload = (await response.json()) as unknown;

      if (!response.ok) {
        const message =
          payload &&
          typeof payload === "object" &&
          "error" in payload &&
          typeof payload.error === "string"
            ? payload.error
            : "Intelligence artifact retrieval failed.";

        throw new Error(message);
      }

      if (!isIntelligenceArtifactsResponse(payload)) {
        throw new Error("Invalid intelligence artifact response.");
      }

      setArtifacts(payload.artifacts);
    } catch (err) {
      setArtifacts([]);
      setError(
        err instanceof Error
          ? err.message
          : "Intelligence artifact retrieval failed.",
      );
    } finally {
      setLoading(false);
    }
  }, [authenticatedFetch]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return {
    artifacts,
    loading,
    error,
    refresh,
  };
}
