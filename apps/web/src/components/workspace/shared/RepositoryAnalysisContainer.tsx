"use client";

import {
  ReactNode,
  useState,
} from "react";

import { DEFAULT_REPOSITORY } from "@/lib/constants/github";

import {
  saveLastRepository,
  saveRecentRepository,
} from "@/lib/github/storage";

import { isValidRepositoryName } from "@/lib/github/validation";

import { useLastRepository } from "@/hooks/useLastRepository";
import { useRecentRepositories } from "@/hooks/useRecentRepositories";
import { useWorkspaceRepository } from "@/hooks/useWorkspaceRepository";

import { RecentRepositoriesCard } from "@/components/workspace/repository/RecentRepositoriesCard";

import { RepositoryWorkspaceHeader } from "@/components/workspace/repository/RepositoryWorkspaceHeader";

import { RepositoryWorkspaceLayout } from "@/components/workspace/repository/RepositoryWorkspaceLayout";

interface RepositoryAnalysisContainerProps {
  children: (
    github: ReturnType<
      typeof useWorkspaceRepository
    >,
  ) => ReactNode;
}

export function RepositoryAnalysisContainer({
  children,
}: RepositoryAnalysisContainerProps) {
  /*
   * Hydration-safe persisted repository.
   *
   * Server snapshot:
   * DEFAULT_REPOSITORY
   *
   * Browser snapshot:
   * saved repository, if available.
   */
  const persistedRepository =
    useLastRepository();

  const recentRepositories =
    useRecentRepositories();

  /*
   * null means the user has not manually
   * selected/edited a repository during
   * this session.
   */
  const [selectedRepository, setSelectedRepository] =
    useState<string | null>(null);

  /*
   * null means the user has not manually
   * edited the repository input.
   */
  const [draftRepository, setDraftRepository] =
    useState<string | null>(null);

  /*
   * Persisted repository is used automatically
   * until the user explicitly selects another one.
   */
  const activeRepoName =
    selectedRepository ??
    persistedRepository ??
    DEFAULT_REPOSITORY;

  /*
   * The input displays the persisted repository
   * after hydration, while remaining editable.
   */
  const draftRepoName =
    draftRepository ??
    persistedRepository ??
    DEFAULT_REPOSITORY;

  const github =
    useWorkspaceRepository(
      activeRepoName,
    );

  const handleRepoNameChange = (
    value: string,
  ) => {
    setDraftRepository(value);
  };

  const handleSubmit = () => {
    const normalized =
      draftRepoName.trim();

    if (!normalized) {
      return;
    }

    if (!isValidRepositoryName(normalized)) {
      return;
    }

    setSelectedRepository(
      normalized,
    );

    setDraftRepository(
      normalized,
    );

    saveLastRepository(
      normalized,
    );

    saveRecentRepository(
      normalized,
    );
  };

  const handleSelectRepository = (
    repository: string,
  ) => {
    const normalized =
      repository.trim();

    if (!normalized) {
      return;
    }

    if (!isValidRepositoryName(normalized)) {
      return;
    }

    setSelectedRepository(
      normalized,
    );

    setDraftRepository(
      normalized,
    );

    saveLastRepository(
      normalized,
    );

    saveRecentRepository(
      normalized,
    );
  };

  return (
    <RepositoryWorkspaceLayout>
      <RepositoryWorkspaceHeader
        repoName={draftRepoName}
        onRepoNameChange={
          handleRepoNameChange
        }
        onSubmit={handleSubmit}
      />

      {recentRepositories.length > 0 ? (
        <RecentRepositoriesCard
          repositories={
            recentRepositories
          }
          onSelect={
            handleSelectRepository
          }
        />
      ) : null}

      <div className="mt-10">
        {children(github)}
      </div>
    </RepositoryWorkspaceLayout>
  );
}