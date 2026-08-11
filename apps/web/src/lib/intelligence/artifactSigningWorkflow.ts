"use client";

import type {
  IntelligenceArtifact,
} from "@/types/intelligence";

import {
  createArtifactSignature,
} from "./artifactSigning";

import {
  getIntelligencePrivateKey,
} from "./keyManager";

import {
  getIntelligenceArtifact,
  saveIntelligenceArtifact,
} from "./artifactRegistry";

/* -------------------------------------------------------------------------- */
/*                         Signing Result                                     */
/* -------------------------------------------------------------------------- */

export interface ArtifactSigningResult {
  artifact:
    IntelligenceArtifact;

  keyId: string;
}

/* -------------------------------------------------------------------------- */
/*                         Sign Artifact                                      */
/* -------------------------------------------------------------------------- */

export async function signRegisteredArtifact(
  artifactId: string,
  keyId: string,
): Promise<ArtifactSigningResult> {
  const artifact =
    getIntelligenceArtifact(
      artifactId,
    );

  if (!artifact) {
    throw new Error(
      "Artifact could not be found.",
    );
  }

  /* ------------------------------------------------------------------------ */
  /*                         Resolve Private Key                              */
  /* ------------------------------------------------------------------------ */

  const privateKey =
    getIntelligencePrivateKey(
      keyId,
    );

  if (!privateKey) {
    throw new Error(
      "The selected signing key is not available in this browser session.",
    );
  }

  /* ------------------------------------------------------------------------ */
  /*                         Prevent Re-signing                               */
  /* ------------------------------------------------------------------------ */

  if (artifact.signature) {
    throw new Error(
      "This artifact is already signed. Create a revision before signing another version.",
    );
  }

  /* ------------------------------------------------------------------------ */
  /*                         Create Signature                                 */
  /* ------------------------------------------------------------------------ */

  const signature =
    await createArtifactSignature(
      artifact,
      privateKey,
      keyId,
    );

  /* ------------------------------------------------------------------------ */
  /*                         Create Signed Artifact                           */
  /* ------------------------------------------------------------------------ */

  const signedArtifact:
    IntelligenceArtifact = {
    ...artifact,

    signature,
  };

  /* ------------------------------------------------------------------------ */
  /*                         Persist                                          */
  /* ------------------------------------------------------------------------ */

  saveIntelligenceArtifact(
    signedArtifact,
  );

  /* ------------------------------------------------------------------------ */
  /*                         Result                                           */
  /* ------------------------------------------------------------------------ */

  return {
    artifact:
      signedArtifact,

    keyId,
  };
}