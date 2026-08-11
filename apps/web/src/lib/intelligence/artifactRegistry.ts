import {
  incrementArtifactVersion,
} from "@/lib/intelligence/artifact";

import type {
  IntelligenceArtifact,
  IntelligenceArtifactStatus,
  IntelligenceArtifactVersionBump,
} from "@/types/intelligence";

import {
  createArtifactIntegrity,
} from "./artifactIntegrity";

import {
  verifyArtifactIntegrity,
} from "./artifactIntegrity";

import {
  createArtifactSignature,
} from "./artifactSigning";
import {
  getArtifactTrustStatus,
} from "./trustService";

/* -------------------------------------------------------------------------- */
/*                              Storage                                       */
/* -------------------------------------------------------------------------- */

const STORAGE_KEY =
  "titan:intelligence-artifacts";

/* -------------------------------------------------------------------------- */
/*                              Store                                         */
/* -------------------------------------------------------------------------- */

type ArtifactListener =
  () => void;

const listeners =
  new Set<ArtifactListener>();

let cachedArtifacts:
  IntelligenceArtifact[] | null =
    null;

/* -------------------------------------------------------------------------- */
/*                              Environment                                   */
/* -------------------------------------------------------------------------- */

function isBrowser(): boolean {
  return typeof window !==
    "undefined";
}

/* -------------------------------------------------------------------------- */
/*                              Notifications                                 */
/* -------------------------------------------------------------------------- */

function notifyListeners(): void {
  listeners.forEach(
    (listener) => {
      listener();
    },
  );
}

/* -------------------------------------------------------------------------- */
/*                              Validation                                    */
/* -------------------------------------------------------------------------- */

function isIntelligenceArtifact(
  value: unknown,
): value is IntelligenceArtifact {
  if (
    typeof value !== "object" ||
    value === null
  ) {
    return false;
  }

  const artifact =
    value as Record<
      string,
      unknown
    >;

  const validStatuses = [
    "Draft",
    "Registered",
    "Published",
    "Superseded",
    "Archived",
  ] as const;

  const hasValidStatus =
    artifact.status === undefined ||
    validStatuses.includes(
      artifact.status as
        (typeof validStatuses)[number],
    );

  return (
    typeof artifact.artifactId ===
      "string" &&

    typeof artifact.artifactType ===
      "string" &&

    typeof artifact.repository ===
      "string" &&

    typeof artifact.sourceSnapshotId ===
      "string" &&

    typeof artifact.author ===
      "string" &&

    typeof artifact.createdAt ===
      "string" &&

    typeof artifact.generatedAt ===
      "string" &&

    typeof artifact.version ===
      "string" &&

    typeof artifact.format ===
      "string" &&

    typeof artifact.source ===
      "string" &&

    hasValidStatus &&

    typeof artifact.metadata ===
      "object" &&

    artifact.metadata !== null
  );
}

/* -------------------------------------------------------------------------- */
/*                         Legacy Normalization                               */
/* -------------------------------------------------------------------------- */

/**
 * Artifacts created before lifecycle support
 * may not have a status field.
 *
 * Treat those artifacts as Registered.
 */
function normalizeArtifact(
  artifact: IntelligenceArtifact,
): IntelligenceArtifact {
  return {
    ...artifact,

    status:
      artifact.status ??
      "Registered",
  };
}

/* -------------------------------------------------------------------------- */
/*                              Read                                          */
/* -------------------------------------------------------------------------- */

function readArtifacts():
  IntelligenceArtifact[] {
  if (!isBrowser()) {
    return [];
  }

  try {
    const raw =
      window.localStorage.getItem(
        STORAGE_KEY,
      );

    if (!raw) {
      return [];
    }

    const parsed: unknown =
      JSON.parse(raw);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed
      .filter(
        isIntelligenceArtifact,
      )
      .map(
        normalizeArtifact,
      );
  } catch {
    return [];
  }
}

/* -------------------------------------------------------------------------- */
/*                              Write                                         */
/* -------------------------------------------------------------------------- */

function writeArtifacts(
  artifacts: IntelligenceArtifact[],
): void {
  if (!isBrowser()) {
    return;
  }

  const nextArtifacts =
    [...artifacts];

  window.localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(
      nextArtifacts,
    ),
  );

  /*
   * IMPORTANT:
   *
   * This exact array reference becomes
   * the external-store snapshot.
   *
   * Do not return a new array from
   * getIntelligenceArtifacts().
   */
  cachedArtifacts =
    nextArtifacts;

  notifyListeners();
}

/* -------------------------------------------------------------------------- */
/*                              Get All                                       */
/* -------------------------------------------------------------------------- */

