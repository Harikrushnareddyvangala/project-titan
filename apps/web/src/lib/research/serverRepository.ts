import "server-only";

import {
  getResearchEvidenceAssessmentRecords,
  getResearchEvidenceRecords,
  getResearchExperimentRecords,
  getResearchFindingRecords,
  getResearchFindingValidationRecords,
  getResearchInvestigationConclusionRecords,
  getResearchInvestigationRecords,
  getResearchProvenanceEventRecords,
} from "@titan/database";

import type {
  ResearchEvidence,
  ResearchEvidenceAssessment,
  ResearchExperiment,
  ResearchFinding,
  ResearchFindingValidation,
  ResearchInvestigation,
  ResearchInvestigationConclusion,
  ResearchProvenanceEvent,
} from "@/types/research";

function toOptionalString(value: string | null): string | undefined {
  return value ?? undefined;
}

function toIsoString(value: Date): string {
  return value.toISOString();
}

function mapResearchInvestigation(
  record: Awaited<ReturnType<typeof getResearchInvestigationRecords>>[number],
): ResearchInvestigation {
  return {
    id: record.id,
    title: record.title,
    objective: record.objective,
    question: record.question,
    status: record.status as ResearchInvestigation["status"],
    description: toOptionalString(record.description),
    repository: toOptionalString(record.repository),
    experimentIds: record.experimentIds,
    evidenceIds: record.evidenceIds,
    findingIds: record.findingIds,
    artifactIds: record.artifactIds,
    conclusionIds: record.conclusionIds,
    createdAt: toIsoString(record.createdAt),
    updatedAt: toIsoString(record.updatedAt),
  };
}

function mapResearchExperiment(
  record: Awaited<ReturnType<typeof getResearchExperimentRecords>>[number],
): ResearchExperiment {
  return {
    id: record.id,
    investigationId: record.investigationId,
    title: record.title,
    objective: record.objective,
    status: record.status as ResearchExperiment["status"],
    description: toOptionalString(record.description),
    evidenceIds: record.evidenceIds,
    findingIds: record.findingIds,
    lifecycle: record.lifecycle.map((event) => ({
      id: event.id,
      from: event.from as ResearchExperiment["status"],
      to: event.to as ResearchExperiment["status"],
      reason: toOptionalString(event.reason),
      timestamp: toIsoString(event.timestamp),
    })),
    createdAt: toIsoString(record.createdAt),
    updatedAt: toIsoString(record.updatedAt),
  };
}

function mapResearchEvidence(
  record: Awaited<ReturnType<typeof getResearchEvidenceRecords>>[number],
): ResearchEvidence {
  return {
    id: record.id,
    type: record.type as ResearchEvidence["type"],
    title: record.title,
    description: toOptionalString(record.description),
    reference: toOptionalString(record.reference),
    createdAt: toIsoString(record.createdAt),
  };
}

function mapResearchEvidenceAssessment(
  record: Awaited<
    ReturnType<typeof getResearchEvidenceAssessmentRecords>
  >[number],
): ResearchEvidenceAssessment {
  return {
    id: record.id,
    evidenceId: record.evidenceId,
    type: record.type as ResearchEvidenceAssessment["type"],
    relevance: record.relevance,
    supportStrength: record.supportStrength,
    reliability: record.reliability,
    independence: record.independence,
    rationale: toOptionalString(record.rationale),
    assessedAt: toIsoString(record.assessedAt),
    updatedAt: toIsoString(record.updatedAt),
  };
}

function mapResearchFinding(
  record: Awaited<ReturnType<typeof getResearchFindingRecords>>[number],
  assessmentsByFindingId: ReadonlyMap<string, ResearchEvidenceAssessment[]>,
): ResearchFinding {
  return {
    id: record.id,
    statement: record.statement,
    evidenceAssessments: assessmentsByFindingId.get(record.id) ?? [],
    confidence: record.confidence ?? undefined,
    validationIds: record.validationIds,
    createdAt: toIsoString(record.createdAt),
    updatedAt: toIsoString(record.updatedAt),
  };
}

