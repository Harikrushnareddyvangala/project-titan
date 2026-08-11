import type {
  IntelligenceArtifact,
} from "@/types/intelligence";

/* -------------------------------------------------------------------------- */
/*                         Integrity Constants                                */
/* -------------------------------------------------------------------------- */

const INTEGRITY_ALGORITHM =
  "SHA-256" as const;

const CANONICAL_VERSION =
  "1.0" as const;

/* -------------------------------------------------------------------------- */
/*                         Canonicalization                                  */
/* -------------------------------------------------------------------------- */

function sortObjectKeys(
  value: unknown,
): unknown {
  if (Array.isArray(value)) {
    return value.map(
      sortObjectKeys,
    );
  }

  if (
    value !== null &&
    typeof value === "object"
  ) {
    const object =
      value as Record<
        string,
        unknown
      >;

    return Object.keys(object)
      .sort()
      .reduce(
        (
          result,
          key,
        ) => {
          result[key] =
            sortObjectKeys(
              object[key],
            );

          return result;
        },
        {} as Record<
          string,
          unknown
        >,
      );
  }

  return value;
}

/* -------------------------------------------------------------------------- */
/*                         Artifact Content Projection                        */
/* -------------------------------------------------------------------------- */

/**
 * Returns the stable artifact content used by:
 *
 * 1. SHA-256 integrity fingerprints
 * 2. Artifact signing payloads
 *
 * Derived cryptographic metadata is intentionally excluded:
 *
 * - integrity
 * - signature
 *
 * This prevents a derived value from becoming part of
 * the content it describes.
 */
function getArtifactContentProjection(
  artifact: IntelligenceArtifact,
): Record<string, unknown> {
  const {
    integrity: _integrity,
    signature: _signature,
    ...content
  } = artifact;

  return content;
}

/* -------------------------------------------------------------------------- */
/*                         Canonical Content                                 */
/* -------------------------------------------------------------------------- */

export function canonicalizeArtifact(
  artifact: IntelligenceArtifact,
): string {
  return JSON.stringify(
    sortObjectKeys(
      getArtifactContentProjection(
        artifact,
      ),
    ),
  );
}

/* -------------------------------------------------------------------------- */
/*                         Signing Payload                                   */
/* -------------------------------------------------------------------------- */

/**
 * Cryptographic context bound to a signature.
 */
export interface ArtifactSigningContext {
  algorithm:
    "ECDSA-P256-SHA256";

  signerId: string;

  signerName: string;

  signerType:
    | "Human"
    | "System"
    | "Organization";

  keyId: string;

  signedAt: string;
}

/**
 * Canonical payload used for new artifact signatures.
 *
 * The payload consists of:
 *
 * artifact content
 * +
 * signing context
 *
 * The actual signature bytes are never included.
 */
export function canonicalizeArtifactSigningPayload(
  artifact: IntelligenceArtifact,
  context: ArtifactSigningContext,
): string {
  const content =
    getArtifactContentProjection(
      artifact,
    );

  return JSON.stringify(
    sortObjectKeys({
      artifact: content,
      signingContext: context,
    }),
  );
}

/* -------------------------------------------------------------------------- */
/*                         SHA-256                                           */
/* -------------------------------------------------------------------------- */

async function sha256(
  value: string,
): Promise<string> {
  const encoder =
    new TextEncoder();

  const data =
    encoder.encode(
      value,
    );

  const digest =
    await crypto.subtle.digest(
      "SHA-256",
      data,
    );

  return Array.from(
    new Uint8Array(
      digest,
    ),
  )
    .map(
      (byte) =>
        byte
          .toString(16)
          .padStart(
            2,
            "0",
          ),
    )
    .join("");
}

/* -------------------------------------------------------------------------- */
/*                         Fingerprint                                       */
/* -------------------------------------------------------------------------- */

export async function fingerprintArtifact(
  artifact: IntelligenceArtifact,
): Promise<string> {
  const canonical =
    canonicalizeArtifact(
      artifact,
    );

  return sha256(
    canonical,
  );
}

/* -------------------------------------------------------------------------- */
/*                         Integrity Record                                  */
/* -------------------------------------------------------------------------- */

export async function createArtifactIntegrity(
  artifact: IntelligenceArtifact,
) {
  const hash =
    await fingerprintArtifact(
      artifact,
    );

  return {
    algorithm:
      INTEGRITY_ALGORITHM,

    hash,

    canonicalVersion:
      CANONICAL_VERSION,

    generatedAt:
      new Date().toISOString(),
  } as const;
}

/* -------------------------------------------------------------------------- */
/*                         Verification                                      */
/* -------------------------------------------------------------------------- */

export async function verifyArtifactIntegrity(
  artifact: IntelligenceArtifact,
): Promise<boolean> {
  if (!artifact.integrity) {
    return false;
  }

  if (
    artifact.integrity.algorithm !==
    INTEGRITY_ALGORITHM
  ) {
    return false;
  }

  if (
    artifact.integrity.canonicalVersion !==
    CANONICAL_VERSION
  ) {
    return false;
  }

  const currentHash =
    await fingerprintArtifact(
      artifact,
    );

  return (
    currentHash ===
    artifact.integrity.hash
  );
}