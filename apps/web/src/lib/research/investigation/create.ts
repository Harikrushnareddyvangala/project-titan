import type { ResearchInvestigation } from "@/types/research";

export interface CreateResearchInvestigationDependencies {
  createId(prefix: string): string;
  now(): string;
}

export type CreateResearchInvestigationInput = Pick<
  ResearchInvestigation,
  "title" | "objective" | "question"
> &
  Partial<
    Pick<ResearchInvestigation, "description" | "repository">
  >;

export function createResearchInvestigation(
  input: CreateResearchInvestigationInput,
  dependencies: CreateResearchInvestigationDependencies,
): ResearchInvestigation {
  const now = dependencies.now();

  return {
    id: dependencies.createId("investigation"),
    title: input.title,
    objective: input.objective,
    question: input.question,
    status: "Draft",
    description: input.description,
    repository: input.repository,
    experimentIds: [],
    evidenceIds: [],
    findingIds: [],
    artifactIds: [],
    conclusionIds: [],
    createdAt: now,
    updatedAt: now,
  };
}
