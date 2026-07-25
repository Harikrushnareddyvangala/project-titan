"use client";

import { useState } from "react";

import { GithubAnalyticsSection } from "@/components/sections/Projects/ProjectModal/GithubAnalyticsSection";
import { useWorkspaceRepository } from "@/hooks/useWorkspaceRepository";

import { RepositoryWorkspaceHeader } from "./RepositoryWorkspaceHeader";
import { RepositoryWorkspaceLayout } from "./RepositoryWorkspaceLayout";

export function RepositoryWorkspace() {
  const [draftRepoName, setDraftRepoName] = useState("vercel/next.js");
  const [activeRepoName, setActiveRepoName] = useState("vercel/next.js");

  const github = useWorkspaceRepository(activeRepoName);

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
        <GithubAnalyticsSection {...github} />
      </div>
    </RepositoryWorkspaceLayout>
  );
}