export function getIntelligenceArtifacts():
  IntelligenceArtifact[] {
  if (
    cachedArtifacts !== null
  ) {
    return cachedArtifacts;
  }

  cachedArtifacts =
    readArtifacts();

  return cachedArtifacts;
}

/* -------------------------------------------------------------------------- */
/*                              Save                                          */
/* -------------------------------------------------------------------------- */

export function saveIntelligenceArtifact(
  artifact: IntelligenceArtifact,
): void {
  const artifacts =
    getIntelligenceArtifacts();

  const nextArtifacts =
    [...artifacts];

  const existingIndex =
    nextArtifacts.findIndex(
      (item) =>
        item.artifactId ===
        artifact.artifactId,
    );

  if (
    existingIndex >= 0
  ) {
    nextArtifacts[
      existingIndex
    ] = artifact;
  } else {
    nextArtifacts.unshift(
      artifact,
    );
  }

  writeArtifacts(
    nextArtifacts,
  );
}

/* -------------------------------------------------------------------------- */
/*                              Get One                                       */
/* -------------------------------------------------------------------------- */

export function getIntelligenceArtifact(
  artifactId: string,
): IntelligenceArtifact | null {
  const artifacts =
    getIntelligenceArtifacts();

  return (
    artifacts.find(
      (artifact) =>
        artifact.artifactId ===
        artifactId,
    ) ?? null
  );
}

/* -------------------------------------------------------------------------- */
/*                         Status Management                                  */
/* -------------------------------------------------------------------------- */

export function updateIntelligenceArtifactStatus(
  artifactId: string,
  status: IntelligenceArtifactStatus,
): IntelligenceArtifact | null {
  const artifacts =
    getIntelligenceArtifacts();

  const index =
    artifacts.findIndex(
      (artifact) =>
        artifact.artifactId ===
        artifactId,
    );

  if (index < 0) {
    return null;
  }

  const currentArtifact =
    artifacts[index];

  const currentStatus =
    currentArtifact.status ??
    "Registered";

  if (
    !canTransitionArtifactStatus(
      currentStatus,
      status,
    )
  ) {
    return null;
  }

  if (
    currentStatus === status
  ) {
    return currentArtifact;
  }

  const nextArtifacts =
    [...artifacts];

  const updatedArtifact:
    IntelligenceArtifact = {
      ...currentArtifact,
      status,
    };

  nextArtifacts[index] =
    updatedArtifact;

  writeArtifacts(
    nextArtifacts,
  );

  return updatedArtifact;
}

/* -------------------------------------------------------------------------- */
/*                       Lifecycle Governance                                 */
/* -------------------------------------------------------------------------- */

const ARTIFACT_STATUS_TRANSITIONS: Record<
  IntelligenceArtifactStatus,
  readonly IntelligenceArtifactStatus[]
> = {
  Draft: [
    "Registered",
    "Archived",
  ],

  Registered: [
    "Published",
    "Archived",
  ],

  Published: [
    "Superseded",
    "Archived",
  ],

  Superseded: [
    "Archived",
  ],

  Archived: [],
};

export function canTransitionArtifactStatus(
  from: IntelligenceArtifactStatus,
  to: IntelligenceArtifactStatus,
): boolean {
  if (from === to) {
    return true;
  }

  return ARTIFACT_STATUS_TRANSITIONS[
    from
  ].includes(to);
}

export function getAllowedArtifactStatusTransitions(
  status: IntelligenceArtifactStatus,
): readonly IntelligenceArtifactStatus[] {
  return ARTIFACT_STATUS_TRANSITIONS[
    status
  ];
}
/* -------------------------------------------------------------------------- */
/*                              Publish                                       */
/* -------------------------------------------------------------------------- */

export function publishIntelligenceArtifact(
  artifactId: string,
): IntelligenceArtifact | null {
  return updateIntelligenceArtifactStatus(
    artifactId,
    "Published",
  );
}

/* -------------------------------------------------------------------------- */
/*                              Archive                                       */
/* -------------------------------------------------------------------------- */

export function archiveIntelligenceArtifact(
  artifactId: string,
): IntelligenceArtifact | null {
  return updateIntelligenceArtifactStatus(
    artifactId,
    "Archived",
  );
}

/* -------------------------------------------------------------------------- */
/*                             Supersede                                      */
/* -------------------------------------------------------------------------- */

export function supersedeIntelligenceArtifact(
  artifactId: string,
): IntelligenceArtifact | null {
  return updateIntelligenceArtifactStatus(
    artifactId,
    "Superseded",
  );
}

/* -------------------------------------------------------------------------- */
/*                         Next Version                                       */
/* -------------------------------------------------------------------------- */

export function getNextArtifactVersion(
  artifact: IntelligenceArtifact,
  bump: IntelligenceArtifactVersionBump,
): IntelligenceArtifact["version"] {
  return incrementArtifactVersion(
    artifact.version,
    bump,
  );
}

