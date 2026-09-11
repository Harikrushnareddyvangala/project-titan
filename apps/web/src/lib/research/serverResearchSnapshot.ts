import "server-only";

import {
  getResearchEvidence,
  getResearchExperiments,
  getResearchFindingValidations,
  getResearchFindings,
  getResearchInvestigations,
  getResearchInvestigationConclusions,
  getResearchProvenanceEvents,
} from "./serverRepository";

import { createResearchLineageService } from "./lineage/service";
import { validateResearchProvenanceIntegrity } from "./provenance/integrity";

export interface ServerResearchSnapshot {
  getResearchInvestigations: Awaited<ReturnType<typeof getResearchInvestigations>>;
  getResearchExperiments: Awaited<ReturnType<typeof getResearchExperiments>>;
  getResearchEvidence: Awaited<ReturnType<typeof getResearchEvidence>>;
  getResearchFindings: Awaited<ReturnType<typeof getResearchFindings>>;
  getResearchFindingValidations: Awaited<ReturnType<typeof getResearchFindingValidations>>;
  getResearchInvestigationConclusions: Awaited<
    ReturnType<typeof getResearchInvestigationConclusions>
  >;
  getResearchProvenanceEvents: Awaited<ReturnType<typeof getResearchProvenanceEvents>>;
}

export async function loadServerResearchSnapshot(): Promise<ServerResearchSnapshot> {
  const [
    investigations,
    experiments,
    evidence,
    findings,
    findingValidations,
    investigationConclusions,
    provenanceEvents,
  ] = await Promise.all([
    getResearchInvestigations(),
    getResearchExperiments(),
    getResearchEvidence(),
    getResearchFindings(),
    getResearchFindingValidations(),
    getResearchInvestigationConclusions(),
    getResearchProvenanceEvents(),
  ]);

  return {
    getResearchInvestigations: investigations,
    getResearchExperiments: experiments,
    getResearchEvidence: evidence,
    getResearchFindings: findings,
    getResearchFindingValidations: findingValidations,
    getResearchInvestigationConclusions: investigationConclusions,
    getResearchProvenanceEvents: provenanceEvents,
  };
}

export function createServerLineageService(snapshot: ServerResearchSnapshot) {
  return createResearchLineageService({
    getResearchInvestigations: () => snapshot.getResearchInvestigations,
    getResearchExperiments: () => snapshot.getResearchExperiments,
    getResearchEvidence: () => snapshot.getResearchEvidence,
    getResearchFindings: () => snapshot.getResearchFindings,
    getResearchFindingValidations: () => snapshot.getResearchFindingValidations,
    getResearchInvestigationConclusions: () =>
      snapshot.getResearchInvestigationConclusions,
    getResearchProvenanceEventsByInvestigation: (investigationId: string) =>
      snapshot.getResearchProvenanceEvents.filter(
        (event) => event.investigationId === investigationId,
      ),
    validateResearchProvenanceIntegrity: () =>
      validateResearchProvenanceIntegrity({
        getResearchProvenanceEvents: () => snapshot.getResearchProvenanceEvents,
        getResearchInvestigations: () => snapshot.getResearchInvestigations,
        getResearchExperiments: () => snapshot.getResearchExperiments,
        getResearchFindings: () => snapshot.getResearchFindings,
        getResearchFindingValidations: () =>
          snapshot.getResearchFindingValidations,
        getResearchInvestigationConclusions: () =>
          snapshot.getResearchInvestigationConclusions,
      }),
  });
}
