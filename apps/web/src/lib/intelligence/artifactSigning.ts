import type {
  IntelligenceArtifact,
  IntelligenceArtifactSignature,
} from "@/types/intelligence";

import {
  canonicalizeArtifact,
  canonicalizeArtifactSigningPayload,
  type ArtifactSigningContext,
} from "./artifactIntegrity";

import {
  TITAN_PRIMARY_SIGNER,
} from "./trust";

/* -------------------------------------------------------------------------- */
/*                         Signature Payload                                  */
/* -------------------------------------------------------------------------- */

/**
 * Legacy signing payload.
 *
 * Used only for artifacts created before cryptographic signing context
 * binding was introduced.
 */
export function createArtifactSigningPayload(
  artifact: IntelligenceArtifact,
): string {
  return canonicalizeArtifact(
    artifact,
  );
}

/**
 * New cryptographically bound signing payload.
 *
 * This payload MUST be used by both signing and verification.
 */
export function createBoundArtifactSigningPayload(
  artifact: IntelligenceArtifact,
  context: ArtifactSigningContext,
): string {
  return canonicalizeArtifactSigningPayload(
    artifact,
    context,
  );
}

/* -------------------------------------------------------------------------- */
/*                         Key Generation                                     */
/* -------------------------------------------------------------------------- */

export async function generateSigningKeyPair():
  Promise<CryptoKeyPair> {
  return crypto.subtle.generateKey(
    {
      name: "ECDSA",
      namedCurve: "P-256",
    },
    true,
    [
      "sign",
      "verify",
    ],
  );
}

/* -------------------------------------------------------------------------- */
/*                         Signing                                            */
/* -------------------------------------------------------------------------- */

export async function signArtifact(
  artifact: IntelligenceArtifact,
  privateKey: CryptoKey,
  context?: ArtifactSigningContext,
): Promise<ArrayBuffer> {
  const payload =
    context
      ? createBoundArtifactSigningPayload(
          artifact,
          context,
        )
      : createArtifactSigningPayload(
          artifact,
        );

  const encoder =
    new TextEncoder();

  const data =
    encoder.encode(
      payload,
    );

  return crypto.subtle.sign(
    {
      name: "ECDSA",
      hash: "SHA-256",
    },
    privateKey,
    data,
  );
}

/* -------------------------------------------------------------------------- */
/*                         Verification                                      */
/* -------------------------------------------------------------------------- */

export async function verifyArtifactSignature(
  artifact: IntelligenceArtifact,
  signature: ArrayBuffer,
  publicKey: CryptoKey,
): Promise<boolean> {
  if (!artifact.signature) {
    return false;
  }

  /*
   * New signatures contain keyId and therefore use the
   * cryptographically bound signing context.
   */
  if (
    artifact.signature.keyId
  ) {
    const context:
      ArtifactSigningContext = {
      algorithm:
        artifact.signature.algorithm,

      signerId:
        artifact.signature.signerId,

      signerName:
        artifact.signature.signerName,

      signerType:
        artifact.signature.signerType,

      keyId:
        artifact.signature.keyId,

      signedAt:
        artifact.signature.signedAt,
    };

    const payload =
      createBoundArtifactSigningPayload(
        artifact,
        context,
      );

    const encoder =
      new TextEncoder();

    const data =
      encoder.encode(
        payload,
      );

    return crypto.subtle.verify(
      {
        name: "ECDSA",
        hash: "SHA-256",
      },
      publicKey,
      signature,
      data,
    );
  }

  /*
   * Legacy signatures were signed against the stable
   * artifact content only.
   */
  const payload =
    createArtifactSigningPayload(
      artifact,
    );

  const encoder =
    new TextEncoder();

  const data =
    encoder.encode(
      payload,
    );

  return crypto.subtle.verify(
    {
      name: "ECDSA",
      hash: "SHA-256",
    },
    publicKey,
    signature,
    data,
  );
}

/* -------------------------------------------------------------------------- */
/*                         Base64 Encoding                                    */
/* -------------------------------------------------------------------------- */

export function arrayBufferToBase64(
  buffer: ArrayBuffer,
): string {
  const bytes =
    new Uint8Array(
      buffer,
    );

  let binary = "";

  for (
    const byte of bytes
  ) {
    binary +=
      String.fromCharCode(
        byte,
      );
  }

  return btoa(
    binary,
  );
}

export function base64ToArrayBuffer(
  value: string,
): ArrayBuffer {
  const binary =
    atob(
      value,
    );

  const bytes =
    new Uint8Array(
      binary.length,
    );

  for (
    let index = 0;
    index < binary.length;
    index += 1
  ) {
    bytes[index] =
      binary.charCodeAt(
        index,
      );
  }

  return bytes.buffer;
}

/* -------------------------------------------------------------------------- */
/*                         Signature Creation                                 */
/* -------------------------------------------------------------------------- */

export async function createArtifactSignature(
  artifact: IntelligenceArtifact,
  privateKey: CryptoKey,
  keyId: string,
): Promise<IntelligenceArtifactSignature> {
  /*
   * signedAt MUST be generated before signing because
   * it is part of the cryptographically bound context.
   */
  const signedAt =
    new Date().toISOString();

  const signatureMetadata = {
    algorithm:
      "ECDSA-P256-SHA256" as const,

    signerId:
      TITAN_PRIMARY_SIGNER.signerId,

    signerName:
      TITAN_PRIMARY_SIGNER.signerName,

    signerType:
      TITAN_PRIMARY_SIGNER.signerType,

    keyId,

    signedAt,
  };

  /*
   * CRITICAL:
   *
   * Use the SAME canonical signing payload that verification uses.
   *
   * Do NOT call canonicalizeArtifact() here.
   */
  const payload =
    createBoundArtifactSigningPayload(
      artifact,
      signatureMetadata,
    );

  const encoder =
    new TextEncoder();

  const data =
    encoder.encode(
      payload,
    );

  const rawSignature =
    await crypto.subtle.sign(
      {
        name: "ECDSA",
        hash: "SHA-256",
      },
      privateKey,
      data,
    );

  return {
    ...signatureMetadata,

    signature:
      arrayBufferToBase64(
        rawSignature,
      ),
  };
}