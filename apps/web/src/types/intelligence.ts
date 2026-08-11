import type { RepositoryAnalytics } from "@/types/github";

/* -------------------------------------------------------------------------- */
/*                                Trend Types                                 */
/* -------------------------------------------------------------------------- */

export type TrendDirection =
  | "Rapid Growth"
  | "Growing"
  | "Stable"
  | "Declining"
  | "Critical";

/* -------------------------------------------------------------------------- */
/*                              Forecast Types                                */
/* -------------------------------------------------------------------------- */

export type ForecastDirection =
  | "Strong Growth"
  | "Growing"
  | "Stable"
  | "Declining"
  | "High Risk";

/* -------------------------------------------------------------------------- */
/*                                Risk Types                                  */
/* -------------------------------------------------------------------------- */

export type RiskLevel =
  | "Very Low"
  | "Low"
  | "Moderate"
  | "Elevated"
  | "High"
  | "Critical";

/* -------------------------------------------------------------------------- */
/*                               Grade Types                                  */
/* -------------------------------------------------------------------------- */

export type RepositoryGrade =
  | "A+"
  | "A"
  | "B+"
  | "B"
  | "C+"
  | "C"
  | "D"
  | "F";

/* -------------------------------------------------------------------------- */
/*                             Portfolio Status                               */
/* -------------------------------------------------------------------------- */

export type PortfolioHealth =
  | "Excellent"
  | "Healthy"
  | "Good"
  | "Needs Improvement"
  | "Critical";

/* -------------------------------------------------------------------------- */
/*                           Engineering Maturity                             */
/* -------------------------------------------------------------------------- */

export type EngineeringLevel =
  | "Elite"
  | "Advanced"
  | "Intermediate"
  | "Basic"
  | "Early";

/* -------------------------------------------------------------------------- */
/*                             Executive Status                               */
/* -------------------------------------------------------------------------- */

export type ExecutiveSeverity =
  | "Info"
  | "Success"
  | "Warning"
  | "Critical";

/* -------------------------------------------------------------------------- */
/*                           Evolution Types                                  */
/* -------------------------------------------------------------------------- */

export type EvolutionDirection =
  | "Rapidly Improving"
  | "Improving"
  | "Stable"
  | "Declining"
  | "Critical";

export type RepositoryLifecycle =
  | "Existing"
  | "New"
  | "Removed";

/* -------------------------------------------------------------------------- */
/*                         Intelligence Snapshot                              */
/* -------------------------------------------------------------------------- */

export interface IntelligenceSnapshot {
  id: string;
  repository: string;
  createdAt: string;
  analytics: RepositoryAnalytics;
}

/* -------------------------------------------------------------------------- */
/*                    Intelligence Artifact Classification                    */
/* -------------------------------------------------------------------------- */

/**
 * High-level classification of an intelligence artifact.
 *
 * Snapshots represent captured intelligence state.
 * Reports represent human-readable interpretations of that state.
 * Future artifact types can be added without changing the snapshot model.
 */
export type IntelligenceArtifactType =
  | "Snapshot"
  | "Report"
  | "Research Report"
  | "Technical Report"
  | "Executive Brief"
  | "Research Log";

/* -------------------------------------------------------------------------- */
/*                         Intelligence Artifact Format                       */
/* -------------------------------------------------------------------------- */

export type IntelligenceArtifactFormat =
  | "JSON"
  | "PDF"
  | "HTML"
  | "Markdown";

/* -------------------------------------------------------------------------- */
/*                         Intelligence Artifact Source                       */
/* -------------------------------------------------------------------------- */

export type IntelligenceArtifactSource =
  | "Repository Intelligence"
  | "Intelligence Snapshot";

/* -------------------------------------------------------------------------- */
/*                    Intelligence Artifact Versioning                        */
/* -------------------------------------------------------------------------- */

export type IntelligenceArtifactVersion =
  `${number}.${number}.${number}`;

export interface IntelligenceArtifactVersionInfo {
  version: IntelligenceArtifactVersion;
  major: number;
  minor: number;
  patch: number;
}

export type IntelligenceArtifactVersionBump =
  | "patch"
  | "minor"
  | "major";




/* -------------------------------------------------------------------------- */
/*                    Intelligence Artifact Metadata                          */
/* -------------------------------------------------------------------------- */

export interface IntelligenceArtifactMetadata {
  description?: string;
  title?: string;
  tags?: string[];
  repository?: string;
  snapshotCreatedAt?: string;
  generatedAt?: string;
}
/* -------------------------------------------------------------------------- */
/*                    Intelligence Artifact Lifecycle                         */
/* -------------------------------------------------------------------------- */

export type IntelligenceArtifactStatus =
  | "Draft"
  | "Registered"
  | "Published"
  | "Superseded"
  | "Archived";

/* -------------------------------------------------------------------------- */
/*                         Artifact Integrity                                 */
/* -------------------------------------------------------------------------- */

export interface IntelligenceArtifactIntegrity {
  algorithm: "SHA-256";

  hash: string;

  canonicalVersion: "1.0";

  generatedAt: string;
}

/* -------------------------------------------------------------------------- */
/*                         Intelligence Artifact Signature                    */
/* -------------------------------------------------------------------------- */

export type IntelligenceSignatureAlgorithm =
  | "ECDSA-P256-SHA256";

export type IntelligenceSignerType =
  | "Human"
  | "System"
  | "Organization";

export interface IntelligenceArtifactSignature {
  algorithm: IntelligenceSignatureAlgorithm;

  signerId: string;

  signerName: string;

  signerType: IntelligenceSignerType;

  signature: string;

  signedAt: string;

  keyId?: string;
}
/* -------------------------------------------------------------------------- */
/*                         Intelligence Trust State                           */
/* -------------------------------------------------------------------------- */

export type IntelligenceTrustStatus =
  | "Unsigned"
  | "Signed"
  | "Verified"
  | "Invalid";
/* -------------------------------------------------------------------------- */
/*                         Artifact Trust Policy                              */
/* -------------------------------------------------------------------------- */

export type IntelligenceArtifactTrustStatus =
  | "Verified"
  | "Signed"
  | "Unsigned"
  | "Invalid";

export type IntelligenceArtifactTrustDecision =
  | "Allow"
  | "Restrict"
  | "Block";

export type IntelligenceArtifactTrustReason =
  | "Verified"
  | "Signature present but trusted key unavailable"
  | "Artifact is unsigned"
  | "Artifact integrity verification failed"
  | "Artifact signature verification failed";

export interface IntelligenceArtifactTrustAssessment {
  status: IntelligenceArtifactTrustStatus;

  decision: IntelligenceArtifactTrustDecision;

  reason: IntelligenceArtifactTrustReason;

  checkedAt: string;

  integrityVerified: boolean;

  signaturePresent: boolean;

  signatureVerified: boolean;

  trustedKeyAvailable: boolean;
}
/* -------------------------------------------------------------------------- */
/*                         Intelligence Artifact                              */
/* -------------------------------------------------------------------------- */

export interface IntelligenceArtifact {
  artifactId: string;

  artifactType: IntelligenceArtifactType;

  repository: string;

  sourceSnapshotId: string;

  author: string;

  createdAt: string;

  generatedAt: string;

  version: IntelligenceArtifactVersion;

  format: IntelligenceArtifactFormat;

  source: IntelligenceArtifactSource;

   status: IntelligenceArtifactStatus;

   previousArtifactId?: string;

  metadata: IntelligenceArtifactMetadata;

  integrity?: IntelligenceArtifactIntegrity;

  signature?: IntelligenceArtifactSignature;
}