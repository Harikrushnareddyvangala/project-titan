import type {
  IntelligenceArtifact,
  IntelligenceArtifactTrustAssessment,
} from "@/types/intelligence";

/* -------------------------------------------------------------------------- */
/*                         Policy Configuration                               */
/* -------------------------------------------------------------------------- */

export interface IntelligenceArtifactTrustPolicy {
  requireIntegrityForPublish: boolean;

  requireSignatureForPublish: boolean;

  requireTrustedSignatureForPublish: boolean;

  allowUnsignedExport: boolean;

  allowSignedButUnverifiedExport: boolean;
}

/* -------------------------------------------------------------------------- */
/*                         Default TITAN Policy                               */
/* -------------------------------------------------------------------------- */

export const DEFAULT_ARTIFACT_TRUST_POLICY:
  IntelligenceArtifactTrustPolicy = {
  requireIntegrityForPublish: true,

  requireSignatureForPublish: true,

  requireTrustedSignatureForPublish: true,

  allowUnsignedExport: true,

  allowSignedButUnverifiedExport: true,
};

/* -------------------------------------------------------------------------- */
/*                         Assessment Input                                   */
/* -------------------------------------------------------------------------- */

export interface EvaluateArtifactTrustInput {
  artifact: IntelligenceArtifact;

  integrityVerified: boolean;

  signatureVerified: boolean;

  trustedKeyAvailable: boolean;
}

/* -------------------------------------------------------------------------- */
/*                         Trust Assessment                                   */
/* -------------------------------------------------------------------------- */

export function evaluateArtifactTrust(
  input: EvaluateArtifactTrustInput,
  policy:
    IntelligenceArtifactTrustPolicy =
      DEFAULT_ARTIFACT_TRUST_POLICY,
): IntelligenceArtifactTrustAssessment {
  const {
    artifact,
    integrityVerified,
    signatureVerified,
    trustedKeyAvailable,
  } = input;

  const signaturePresent =
    Boolean(
      artifact.signature,
    );

  /*
   * Invalid integrity always wins.
   *
   * A modified artifact must never become
   * trusted merely because it still carries
   * a previous signature.
   */
  if (
    artifact.integrity &&
    !integrityVerified
  ) {
    return {
      status: "Invalid",

      decision: "Block",

      reason:
        "Artifact integrity verification failed",

      checkedAt:
        new Date().toISOString(),

      integrityVerified,

      signaturePresent,

      signatureVerified,

      trustedKeyAvailable,
    };
  }

  /*
   * A signature exists but cryptographic
   * verification failed.
   */
  if (
    signaturePresent &&
    !signatureVerified
  ) {
    return {
      status: "Invalid",

      decision: "Block",

      reason:
        "Artifact signature verification failed",

      checkedAt:
        new Date().toISOString(),

      integrityVerified,

      signaturePresent,

      signatureVerified,

      trustedKeyAvailable,
    };
  }

  /*
   * Fully trusted artifact.
   */
  if (
    integrityVerified &&
    signaturePresent &&
    signatureVerified &&
    trustedKeyAvailable
  ) {
    return {
      status: "Verified",

      decision: "Allow",

      reason: "Verified",

      checkedAt:
        new Date().toISOString(),

      integrityVerified,

      signaturePresent,

      signatureVerified,

      trustedKeyAvailable,
    };
  }

  /*
   * Signature exists, but the trust chain
   * cannot currently be established.
   */
  if (signaturePresent) {
    return {
      status: "Signed",

      decision:
        policy.allowSignedButUnverifiedExport
          ? "Restrict"
          : "Block",

      reason:
        "Signature present but trusted key unavailable",

      checkedAt:
        new Date().toISOString(),

      integrityVerified,

      signaturePresent,

      signatureVerified,

      trustedKeyAvailable,
    };
  }

  /*
   * Unsigned artifact.
   */
  return {
    status: "Unsigned",

    decision:
      policy.allowUnsignedExport
        ? "Restrict"
        : "Block",

    reason:
      "Artifact is unsigned",

    checkedAt:
      new Date().toISOString(),

    integrityVerified,

    signaturePresent,

    signatureVerified,

    trustedKeyAvailable,
  };
}

/* -------------------------------------------------------------------------- */
/*                         Publish Enforcement                                */
/* -------------------------------------------------------------------------- */

export function canPublishArtifact(
  assessment:
    IntelligenceArtifactTrustAssessment,
  policy:
    IntelligenceArtifactTrustPolicy =
      DEFAULT_ARTIFACT_TRUST_POLICY,
): boolean {
  if (
    policy.requireIntegrityForPublish &&
    !assessment.integrityVerified
  ) {
    return false;
  }

  if (
    policy.requireSignatureForPublish &&
    !assessment.signaturePresent
  ) {
    return false;
  }

  if (
    policy.requireTrustedSignatureForPublish &&
    !assessment.signatureVerified
  ) {
    return false;
  }

  if (
    policy.requireTrustedSignatureForPublish &&
    !assessment.trustedKeyAvailable
  ) {
    return false;
  }

  return (
    assessment.status ===
    "Verified"
  );
}

/* -------------------------------------------------------------------------- */
/*                         Export Enforcement                                 */
/* -------------------------------------------------------------------------- */

export function canExportArtifact(
  assessment:
    IntelligenceArtifactTrustAssessment,
  policy:
    IntelligenceArtifactTrustPolicy =
      DEFAULT_ARTIFACT_TRUST_POLICY,
): boolean {
  if (
    assessment.status ===
    "Invalid"
  ) {
    return false;
  }

  if (
    assessment.status ===
    "Verified"
  ) {
    return true;
  }

  if (
    assessment.status ===
    "Signed"
  ) {
    return (
      policy.allowSignedButUnverifiedExport
    );
  }

  if (
    assessment.status ===
    "Unsigned"
  ) {
    return (
      policy.allowUnsignedExport
    );
  }

  return false;
}