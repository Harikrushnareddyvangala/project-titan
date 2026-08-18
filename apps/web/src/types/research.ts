/* -------------------------------------------------------------------------- */
/*                         Research Status                                    */
/* -------------------------------------------------------------------------- */

export type ResearchStatus =
  | "Draft"
  | "Investigating"
  | "Evidence Collected"
  | "Finding Produced"
  | "Validated"
  | "Published";

/* -------------------------------------------------------------------------- */
/*                         Research Evidence                                  */
/* -------------------------------------------------------------------------- */

export type ResearchEvidenceType =
  | "Repository"
  | "Commit"
  | "File"
  | "Metric"
  | "Analysis"
  | "Experiment"
  | "Artifact"
  | "External Reference";

export interface ResearchEvidence {
  id: string;
  type: ResearchEvidenceType;
  title: string;
  description?: string;
  reference?: string;
  createdAt: string;
}

/* -------------------------------------------------------------------------- */
/*                    Evidence Assessment Classification                      */
/* -------------------------------------------------------------------------- */

/**
 * Describes how an evidence item relates to a finding.
 *
 * Supporting:
 *   Evidence provides positive support for the finding.
 *
 * Contradicting:
 *   Evidence provides meaningful evidence against the finding.
 *
 * Neutral:
 *   Evidence is relevant context but does not materially
 *   support or contradict the finding.
 */
export type ResearchEvidenceAssessmentType =
  | "Supporting"
  | "Contradicting"
  | "Neutral";

/* -------------------------------------------------------------------------- */
/*                         Evidence Assessment                                */
/* -------------------------------------------------------------------------- */

/**
 * Evaluates one evidence item specifically in relation
 * to one research finding.
 *
 * These values are assessments, not calibrated probabilities.
 */
export interface ResearchEvidenceAssessment {
  id: string;

  evidenceId: string;

  type: ResearchEvidenceAssessmentType;

  /**
   * How relevant the evidence is to the finding.
   * Range: 0–1.
   */
  relevance: number;

  /**
   * How strongly the evidence supports or contradicts
   * the finding.
   * Range: 0–1.
   */
  supportStrength: number;

  /**
   * Assessment of the reliability of the evidence.
   * Range: 0–1.
   */
  reliability: number;

  /**
   * Assessment of how independently this evidence
   * contributes relative to other evidence.
   * Range: 0–1.
   */
  independence: number;

  /**
   * Optional human-readable rationale explaining
   * the assessment.
   */
  rationale?: string;

  assessedAt: string;
  updatedAt: string;
}

/* -------------------------------------------------------------------------- */
/*                         Research Finding                                   */
/* -------------------------------------------------------------------------- */

export interface ResearchFinding {
  id: string;

  statement: string;

  /**
   * Evidence relationships are represented through
   * explicit assessments.
   */
  evidenceAssessments: ResearchEvidenceAssessment[];

  /**
   * Overall finding confidence.
   *
   * This is a finding-level assessment and must not
   * be interpreted as a mathematically calibrated
   * probability unless a future calibration system
   * explicitly establishes that property.
   *
   * Range: 0–1.
   */
  confidence?: number;

  validationIds: string[];

  createdAt: string;
  updatedAt: string;
}

/* -------------------------------------------------------------------------- */
/*                    Research Finding Validation                             */
/* -------------------------------------------------------------------------- */

export type ResearchValidationStatus =
  | "Pending"
  | "In Review"
  | "Validated"
  | "Rejected"
  | "Needs Revision";

export type ResearchValidationDecision =
  | "Accept"
  | "Reject"
  | "Revise";

export interface ResearchFindingValidation {
  id: string;

  findingId: string;

  status: ResearchValidationStatus;

  decision?: ResearchValidationDecision;

  /**
   * Validation rationale explains why the finding
   * was accepted, rejected, or returned for revision.
   */
  rationale?: string;

  /**
   * Optional validator identity.
   *
   * This can later represent a human reviewer,
   * automated validation engine, or other trusted
   * validation authority.
   */
  validator?: string;