function mapResearchFindingValidation(
  record: Awaited<
    ReturnType<typeof getResearchFindingValidationRecords>
  >[number],
  assessmentCountByFindingId: ReadonlyMap<string, number>,
): ResearchFindingValidation {
  return {
    id: record.id,
    findingId: record.findingId,
    status: record.status as ResearchFindingValidation["status"],
    decision: record.decision
      ? (record.decision as ResearchFindingValidation["decision"])
      : undefined,
    rationale: toOptionalString(record.rationale),
    validator: toOptionalString(record.validator),
    confidenceAtValidation: record.confidenceAtValidation ?? undefined,
    evidenceAssessmentCount:
      assessmentCountByFindingId.get(record.findingId) ?? 0,
    supportingEvidenceCount: record.supportingEvidenceCount,
    contradictingEvidenceCount: record.contradictingEvidenceCount,
    createdAt: toIsoString(record.createdAt),
    updatedAt: toIsoString(record.updatedAt),
    validatedAt: record.validatedAt
      ? toIsoString(record.validatedAt)
      : undefined,
  };
}

function mapResearchConclusion(
  record: Awaited<
    ReturnType<typeof getResearchInvestigationConclusionRecords>
  >[number],
): ResearchInvestigationConclusion {
  return {
    id: record.id,
    investigationId: record.investigationId,
    statement: record.statement,
    status: record.status as ResearchInvestigationConclusion["status"],
    supportingFindingIds: record.supportingFindingIds,
    contradictingFindingIds: record.contradictingFindingIds,
    uncertainty: toOptionalString(record.uncertainty),
    nextAction: toOptionalString(record.nextAction),
    createdAt: toIsoString(record.createdAt),
    updatedAt: toIsoString(record.updatedAt),
  };
}

function mapResearchProvenanceEvent(
  record: Awaited<
    ReturnType<typeof getResearchProvenanceEventRecords>
  >[number],
): ResearchProvenanceEvent {
  return {
    id: record.id,
    investigationId: record.investigationId,
    entityType: record.entityType as ResearchProvenanceEvent["entityType"],
    entityId: record.entityId,
    eventType: record.eventType as ResearchProvenanceEvent["eventType"],
    fromStatus: toOptionalString(record.fromStatus),
    toStatus: toOptionalString(record.toStatus),
    reason: toOptionalString(record.reason),
    actor: toOptionalString(record.actor),
    timestamp: toIsoString(record.timestamp),
    metadata: record.metadata ?? undefined,
  };
}

export async function getResearchInvestigations(): Promise<
  ResearchInvestigation[]
> {
  const records = await getResearchInvestigationRecords();

  return records.map(mapResearchInvestigation);
}

export async function getResearchExperiments(): Promise<ResearchExperiment[]> {
  const records = await getResearchExperimentRecords();

  return records.map(mapResearchExperiment);
}

export async function getResearchEvidence(): Promise<ResearchEvidence[]> {
  const records = await getResearchEvidenceRecords();

  return records.map(mapResearchEvidence);
}

export async function getResearchFindings(): Promise<ResearchFinding[]> {
  const [records, assessmentRecords] = await Promise.all([
    getResearchFindingRecords(),
    getResearchEvidenceAssessmentRecords(),
  ]);

  const assessmentsByFindingId = new Map<
    string,
    ResearchEvidenceAssessment[]
  >();

  for (const record of assessmentRecords) {
    const assessments =
      assessmentsByFindingId.get(record.findingId) ?? [];

    assessments.push(mapResearchEvidenceAssessment(record));
    assessmentsByFindingId.set(record.findingId, assessments);
  }

  return records.map((record) =>
    mapResearchFinding(record, assessmentsByFindingId),
  );
}

export async function getResearchFindingValidations(): Promise<
  ResearchFindingValidation[]
> {
  const [records, assessmentRecords] = await Promise.all([
    getResearchFindingValidationRecords(),
    getResearchEvidenceAssessmentRecords(),
  ]);

  const assessmentCountByFindingId = new Map<string, number>();

  for (const assessment of assessmentRecords) {
    assessmentCountByFindingId.set(
      assessment.findingId,
      (assessmentCountByFindingId.get(assessment.findingId) ?? 0) + 1,
    );
  }

  return records.map((record) =>
    mapResearchFindingValidation(
      record,
      assessmentCountByFindingId,
    ),
  );
}

export async function getResearchInvestigationConclusions(): Promise<
  ResearchInvestigationConclusion[]
> {
  const records = await getResearchInvestigationConclusionRecords();

  return records.map(mapResearchConclusion);
}

export async function getResearchProvenanceEvents(): Promise<
  ResearchProvenanceEvent[]
> {
  const records = await getResearchProvenanceEventRecords();

  return records.map(mapResearchProvenanceEvent);
}

export async function getResearchProvenanceEventsByInvestigation(
  investigationId: string,
): Promise<ResearchProvenanceEvent[]> {
  const events = await getResearchProvenanceEvents();

  return events.filter(
    (event) => event.investigationId === investigationId,
  );
}