/* -------------------------------------------------------------------------- */
/*                       Revision Lookup                                      */
/* -------------------------------------------------------------------------- */

function findArtifactRevision(
  artifact: IntelligenceArtifact,
  version: IntelligenceArtifact["version"],
): IntelligenceArtifact | null {
  const artifacts =
    getIntelligenceArtifacts();

  return (
    artifacts.find(
      (item) =>
        item.sourceSnapshotId ===
          artifact.sourceSnapshotId &&
        item.artifactType ===
          artifact.artifactType &&
        item.version ===
          version,
    ) ?? null
  );
}

/* -------------------------------------------------------------------------- */
/*                       Create Revision                                      */
/* -------------------------------------------------------------------------- */

export function createArtifactRevision(
  artifactId: string,
  bump: IntelligenceArtifactVersionBump,
): IntelligenceArtifact | null {
  const current =
    getIntelligenceArtifact(
      artifactId,
    );

  if (!current) {
    return null;
  }

  const nextVersion =
    getNextArtifactVersion(
      current,
      bump,
    );

  /*
   * Prevent accidental duplicate revisions.
   */
  const existingRevision =
    findArtifactRevision(
      current,
      nextVersion,
    );

  if (existingRevision) {
    return existingRevision;
  }

  const generatedAt =
    new Date().toISOString();

  /*
   * Preserve the original artifact identity
   * while making the revision uniquely addressable.
   */
  const revisedArtifactId =
    `${current.artifactId}-v${nextVersion}`;

  const {
  integrity: _integrity,
  signature: _signature,
  ...currentArtifact
} = current;

const revisedArtifact:
  IntelligenceArtifact = {
    ...currentArtifact,

    artifactId:
      revisedArtifactId,

    version:
      nextVersion,

    previousArtifactId:
      current.artifactId,

    status:
      "Registered",

    generatedAt,

    metadata: {
      ...current.metadata,

      generatedAt,
    },
  };

  /*
   * Supersede the current revision.
   */
  const nextArtifacts:
    IntelligenceArtifact[] =
      getIntelligenceArtifacts().map(
        (
          artifact,
        ): IntelligenceArtifact => {
          if (
            artifact.artifactId ===
            current.artifactId
          ) {
            return {
              ...artifact,

              status:
                "Superseded" satisfies
                IntelligenceArtifactStatus,
            };
          }

          return artifact;
        },
      );

  /*
   * Register the new revision.
   */
  nextArtifacts.unshift(
    revisedArtifact,
  );

  writeArtifacts(
    nextArtifacts,
  );

  return revisedArtifact;
}

/* -------------------------------------------------------------------------- */
/*                       Artifact Lineage                                     */
/* -------------------------------------------------------------------------- */

/**
 * Returns the complete ancestry of an artifact,
 * starting at the earliest known revision and ending
 * at the requested artifact.
 *
 * Example:
 *
 * v1.0.0 → v1.0.1 → v1.1.0
 */
export function getArtifactLineage(
  artifactId: string,
): IntelligenceArtifact[] {
  const artifacts =
    getIntelligenceArtifacts();

  const startingArtifact =
    artifacts.find(
      (artifact) =>
        artifact.artifactId ===
        artifactId,
    );

  if (!startingArtifact) {
    return [];
  }

  const lineage:
    IntelligenceArtifact[] = [
      startingArtifact,
    ];

  let current =
    startingArtifact;

  const visited =
    new Set<string>();

  visited.add(
    current.artifactId,
  );

  while (
    current.previousArtifactId
  ) {
    const previous =
      artifacts.find(
        (artifact) =>
          artifact.artifactId ===
          current.previousArtifactId,
      );

    if (!previous) {
      break;
    }

    /*
     * Protect against malformed/cyclic
     * localStorage data.
     */
    if (
      visited.has(
        previous.artifactId,
      )
    ) {
      break;
    }

    lineage.push(
      previous,
    );

    visited.add(
      previous.artifactId,
    );

    current =
      previous;
  }

  return lineage.reverse();
}

/* -------------------------------------------------------------------------- */
/*                       Artifact Descendants                                 */
/* -------------------------------------------------------------------------- */

/**
 * Returns all revisions that descend from
 * the supplied artifact.
 *
 * Supports future branching rather than
 * assuming a strictly linear history.
 */
