"use client";

import {
  generateSigningKeyPair,
} from "./artifactSigning";

/* -------------------------------------------------------------------------- */
/*                         Runtime Key Record                                 */
/* -------------------------------------------------------------------------- */

export interface IntelligenceSigningKey {
  keyId: string;

  signerId: string;

  signerName: string;

  algorithm:
    "ECDSA-P256-SHA256";

  createdAt: string;

  keyPair: CryptoKeyPair;
}

/* -------------------------------------------------------------------------- */
/*                         Runtime Key Store                                  */
/* -------------------------------------------------------------------------- */

/*
 * IMPORTANT:
 *
 * Private keys are intentionally kept in memory only.
 *
 * They are NOT written to:
 *
 * - localStorage
 * - sessionStorage
 * - IntelligenceArtifact
 * - exported JSON
 *
 * This is a development/browser trust layer, not a hardware-backed
 * production key vault.
 */

const runtimeKeys =
  new Map<
    string,
    IntelligenceSigningKey
  >();

/* -------------------------------------------------------------------------- */
/*                         Key ID                                            */
/* -------------------------------------------------------------------------- */

function createKeyId(): string {
  const random =
    crypto.randomUUID();

  return `titan-key-${random}`;
}

/* -------------------------------------------------------------------------- */
/*                         Generate Key                                       */
/* -------------------------------------------------------------------------- */

export async function generateIntelligenceSigningKey(
  signerId: string,
  signerName: string,
): Promise<IntelligenceSigningKey> {
  const keyPair =
    await generateSigningKeyPair();

  const key:
    IntelligenceSigningKey = {
    keyId:
      createKeyId(),

    signerId,

    signerName,

    algorithm:
      "ECDSA-P256-SHA256",

    createdAt:
      new Date().toISOString(),

    keyPair,
  };

  runtimeKeys.set(
    key.keyId,
    key,
  );

  return key;
}

/* -------------------------------------------------------------------------- */
/*                         Get Key                                            */
/* -------------------------------------------------------------------------- */

export function getIntelligenceSigningKey(
  keyId: string,
): IntelligenceSigningKey | null {
  return (
    runtimeKeys.get(
      keyId,
    ) ?? null
  );
}

/* -------------------------------------------------------------------------- */
/*                         Get Private Key                                    */
/* -------------------------------------------------------------------------- */

export function getIntelligencePrivateKey(
  keyId: string,
): CryptoKey | null {
  return (
    runtimeKeys.get(
      keyId,
    )?.keyPair.privateKey ??
    null
  );
}

/* -------------------------------------------------------------------------- */
/*                         Get Public Key                                     */
/* -------------------------------------------------------------------------- */

export function getIntelligencePublicKey(
  keyId: string,
): CryptoKey | null {
  return (
    runtimeKeys.get(
      keyId,
    )?.keyPair.publicKey ??
    null
  );
}

/* -------------------------------------------------------------------------- */
/*                         List Keys                                          */
/* -------------------------------------------------------------------------- */

export function getIntelligenceSigningKeys():
  IntelligenceSigningKey[] {
  return Array.from(
    runtimeKeys.values(),
  );
}

/* -------------------------------------------------------------------------- */
/*                         Remove Runtime Key                                 */
/* -------------------------------------------------------------------------- */

export function removeIntelligenceSigningKey(
  keyId: string,
): boolean {
  return runtimeKeys.delete(
    keyId,
  );
}

/* -------------------------------------------------------------------------- */
/*                         Clear Runtime Keys                                 */
/* -------------------------------------------------------------------------- */

export function clearIntelligenceSigningKeys(): void {
  runtimeKeys.clear();
}