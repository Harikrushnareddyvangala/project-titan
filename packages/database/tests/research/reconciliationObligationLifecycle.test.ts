import { describe, expect, it } from "vitest";

import {
  canTransitionResearchReconciliationObligation,
  type ResearchReconciliationObligationStatus,
} from "../../src/research/reconciliationObligationLifecycle.js";

describe("research reconciliation obligation lifecycle", () => {
  const statuses: ResearchReconciliationObligationStatus[] = [
    "Open",
    "In Progress",
    "Resolved",
    "Abandoned",
    "Superseded",
  ];

  it("accepts same-state transitions", () => {
    for (const status of statuses) {
      expect(canTransitionResearchReconciliationObligation(status, status)).toBe(true);
    }
  });

  it("allows Open to transition to active or terminal outcomes", () => {
    expect(canTransitionResearchReconciliationObligation("Open", "In Progress")).toBe(true);
    expect(canTransitionResearchReconciliationObligation("Open", "Abandoned")).toBe(true);
    expect(canTransitionResearchReconciliationObligation("Open", "Superseded")).toBe(true);
  });

  it("allows In Progress to transition to resolved or terminal outcomes", () => {
    expect(canTransitionResearchReconciliationObligation("In Progress", "Resolved")).toBe(true);
    expect(canTransitionResearchReconciliationObligation("In Progress", "Abandoned")).toBe(true);
    expect(canTransitionResearchReconciliationObligation("In Progress", "Superseded")).toBe(true);
  });

  it("rejects invalid transitions from Open", () => {
    expect(canTransitionResearchReconciliationObligation("Open", "Resolved")).toBe(false);
  });

  it("rejects invalid transitions from In Progress", () => {
    expect(canTransitionResearchReconciliationObligation("In Progress", "Open")).toBe(false);
  });

  it("keeps terminal states terminal", () => {
    const terminalStatuses: ResearchReconciliationObligationStatus[] = [
      "Resolved",
      "Abandoned",
      "Superseded",
    ];

    for (const from of terminalStatuses) {
      for (const to of statuses) {
        if (from === to) {
          continue;
        }

        expect(canTransitionResearchReconciliationObligation(from, to)).toBe(false);
      }
    }
  });
});
