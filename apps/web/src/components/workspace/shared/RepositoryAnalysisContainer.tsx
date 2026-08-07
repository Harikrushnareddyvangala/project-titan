"use client";

import {
  ReactNode,
  useState,
} from "react";

import { DEFAULT_REPOSITORY } from "@/lib/constants/github";
import {
  getLastRepository,
  getRecentRepositories,
  saveLastRepository,
  saveRecentRepository,
} from "@/lib/github/storage";
import { isValidRepositoryName } from "@/lib/github/validation";
import { useWorkspaceRepository } from "@/hooks/useWorkspaceRepository";
import { RecentRepositoriesCard } from "@/components/workspace/repository/RecentRepositoriesCard";
import { RepositoryWorkspaceHeader } from "@/components/workspace/repository/RepositoryWorkspaceHeader";
import { RepositoryWorkspaceLayout } from "@/components/workspace/repository/RepositoryWorkspaceLayout";

interface RepositoryAnalysisContainerProps {
  children: (
    github: ReturnType<typeof useWorkspaceRepository>,
  ) => ReactNode;
}

export function RepositoryAnalysisContainer({
  children,
}: RepositoryAnalysisContainerProps) {

  const getInitialRepository = ():string =>
  getLastRepository() ?? DEFAULT_REPOSITORY;

  const [draftRepoName, setDraftRepoName] =
    useState(getInitialRepository);

  const [activeRepoName, setActiveRepoName] =
    useState(getInitialRepository);

  const [recentRepositories, setRecentRepositories] = useState(
  getRecentRepositories,
);

  const github =
    useWorkspaceRepository(activeRepoName);

  const activateRepository = (
    repository: string,
  ) => {
    setDraftRepoName(repository);
    setActiveRepoName(repository);

    saveLastRepository(repository);
    saveRecentRepository(repository);

    setRecentRepositories(
      getRecentRepositories(),
    );
  };

  const handleSubmit = () => {
    const normalized = draftRepoName.trim();

    if (!normalized) {
      return;
    }

    if (!isValidRepositoryName(normalized)) {
      return;
    }
    activateRepository(normalized);
  };

  return (
    <RepositoryWorkspaceLayout>
      <RepositoryWorkspaceHeader
        repoName={draftRepoName}
        onRepoNameChange={setDraftRepoName}
        onSubmit={handleSubmit}
      />

      <RecentRepositoriesCard 
      repositories={recentRepositories}
      onSelect={(repository) => {
        setDraftRepoName(repository);
        setActiveRepoName(repository);

        saveLastRepository(repository);
        saveRecentRepository(repository);

        setRecentRepositories(getRecentRepositories(),);
    }}
/>

      <div className="mt-10">
        {children(github)}
      </div>
    </RepositoryWorkspaceLayout>
  );
}