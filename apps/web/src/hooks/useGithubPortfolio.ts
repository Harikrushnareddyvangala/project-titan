"use client";

import { useEffect, useState } from "react";

import type {
  RepositoryAnalytics,
  PortfolioAnalytics,
} from "@/types/github";

import { buildPortfolioAnalytics } from "@/lib/github/portfolioEngine";

interface PortfolioRepository {

  owner: string;

  repo: string;

}

interface GithubPortfolioResult {

  repositories: RepositoryAnalytics[];

  portfolio: PortfolioAnalytics | null;

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

        setPortfolio(

          buildPortfolioAnalytics(

            analytics,

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

    loading,

    error,

  };

}