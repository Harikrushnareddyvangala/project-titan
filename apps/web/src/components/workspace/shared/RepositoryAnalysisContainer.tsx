"use client";

import { ReactNode, useState } from "react";

import { useWorkspaceRepository } from "@/hooks/useWorkspaceRepository";
import { RepositoryWorkspaceHeader } from "@/components/workspace/repository/RepositoryWorkspaceHeader";
import { RepositoryWorkspaceLayout } from "@/components/workspace/repository/RepositoryWorkspaceLayout";

interface RepositoryAnalysisContainerProps {
  children: (
    github: ReturnType<typeof useWorkspaceRepository>
  ) => ReactNode;
}

export function RepositoryAnalysisContainer({
  children,
}: RepositoryAnalysisContainerProps) {
  const [draftRepoName, setDraftRepoName] =
    useState("vercel/next.js");

  const [activeRepoName, setActiveRepoName] =
    useState("vercel/next.js");

  const github =
    useWorkspaceRepository(activeRepoName);

  const handleSubmit = () => {
    const normalized = draftRepoName.trim();

    if (!normalized) return;

    setActiveRepoName(normalized);
  };

  return (
    <RepositoryWorkspaceLayout>

      <RepositoryWorkspaceHeader
        repoName={draftRepoName}
        onRepoNameChange={setDraftRepoName}
        onSubmit={handleSubmit}
      />

      <div className="mt-10">

        {children(github)}

      </div>

    </RepositoryWorkspaceLayout>
  );
}