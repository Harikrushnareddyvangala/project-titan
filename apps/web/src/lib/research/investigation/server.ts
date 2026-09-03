import "server-only";

import {
  createResearchInvestigation as createResearchInvestigationDomain,
} from "./create";
import {
  createResearchInvestigation as persistResearchInvestigation,
  getResearchInvestigation,
} from "./serverRepository";
import type { ResearchInvestigation } from "@/types/research";

export type CreateResearchInvestigationInput = Pick<
  ResearchInvestigation,
  "title" | "objective" | "question"
> &
  Partial<
    Pick<ResearchInvestigation, "description" | "repository">
  >;

function createId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function now(): string {
  return new Date().toISOString();
}

export async function createResearchInvestigation(
  input: CreateResearchInvestigationInput,
): Promise<ResearchInvestigation> {
  const investigation = createResearchInvestigationDomain(input, {
    createId,
    now,
  });

  return persistResearchInvestigation(investigation);
}

export { getResearchInvestigation };
