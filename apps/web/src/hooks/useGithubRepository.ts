"use client";

import { useEffect, useState } from "react";

interface Repository {
  stargazers_count: number;
  forks_count: number;
  watchers_count: number;
  open_issues_count: number;
  language: string;
  size: number;
  updated_at: string;
}

export function useGithubRepository(
  repo: string,
) {
  const [data, setData] =
    useState<Repository | null>(null);

  const [loading, setLoading] =
    useState(true);
const [error, setError] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const response = await fetch(
          `https://api.github.com/repos/Harikrushnareddyvangala/${repo}`,
        );

        const json =
          await response.json();

        setData(json);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [repo]);

  return {
    data,
    loading,
    error,
  };
}