"use client";

import { useEffect, useState } from "react";

import type {
  GithubLanguages,
  GithubRepository,
} from "@/types/github";

interface GithubRepositoryResult {
  repository: GithubRepository | null;

  languages: GithubLanguages;

  loading: boolean;

  error: string | null;
}

export function useGithubRepository(
  repo: string,
): GithubRepositoryResult {
  const [
    repository,
    setRepository,
  ] =
    useState<GithubRepository | null>(
      null,
    );

  const [
    languages,
    setLanguages,
  ] =
    useState<GithubLanguages>({});

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] =
    useState<string | null>(null);

  useEffect(() => {
    if (!repo) return;

    async function fetchRepository() {
      try {
        setLoading(true);

        setError(null);

        const baseUrl =
          `https://api.github.com/repos/${repo}`;

        const [
          repositoryResponse,
          languagesResponse,
        ] = await Promise.all([
          fetch(baseUrl),

          fetch(
            `${baseUrl}/languages`,
          ),
        ]);

        if (!repositoryResponse.ok) {
          throw new Error(
            "Unable to fetch repository.",
          );
        }

        const repositoryData =
          (await repositoryResponse.json()) as GithubRepository;

        const languagesData =
          (await languagesResponse.json()) as GithubLanguages;

        setRepository(
          repositoryData,
        );

        setLanguages(
          languagesData,
        );
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unknown error",
        );
      } finally {
        setLoading(false);
      }
    }

    fetchRepository();
  }, [repo]);

  return {
    repository,

    languages,

    loading,

    error,
  };
}