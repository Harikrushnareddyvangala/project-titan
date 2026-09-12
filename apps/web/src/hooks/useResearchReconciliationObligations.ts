"use client";

import { useCallback, useEffect, useState } from "react";

import type { ResearchReconciliationObligation } from "@/types/research";

interface ResearchReconciliationObligationsResult {
  obligations: ResearchReconciliationObligation[];
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

export function useResearchReconciliationObligations(
  investigationId: string,
): ResearchReconciliationObligationsResult {
  const [obligations, setObligations] = useState<
    ResearchReconciliationObligation[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const refresh = useCallback(() => {
    setRefreshKey((current) => current + 1);
  }, []);

  useEffect(() => {
    const cleanInvestigationId = investigationId.trim();

    if (!cleanInvestigationId) {
      setObligations([]);
      setLoading(false);
      setError(null);
      return;
    }

    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          `/api/research/reconciliation/obligations?investigationId=${encodeURIComponent(
            cleanInvestigationId,
          )}`,
        );

        const data: unknown = await response.json();

        if (!response.ok) {
          const message =
            typeof data === "object" &&
            data !== null &&
            "error" in data &&
            typeof data.error === "string"
              ? data.error
              : "Reconciliation obligation retrieval failed.";

          throw new Error(message);
        }

        if (
          typeof data !== "object" ||
          data === null ||
          !("obligations" in data) ||
          !Array.isArray(data.obligations)
        ) {
          throw new Error("Invalid reconciliation obligation response.");
        }

        if (cancelled) {
          return;
        }

        setObligations(
          data.obligations as ResearchReconciliationObligation[],
        );
      } catch (err) {
        if (cancelled) {
          return;
        }

        setObligations([]);
        setError(
          err instanceof Error
            ? err.message
            : "Reconciliation obligation retrieval failed.",
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [investigationId, refreshKey]);

  return {
    obligations,
    loading,
    error,
    refresh,
  };
}
