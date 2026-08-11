"use client";

import type {
  IntelligenceArtifactSignature,
} from "@/types/intelligence";

/* -------------------------------------------------------------------------- */
/*                         Trust Store                                        */
/* -------------------------------------------------------------------------- */

const TRUST_STORE_KEY =
  "titan:intelligence-trusted-public-keys";

/* -------------------------------------------------------------------------- */
/*                         Trusted Key Record                                 */
/* -------------------------------------------------------------------------- */

export interface TrustedPublicKeyRecord {
  signerId: string;

  signerName: string;

  algorithm:
    "ECDSA-P256-SHA256";

  keyId: string;

  publicKey: JsonWebKey;

  registeredAt: string;
}

/* -------------------------------------------------------------------------- */
/*                         Environment                                        */
/* -------------------------------------------------------------------------- */

function isBrowser(): boolean {
  return (
    typeof window !==
    "undefined"
  );
}

/* -------------------------------------------------------------------------- */
/*                         Read Store                                         */
/* -------------------------------------------------------------------------- */

function readTrustedKeys():
  TrustedPublicKeyRecord[] {
  if (!isBrowser()) {
    return [];
  }

  try {
    const raw =
      window.localStorage.getItem(
        TRUST_STORE_KEY,
      );

    if (!raw) {
      return [];
    }

    const parsed: unknown =
      JSON.parse(raw);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter(
      isTrustedPublicKeyRecord,
    );
  } catch {
    return [];
  }
}

/* -------------------------------------------------------------------------- */
/*                         Validation                                        */
/* -------------------------------------------------------------------------- */

function isTrustedPublicKeyRecord(
  value: unknown,
): value is TrustedPublicKeyRecord {
  if (
    typeof value !==
      "object" ||
    value === null
  ) {
    return false;
  }

  const record =
    value as Record<
      string,
      unknown
    >;

  return (
    typeof record.signerId ===
      "string" &&
    typeof record.signerName ===
      "string" &&
    record.algorithm ===
      "ECDSA-P256-SHA256" &&
    typeof record.keyId ===
      "string" &&
    typeof record.publicKey ===
      "object" &&
    record.publicKey !== null &&
    typeof record.registeredAt ===
      "string"
  );
}

/* -------------------------------------------------------------------------- */
/*                         Write Store                                        */
/* -------------------------------------------------------------------------- */

function writeTrustedKeys(
  records: TrustedPublicKeyRecord[],
): void {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.setItem(
    TRUST_STORE_KEY,
    JSON.stringify(records),
  );
}

/* -------------------------------------------------------------------------- */
/*                         Register Public Key                                */
/* -------------------------------------------------------------------------- */

export async function registerTrustedPublicKey(
  signature: Pick<
    IntelligenceArtifactSignature,
    | "signerId"
    | "signerName"
    | "algorithm"
    | "keyId"
  >,
  publicKey: CryptoKey,
): Promise<void> {
  if (
    signature.algorithm !==
    "ECDSA-P256-SHA256"
  ) {
    throw new Error(
      "Unsupported trust key algorithm.",
    );
  }

  const publicKeyJwk =
    await crypto.subtle.exportKey(
      "jwk",
      publicKey,
    );

  const keyId =
    signature.keyId ??
    signature.signerId;

  const records =
    readTrustedKeys();

  const nextRecord:
    TrustedPublicKeyRecord = {
    signerId:
      signature.signerId,

    signerName:
      signature.signerName,

    algorithm:
      "ECDSA-P256-SHA256",

    keyId,

    publicKey:
      publicKeyJwk,

    registeredAt:
      new Date().toISOString(),
  };

  const existingIndex =
    records.findIndex(
      (record) =>
        record.keyId ===
        keyId,
    );

  if (
    existingIndex >= 0
  ) {
    records[
      existingIndex
    ] = nextRecord;
  } else {
    records.push(
      nextRecord,
    );
  }

  writeTrustedKeys(
    records,
  );
}

/* -------------------------------------------------------------------------- */
/*                         Get Trusted Key                                    */
/* -------------------------------------------------------------------------- */

export async function getTrustedPublicKey(
  signature: Pick<
    IntelligenceArtifactSignature,
    "signerId" | "keyId"
  >,
): Promise<CryptoKey | null> {
  const records =
    readTrustedKeys();

  const record =
    records.find(
      (item) =>
        item.keyId ===
          signature.keyId ||
        item.signerId ===
          signature.signerId,
    );

  if (!record) {
    return null;
  }

  return crypto.subtle.importKey(
    "jwk",
    record.publicKey,
    {
      name: "ECDSA",
      namedCurve: "P-256",
    },
    true,
    ["verify"],
  );
}

/* -------------------------------------------------------------------------- */
/*                         Trust Key Lookup                                   */
/* -------------------------------------------------------------------------- */

export function hasTrustedPublicKey(
  signature: Pick<
    IntelligenceArtifactSignature,
    "signerId" | "keyId"
  >,
): boolean {
  const records =
    readTrustedKeys();

  return records.some(
    (record) =>
      record.keyId ===
        signature.keyId ||
      record.signerId ===
        signature.signerId,
  );
}

/* -------------------------------------------------------------------------- */
/*                         Clear Trust Store                                  */
/* -------------------------------------------------------------------------- */

export function clearTrustedPublicKeys(): void {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.removeItem(
    TRUST_STORE_KEY,
  );
}
/* -------------------------------------------------------------------------- */
/*                         List Trusted Keys                                  */
/* -------------------------------------------------------------------------- */

export function getTrustedPublicKeyRecords():
  TrustedPublicKeyRecord[] {
  return [
    ...readTrustedKeys(),
  ];
}

/* -------------------------------------------------------------------------- */
/*                         Remove Trusted Key                                 */
/* -------------------------------------------------------------------------- */

export function removeTrustedPublicKey(
  keyId: string,
): boolean {
  const records =
    readTrustedKeys();

  const filtered =
    records.filter(
      (record) =>
        record.keyId !== keyId,
    );

  if (
    filtered.length ===
    records.length
  ) {
    return false;
  }

  writeTrustedKeys(
    filtered,
  );

  return true;
}