  /**
   * Snapshot of the finding confidence at the time
   * validation was performed.
   *
   * This preserves historical context even if the
   * finding's confidence is recalculated later.
   */
  confidenceAtValidation?: number;

  /**
   * Number of evidence assessments considered
   * during validation.
   */
  evidenceAssessmentCount: number;

  /**
   * Number of supporting evidence assessments
   * considered during validation.
   */
  supportingEvidenceCount: number;

  /**
   * Number of contradicting evidence assessments
   * considered during validation.
   */
  contradictingEvidenceCount: number;

  createdAt: string;

  updatedAt: string;

  validatedAt?: string;
}

/* -------------------------------------------------------------------------- */
/*                Research Finding Validation History                        */
/* -------------------------------------------------------------------------- */

export interface ResearchFindingValidationHistoryEvent {
  id: string;

  validationId: string;

  from: ResearchValidationStatus;

  to: ResearchValidationStatus;

  decision?: ResearchValidationDecision;

  reason?: string;

  timestamp: string;
}

/* -------------------------------------------------------------------------- */
/*                 Research Validation Decision                              */
/* -------------------------------------------------------------------------- */

export interface ResearchValidationDecisionResult {
  success: boolean;

  finding: ResearchFinding | null;

  validation: ResearchFindingValidation | null;

  reasons: string[];
}
/* -------------------------------------------------------------------------- */
/*                    Research Experiment Lifecycle                           */
/* -------------------------------------------------------------------------- */

export interface ResearchExperimentLifecycleEvent {
  id: string;

  from: ResearchStatus;

  to: ResearchStatus;

  reason?: string;

  timestamp: string;
}
/* -------------------------------------------------------------------------- */
/*                         Research Experiment                                */
/* -------------------------------------------------------------------------- */

export interface ResearchExperiment {
  id: string;
  investigationId: string;
  title: string;
  objective: string;
  status: ResearchStatus;
  description?: string;

  evidenceIds: string[];
  findingIds: string[];

  lifecycle: ResearchExperimentLifecycleEvent[];

  createdAt: string;
  updatedAt: string;
}

/* -------------------------------------------------------------------------- */
/*                    Research Investigation Conclusion                       */
/* -------------------------------------------------------------------------- */

export type ResearchConclusionStatus =
  | "Draft"
  | "Proposed"
  | "Accepted"
  | "Superseded";

export interface ResearchInvestigationConclusion {
  id: string;

  investigationId: string;

  statement: string;

  status: ResearchConclusionStatus;

  /**
   * Findings that directly support this conclusion.
   */
  supportingFindingIds: string[];

  /**
   * Findings that contradict or materially qualify
   * this conclusion.
   */
  contradictingFindingIds: string[];

  /**
   * Human-readable description of remaining uncertainty,
   * limitations, or unresolved questions.
   */
  uncertainty?: string;

  /**
   * Recommended next research or engineering action.
   */
  nextAction?: string;

  createdAt: string;

  updatedAt: string;
}
/* -------------------------------------------------------------------------- */
/*                         Research Investigation                             */
/* -------------------------------------------------------------------------- */

export interface ResearchInvestigation {
  id: string;
  title: string;
  objective: string;
  question: string;
  status: ResearchStatus;
  description?: string;
  repository?: string;
  experimentIds: string[];
  evidenceIds: string[];
  findingIds: string[];
  artifactIds: string[];
  conclusionIds: string[];
  createdAt: string;
  updatedAt: string;
}

export type ResearchProvenanceEntityType =
  | "Investigation"
  | "Experiment"
  | "Evidence"
  | "EvidenceAssessment"
  | "Finding"
  | "FindingValidation"
  | "Conclusion";

export type ResearchProvenanceEventType =
  | "Created"
  | "Updated"
  | "StatusChanged"
  | "Linked"
  | "Unlinked"
  | "Validated"
  | "Rejected"
  | "RevisionRequested"
  | "Accepted"
  | "Superseded";

