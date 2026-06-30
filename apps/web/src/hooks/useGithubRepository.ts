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

  default_branch: string;

  visibility: string;

  license: {
    name: string;
  } | null;

  topics: string[];
}

export function useGithubRepository(
  repo: string,
) {
  const [data, setData] =
    useState<Repository | null>(null);

  const [loading, setLoading] =
    useState(true);
const [error ] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const response = await fetch(
          `https://api.github.com/repos/Harikrushnareddyvangala/${repo}`,
          {
    headers: {
      Accept: "application/vnd.github+json",
    },
  },
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