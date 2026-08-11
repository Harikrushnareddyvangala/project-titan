import type {
  IntelligenceArtifact,
  IntelligenceTrustStatus,
} from "@/types/intelligence";

import {
  base64ToArrayBuffer,
  verifyArtifactSignature,
} from "./artifactSigning";

import {
  getTrustedPublicKey,
} from "./trustStore";

/* -------------------------------------------------------------------------- */
/*                         Artifact Trust Verification                        */
/* -------------------------------------------------------------------------- */

export async function verifyArtifactTrust(
  artifact: IntelligenceArtifact,
  publicKey?: CryptoKey,
): Promise<boolean> {
  if (
    !artifact.signature
  ) {
    return false;
  }

  if (
    artifact.signature.algorithm !==
    "ECDSA-P256-SHA256"
  ) {
    return false;
  }

  const verificationKey =
    publicKey ??
    await getTrustedPublicKey(
      artifact.signature,
    );

  if (!verificationKey) {
    return false;
  }

  try {
    const signature =
      base64ToArrayBuffer(
        artifact.signature.signature,
      );

    return await verifyArtifactSignature(
      artifact,
      signature,
      verificationKey,
    );
  } catch {
    return false;
  }
}

/* -------------------------------------------------------------------------- */
/*                         Trust State                                        */
/* -------------------------------------------------------------------------- */

export async function getArtifactTrustStatus(
  artifact: IntelligenceArtifact,
): Promise<IntelligenceTrustStatus> {
  if (
    !artifact.signature
  ) {
    return "Unsigned";
  }

  const trustedKey =
    await getTrustedPublicKey(
      artifact.signature,
    );

  if (!trustedKey) {
    return "Signed";
  }

  const verified =
    await verifyArtifactTrust(
      artifact,
      trustedKey,
    );

  return verified
    ? "Verified"
    : "Invalid";
}