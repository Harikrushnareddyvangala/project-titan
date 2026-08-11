"use client";

import type {
  IntelligenceArtifact,
  IntelligenceTrustStatus,
} from "@/types/intelligence";

import {
  createArtifactSignature,
  generateSigningKeyPair,
} from "./artifactSigning";

import {
  registerTrustedPublicKey,
  clearTrustedPublicKeys,
} from "./trustStore";

import {
  getArtifactTrustStatus,
} from "./trustService";

import {
  TITAN_PRIMARY_SIGNER,
} from "./trust";

/* -------------------------------------------------------------------------- */
/*                         Runtime Test Result                                */
/* -------------------------------------------------------------------------- */

export interface IntelligenceTrustRuntimeResult {
  unsigned: IntelligenceTrustStatus;

  signed: IntelligenceTrustStatus;

  verified: IntelligenceTrustStatus;

  invalid: IntelligenceTrustStatus;

  passed: boolean;
}

/* -------------------------------------------------------------------------- */
/*                         Test Artifact                                     */
/* -------------------------------------------------------------------------- */

function createTestArtifact(): IntelligenceArtifact {
  const now =
    new Date().toISOString();

  return {
    artifactId:
      "trust-runtime-test",

    artifactType:
      "Technical Report",

    repository:
      "Project TITAN",

    sourceSnapshotId:
      "snapshot-runtime-test",

    author:
      TITAN_PRIMARY_SIGNER.signerName,

    createdAt:
      now,

    generatedAt:
      now,

    version:
      "1.0.0",

    format:
      "JSON",

    source:
      "Repository Intelligence",

    status:
      "Registered",

    metadata: {
      title:
        "TITAN Trust Runtime Test",

      description:
        "Development-only cryptographic trust verification artifact.",

      tags: [
        "runtime-test",
        "trust",
        "verification",
      ],
    },
  };
}

/* -------------------------------------------------------------------------- */
/*                         Runtime Verification                              */
/* -------------------------------------------------------------------------- */

export async function runTrustRuntimeTest():
  Promise<IntelligenceTrustRuntimeResult> {
  /*
   * Start with a clean trust store so the test is deterministic.
   */
  clearTrustedPublicKeys();

  const artifact =
    createTestArtifact();

  /* ------------------------------------------------------------------------ */
  /*                         1. Unsigned artifact                            */
  /* ------------------------------------------------------------------------ */

  const unsigned =
    await getArtifactTrustStatus(
      artifact,
    );

  /* ------------------------------------------------------------------------ */
  /*                         2. Generate signing keys                       */
  /* ------------------------------------------------------------------------ */

  const keyId =
    `titan-test-key-${crypto.randomUUID()}`;

  const keyPair =
    await generateSigningKeyPair();

  /* ------------------------------------------------------------------------ */
  /*                         3. Create signature                             */
  /* ------------------------------------------------------------------------ */

  const signature =
    await createArtifactSignature(
      artifact,
      keyPair.privateKey,
      keyId,
    );

  /*
   * IMPORTANT:
   *
   * Do not overwrite signature.keyId here.
   *
   * createArtifactSignature() has already cryptographically bound the
   * generated keyId into the signing context.
   */
  const signedArtifact:
    IntelligenceArtifact = {
    ...artifact,

    signature,
  };

  /* ------------------------------------------------------------------------ */
  /*                         4. Signature exists, but key is untrusted       */
  /* ------------------------------------------------------------------------ */

  const signed =
    await getArtifactTrustStatus(
      signedArtifact,
    );

  /* ------------------------------------------------------------------------ */
  /*                         5. Register public key                          */
  /* ------------------------------------------------------------------------ */

  await registerTrustedPublicKey(
    {
      signerId:
        signedArtifact.signature!
          .signerId,

      signerName:
        signedArtifact.signature!
          .signerName,

      algorithm:
        signedArtifact.signature!
          .algorithm,

      /*
       * This MUST be the exact keyId that was used during signing.
       */
      keyId:
        signedArtifact.signature!
          .keyId,
    },
    keyPair.publicKey,
  );

  /* ------------------------------------------------------------------------ */
  /*                         6. Verify genuine artifact                      */
  /* ------------------------------------------------------------------------ */

  const verified =
    await getArtifactTrustStatus(
      signedArtifact,
    );

  /* ------------------------------------------------------------------------ */
  /*                         7. Mutate artifact after signing               */
  /* ------------------------------------------------------------------------ */

  const modifiedArtifact:
    IntelligenceArtifact = {
    ...signedArtifact,

    metadata: {
      ...signedArtifact.metadata,

      description:
        "THIS CONTENT WAS MODIFIED AFTER SIGNING.",
    },
  };

  const invalid =
    await getArtifactTrustStatus(
      modifiedArtifact,
    );

  /* ------------------------------------------------------------------------ */
  /*                         Cleanup                                         */
  /* ------------------------------------------------------------------------ */

  clearTrustedPublicKeys();

  /* ------------------------------------------------------------------------ */
  /*                         Final result                                    */
  /* ------------------------------------------------------------------------ */

  return {
    unsigned,

    signed,

    verified,

    invalid,

    passed:
      unsigned === "Unsigned" &&
      signed === "Signed" &&
      verified === "Verified" &&
      invalid === "Invalid",
  };
}