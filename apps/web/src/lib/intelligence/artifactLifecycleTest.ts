import type {
  IntelligenceArtifactStatus,
} from "@/types/intelligence";

import {
  canTransitionArtifactStatus,
  getAllowedArtifactStatusTransitions,
} from "./artifactRegistry";

/* -------------------------------------------------------------------------- */
/*                         Test Result                                        */
/* -------------------------------------------------------------------------- */

export interface ArtifactLifecycleTestResult {
  legalTransitionsPassed: boolean;
  illegalTransitionsPassed: boolean;
  allPassed: boolean;
  failures: string[];
}

/* -------------------------------------------------------------------------- */
/*                         Assertions                                         */
/* -------------------------------------------------------------------------- */

function assertTransition(
  failures: string[],
  from: IntelligenceArtifactStatus,
  to: IntelligenceArtifactStatus,
  expected: boolean,
): void {
  const actual =
    canTransitionArtifactStatus(
      from,
      to,
    );

  if (actual !== expected) {
    failures.push(
      `${from} → ${to}: expected ${expected}, received ${actual}`,
    );
  }
}

/* -------------------------------------------------------------------------- */
/*                         Runtime Test                                       */
/* -------------------------------------------------------------------------- */

export function runArtifactLifecycleTest():
  ArtifactLifecycleTestResult {
  const failures: string[] = [];

  /* ------------------------------------------------------------------------ */
  /*                         Legal transitions                               */
  /* ------------------------------------------------------------------------ */

  const legalTransitions:
    Array<
      [
        IntelligenceArtifactStatus,
        IntelligenceArtifactStatus,
      ]
    > = [
    ["Draft", "Registered"],
    ["Draft", "Archived"],

    ["Registered", "Published"],
    ["Registered", "Archived"],

    ["Published", "Superseded"],
    ["Published", "Archived"],

    ["Superseded", "Archived"],
  ];

  for (
    const [
      from,
      to,
    ] of legalTransitions
  ) {
    assertTransition(
      failures,
      from,
      to,
      true,
    );
  }

  const legalTransitionsPassed =
    failures.length === 0;

  /* ------------------------------------------------------------------------ */
  /*                         Illegal transitions                             */
  /* ------------------------------------------------------------------------ */

  const illegalFailures: string[] = [];

  const illegalTransitions:
    Array<
      [
        IntelligenceArtifactStatus,
        IntelligenceArtifactStatus,
      ]
    > = [
    ["Draft", "Published"],
    ["Draft", "Superseded"],

    ["Registered", "Superseded"],

    ["Published", "Draft"],
    ["Published", "Registered"],

    ["Superseded", "Draft"],
    ["Superseded", "Registered"],
    ["Superseded", "Published"],

    ["Archived", "Draft"],
    ["Archived", "Registered"],
    ["Archived", "Published"],
    ["Archived", "Superseded"],
  ];

  for (
    const [
      from,
      to,
    ] of illegalTransitions
  ) {
    const actual =
      canTransitionArtifactStatus(
        from,
        to,
      );

    if (actual !== false) {
      illegalFailures.push(
        `${from} → ${to}: expected false, received ${actual}`,
      );
    }
  }

  const illegalTransitionsPassed =
    illegalFailures.length === 0;

  failures.push(
    ...illegalFailures,
  );

  /* ------------------------------------------------------------------------ */
  /*                         Same-state transitions                           */
  /* ------------------------------------------------------------------------ */

  const statuses:
    IntelligenceArtifactStatus[] = [
    "Draft",
    "Registered",
    "Published",
    "Superseded",
    "Archived",
  ];

  for (
    const status of statuses
  ) {
    assertTransition(
      failures,
      status,
      status,
      true,
    );
  }

  /* ------------------------------------------------------------------------ */
  /*                         Allowed transition sanity                        */
  /* ------------------------------------------------------------------------ */

  const expectedAllowed:
    Record<
      IntelligenceArtifactStatus,
      IntelligenceArtifactStatus[]
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

  for (
    const status of statuses
  ) {
    const actual =
      getAllowedArtifactStatusTransitions(
        status,
      );

    const expected =
      expectedAllowed[
        status
      ];

    if (
      actual.length !==
      expected.length ||
      actual.some(
        (value) =>
          !expected.includes(
            value,
          ),
      )
    ) {
      failures.push(
        `${status}: allowed transition list does not match expected lifecycle policy`,
      );
    }
  }

  return {
    legalTransitionsPassed,
    illegalTransitionsPassed,
    allPassed:
      failures.length === 0,
    failures,
  };
}