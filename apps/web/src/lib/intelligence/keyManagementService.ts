"use client";

import {
  TITAN_PRIMARY_SIGNER,
} from "./trust";

import {
  generateIntelligenceSigningKey,
  getIntelligenceSigningKeys,
  getIntelligenceSigningKey,
  getIntelligencePrivateKey,
  removeIntelligenceSigningKey,
} from "./keyManager";

import {
  registerTrustedPublicKey,
  getTrustedPublicKeyRecords,
  removeTrustedPublicKey,
} from "./trustStore";

/* -------------------------------------------------------------------------- */
/*                         Generate TITAN Key                                 */
/* -------------------------------------------------------------------------- */

export async function createTitanSigningKey() {
  const key =
    await generateIntelligenceSigningKey(
      TITAN_PRIMARY_SIGNER.signerId,
      TITAN_PRIMARY_SIGNER.signerName,
    );

  await registerTrustedPublicKey(
    {
      signerId:
        key.signerId,

      signerName:
        key.signerName,

      algorithm:
        key.algorithm,

      keyId:
        key.keyId,
    },
    key.keyPair.publicKey,
  );

  return key;
}

/* -------------------------------------------------------------------------- */
/*                         Signing Key Lookup                                 */
/* -------------------------------------------------------------------------- */

export function getTitanSigningKeys() {
  return getIntelligenceSigningKeys();
}

/* -------------------------------------------------------------------------- */
/*                         Private Key Lookup                                 */
/* -------------------------------------------------------------------------- */

export function getTitanPrivateKey(
  keyId: string,
): CryptoKey | null {
  return getIntelligencePrivateKey(
    keyId,
  );
}

/* -------------------------------------------------------------------------- */
/*                         Key Details                                       */
/* -------------------------------------------------------------------------- */

export function getTitanSigningKey(
  keyId: string,
) {
  return getIntelligenceSigningKey(
    keyId,
  );
}

/* -------------------------------------------------------------------------- */
/*                         Trusted Public Keys                                */
/* -------------------------------------------------------------------------- */

export function getTitanTrustedKeys() {
  return getTrustedPublicKeyRecords();
}

/* -------------------------------------------------------------------------- */
/*                         Revoke Key                                         */
/* -------------------------------------------------------------------------- */

export function revokeTitanKey(
  keyId: string,
): boolean {
  const removedTrust =
    removeTrustedPublicKey(
      keyId,
    );

  removeIntelligenceSigningKey(
    keyId,
  );

  return removedTrust;
}