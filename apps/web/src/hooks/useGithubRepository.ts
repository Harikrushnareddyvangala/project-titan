"use client";

import { useEffect, useState } from "react";

import type {
  GithubLanguages,
  GithubRepository,
  GithubCommitWeek,
} from "@/types/github";

interface GithubRepositoryResult {
  repository: GithubRepository | null;
  languages: GithubLanguages;
  commitActivity: GithubCommitWeek[];
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

        const data = await response.json();
        console.log("========== API RESPONSE ==========");
console.log(data);
console.log("repository =", data.repository);
console.log("languages =", data.languages);
console.log("==================================");

        if (!response.ok) {
          throw new Error(
            data.message ??
              data.error ??
              "Unable to load repository",
          );
        }

        if (cancelled) return;

        setRepository(data.repository);

        setLanguages(data.languages ?? {});
        setCommitActivity(
  data.commitActivity ?? [],
);
        console.log("Calling setRepository...");
console.log(data.repository);
      } catch (err) {
        if (cancelled) return;

        setRepository(null);

        setLanguages({});

        setCommitActivity([]);

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
    languages,
    commitActivity,
    loading,
    error,
  };
}