export interface ResearchProvenanceIntegrityIssue {
  eventId: string;
  investigationId: string;
  entityType: ResearchProvenanceEntityType;
  entityId: string;
  code: string;
  message: string;
}

export interface ResearchProvenanceIntegrityResult {
  valid: boolean;
  checkedEventCount: number;
  issues: ResearchProvenanceIntegrityIssue[];
}

export interface ResearchProvenanceIntegritySummary {
  valid: boolean;
  checkedEventCount: number;
  issueCount: number;
  issueCodes: string[];
}

export interface ResearchProvenanceEvent {
  id: string;

  investigationId: string;

  entityType: ResearchProvenanceEntityType;

  entityId: string;

  eventType: ResearchProvenanceEventType;

  fromStatus?: string;

  toStatus?: string;

  reason?: string;

  actor?: string;

  timestamp: string;

  metadata?: Record<string, unknown>;
}

export interface ResearchProvenanceTimelineItem {
  eventId: string;

  investigationId: string;

  entityType: ResearchProvenanceEntityType;

  entityId: string;

  eventType: ResearchProvenanceEventType;

  findingId?: string;

  findingStatement?: string;

  validationId?: string;

  validator?: string;

  decision?: ResearchValidationDecision;

  title: string;

  description: string;

  fromStatus?: string;

  toStatus?: string;

  reason?: string;

  actor?: string;

  timestamp: string;

  metadata?: Record<string, unknown>;
}

export interface ResearchProvenanceInvestigationSummary {
  investigationId: string;

  eventCount: number;

  firstEventTimestamp?: string;

  latestEventTimestamp?: string;

  latestEventType?: ResearchProvenanceEventType;

  latestEntityType?: ResearchProvenanceEntityType;

  latestEntityId?: string;

  validationEventCount: number;

  statusChangeEventCount: number;

  valid: boolean;
}
export type ResearchLineageNodeType =
  | "Investigation"
  | "Experiment"
  | "Evidence"
  | "Finding"
  | "FindingValidation"
  | "Conclusion";

export type ResearchLineageEdgeType =
  | "Contains"
  | "Produces"
  | "Supports"
  | "Contradicts"
  | "Validates";

export interface ResearchLineageNode {
  id: string;

  type: ResearchLineageNodeType;

  title: string;

  description?: string;

  status?: string;

  investigationId: string;

  provenanceEventCount: number;

  valid: boolean;

  issueCount: number;

  missingLinks: string[];
}

export interface ResearchLineageEdge {
  id: string;

  sourceId: string;

  targetId: string;

  type: ResearchLineageEdgeType;

  label: string;
}

export interface ResearchLineage {
  investigationId: string;

  nodes: ResearchLineageNode[];

  edges: ResearchLineageEdge[];

  valid: boolean;

  issueCount: number;
}

export type ResearchLineageIntegrityCategory =
  | "Investigation"
  | "Node"
  | "Edge"
  | "Scope"
  | "Reference"
  | "Provenance";

export type ResearchLineageIntegrityPriority =
  | "Critical"
  | "High"
  | "Medium"
  | "Low";

export interface ResearchLineageIntegrityPrioritySummary {
  critical: number;
  high: number;
  medium: number;
  low: number;
  highestPriority: ResearchLineageIntegrityPriority | null;
}

export type ResearchLineageIntegrityAssessment =
  | "Healthy"
  | "Attention"
  | "Degraded"
  | "Critical";
export interface ResearchLineageIntegrityIssue {
  investigationId: string;

  code: string;

  message: string;

  nodeId?: string;

  edgeId?: string;

  sourceId?: string;

  targetId?: string;
}

export interface ResearchLineageIntegrityResult {
  investigationId: string;

  valid: boolean;

  checkedNodeCount: number;

  checkedEdgeCount: number;

  issueCount: number;

  issues: ResearchLineageIntegrityIssue[];
}
