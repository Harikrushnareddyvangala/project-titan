"use client";

import { useEffect, useState } from "react";

import type {
  GithubLanguages,
  GithubRepository,
  GithubCommitWeek,
  GithubContributor,
} from "@/types/github";
import type {
  GithubRepositoryResponse,
  GithubApiResponse,
  RepositoryAnalytics,
} from "@/types/github";

interface GithubRepositoryResult {
  repository: GithubRepository | null;
  analytics: RepositoryAnalytics | null;
  languages: GithubLanguages;
  commitActivity: GithubCommitWeek[];
  contributors: GithubContributor[];
  loading: boolean;
  error: string | null;
}

export function useGithubRepository(
  repo: string,
): GithubRepositoryResult {
  const [repository, setRepository] =
    useState<GithubRepository | null>(null);

  const [languages, setLanguages] =
    useState<GithubLanguages>({});
  
  const [
  commitActivity,
  setCommitActivity,
] = useState<GithubCommitWeek[]>([]);

  const [contributors, setContributors] = useState<GithubContributor[]>([]);
  const [analytics, setAnalytics] =
  useState<RepositoryAnalytics | null>(null);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  useEffect(() => {
    if (!repo) return;

    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          `/api/github/${repo}`,
        );

        const data: GithubApiResponse =
  await response.json();

if ("message" in data) {
  throw new Error(data.message);
}

console.log("========== API RESPONSE ==========");
console.log(data);
console.log("repository =", data.repository);
console.log("analytics =", data.analytics);
console.log("languages =", data.languages);
console.log("==================================");

        if (cancelled) return;

        setRepository(data.repository);

        setLanguages(data.languages ?? {});
        setCommitActivity(
  data.commitActivity ?? [],);
 setContributors(data.contributors ?? [],
);
setAnalytics(
  data.analytics,
);
        console.log("Calling setRepository...");
console.log(data.repository);
      } catch (err) {
        if (cancelled) return;

        setRepository(null);

        setLanguages({});

        setCommitActivity([]);

        setContributors([]);
        setAnalytics(null);
        setError(
          err instanceof Error
            ? err.message
            : "Unknown error",
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
  }, [repo]);

  return {
  repository,
  analytics,
  languages,
  commitActivity,
  contributors,
  loading,
  error,
};
}