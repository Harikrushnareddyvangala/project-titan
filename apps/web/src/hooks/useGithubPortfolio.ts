"use client";

import { useEffect, useState } from "react";

import type {
  RepositoryAnalytics,
  PortfolioAnalytics,
} from "@/types/github";

import { buildPortfolioAnalytics } from "@/lib/github/portfolioEngine";
import { buildExecutiveSummary, } from "@/lib/github/executiveSummaryEngine";
import type { ExecutiveSummary, } from "@/types/github";

interface PortfolioRepository {

  owner: string;

  repo: string;

}

interface GithubPortfolioResult {

  repositories: RepositoryAnalytics[];

  portfolio: PortfolioAnalytics | null;

  executiveSummary: ExecutiveSummary | null;

  loading: boolean;

  error: string | null;

}

export function useGithubPortfolio(

  repositoryList: PortfolioRepository[],

): GithubPortfolioResult {

  const [

    repositories,

    setRepositories,

  ] = useState<RepositoryAnalytics[]>([]);

  const [

    portfolio,

    setPortfolio,

  ] = useState<PortfolioAnalytics | null>(null);
  const [
executiveSummary,
setExecutiveSummary,
] = useState<ExecutiveSummary | null>(
  null,
);

  const [

    loading,

    setLoading,

  ] = useState(false);

  const [

    error,

    setError,

  ] = useState<string | null>(null);

  useEffect(() => {

    let cancelled = false;

    async function loadPortfolio() {

      try {

        setLoading(true);

        setError(null);

        const analytics: RepositoryAnalytics[] = [];

        for (const repository of repositoryList) {

          const response = await fetch(

            `/api/github/${repository.owner}/${repository.repo}`,

          );

          if (!response.ok) {

            continue;

          }

          const data = await response.json();

          analytics.push(

            data.analytics,

          );

        }

        if (cancelled) return;

        setRepositories(

          analytics,

        );

        const portfolioAnalytics =
  buildPortfolioAnalytics(
    analytics,
  );

setPortfolio(
  portfolioAnalytics,
);

setExecutiveSummary(
  buildExecutiveSummary(
    portfolioAnalytics,
  ),
);
      }

      catch (err) {

        if (cancelled) return;

        setError(

          err instanceof Error

            ? err.message

            : "Portfolio failed",

        );

      }

      finally {

        if (!cancelled)

          setLoading(false);

      }

    }

    if (

      repositoryList.length > 0

    ) {

      loadPortfolio();

    }

    return () => {

      cancelled = true;

    };

  }, [repositoryList]);

  return {

    repositories,

    portfolio,

    executiveSummary,

    loading,

    error,

  };

}