export function getArtifactDescendants(
  artifactId: string,
): IntelligenceArtifact[] {
  const artifacts =
    getIntelligenceArtifacts();

  const descendants:
    IntelligenceArtifact[] = [];

  const queue =
    [artifactId];

  const visited =
    new Set<string>();

  visited.add(
    artifactId,
  );

  while (
    queue.length > 0
  ) {
    const currentId =
      queue.shift();

    if (!currentId) {
      continue;
    }

    const children =
      artifacts.filter(
        (artifact) =>
          artifact.previousArtifactId ===
          currentId,
      );

    for (
      const child of children
    ) {
      if (
        visited.has(
          child.artifactId,
        )
      ) {
        continue;
      }

      visited.add(
        child.artifactId,
      );

      descendants.push(
        child,
      );

      queue.push(
        child.artifactId,
      );
    }
  }

  return descendants;
}

/* -------------------------------------------------------------------------- */
/*                       Complete Artifact Family                             */
/* -------------------------------------------------------------------------- */

/**
 * Returns the complete artifact family:
 *
 * root → descendants
 *
 * The result is sorted chronologically
 * by generatedAt.
 */
export function getArtifactFamily(
  artifactId: string,
): IntelligenceArtifact[] {
  const lineage =
    getArtifactLineage(
      artifactId,
    );

  if (
    lineage.length === 0
  ) {
    return [];
  }

  const root =
    lineage[0];

  const descendants =
    getArtifactDescendants(
      root.artifactId,
    );

  const combined = [
    ...lineage,
    ...descendants,
  ];

  const unique =
    new Map<
      string,
      IntelligenceArtifact
    >();

  for (
    const artifact of combined
  ) {
    unique.set(
      artifact.artifactId,
      artifact,
    );
  }

  return Array.from(
    unique.values(),
  ).sort(
    (a, b) =>
      a.generatedAt.localeCompare(
        b.generatedAt,
      ),
  );
}

/* -------------------------------------------------------------------------- */
/*                              Delete                                        */
/* -------------------------------------------------------------------------- */

export function deleteIntelligenceArtifact(
  artifactId: string,
): void {
  const artifacts =
    getIntelligenceArtifacts();

  const filtered =
    artifacts.filter(
      (artifact) =>
        artifact.artifactId !==
        artifactId,
    );

  writeArtifacts(
    filtered,
  );
}

/* -------------------------------------------------------------------------- */
/*                              Clear                                         */
/* -------------------------------------------------------------------------- */

export function clearIntelligenceArtifacts(): void {
  writeArtifacts([]);
}

/* -------------------------------------------------------------------------- */
/*                            Subscription                                    */
/* -------------------------------------------------------------------------- */

export function subscribeToIntelligenceArtifacts(
  listener: ArtifactListener,
): () => void {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
}

export async function fingerprintIntelligenceArtifact(
  artifactId: string,
): Promise<IntelligenceArtifact | null> {
  const artifact =
    getIntelligenceArtifact(
      artifactId,
    );

  if (!artifact) {
    return null;
  }

  const integrity =
    await createArtifactIntegrity(
      artifact,
    );

  const updatedArtifact: IntelligenceArtifact =
    {
      ...artifact,

      integrity,
    };

  saveIntelligenceArtifact(
    updatedArtifact,
  );

  return updatedArtifact;
}

export async function verifyIntelligenceArtifact(
  artifactId: string,
): Promise<boolean> {
  const artifact =
    getIntelligenceArtifact(
      artifactId,
    );

  if (!artifact) {
    return false;
  }

  return verifyArtifactIntegrity(
    artifact,
  );
}

/* -------------------------------------------------------------------------- */
/*                         Artifact Signing                                   */
/* -------------------------------------------------------------------------- */

export async function signIntelligenceArtifact(
  artifactId: string,
  privateKey: CryptoKey,
  keyId: string,
): Promise<IntelligenceArtifact | null> {
  const artifact =
    getIntelligenceArtifact(
      artifactId,
    );

  if (!artifact) {
    return null;
  }

  const signature =
    await createArtifactSignature(
      artifact,
      privateKey,
      keyId,
    );

  const signedArtifact:
    IntelligenceArtifact = {
    ...artifact,
    signature,
  };

  saveIntelligenceArtifact(
    signedArtifact,
  );

  return signedArtifact;
}

/* -------------------------------------------------------------------------- */
/*                         Signature Presence                                 */
/* -------------------------------------------------------------------------- */

export function hasArtifactSignature(
  artifactId: string,
): boolean {
  const artifact =
    getIntelligenceArtifact(
      artifactId,
    );

  return Boolean(
    artifact?.signature,
  );
}

/* -------------------------------------------------------------------------- */
/*                         Artifact Trust                                     */
/* -------------------------------------------------------------------------- */

export async function getIntelligenceArtifactTrustStatus(
  artifactId: string,
) {
  const artifact =
    getIntelligenceArtifact(
      artifactId,
    );

  if (!artifact) {
    return null;
  }

  return getArtifactTrustStatus(
    artifact,
  );
}