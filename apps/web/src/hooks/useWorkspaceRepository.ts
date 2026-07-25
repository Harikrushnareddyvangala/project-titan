import { useGithubRepository } from "@/hooks/useGithubRepository";

export function useWorkspaceRepository(repoName: string) {
  return useGithubRepository(repoName);
}