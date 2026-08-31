import { describe, expect, it } from "vitest";

import type {
  ResearchFinding,
  ResearchFindingValidation,
  ResearchProvenanceEvent,
} from "@/types/research";

import {
  getLatestResearchProvenanceEvent,
  getResearchProvenanceEventsByEntity,
  getResearchProvenanceEventsByEventType,
  getResearchProvenanceEventsByInvestigation,
  getResearchProvenanceEventsByInvestigationAndEntity,
  getResearchProvenanceEventsByInvestigationChronological,
  getResearchProvenanceEventsChronological,
  getResearchProvenanceInvestigationSummary,
  getResearchProvenanceTimeline,
  getResearchProvenanceTimelineByInvestigation,
  createResearchProvenanceEventService,
} from "../events";

const investigationId = "investigation-events-001";

const events: ResearchProvenanceEvent[] = [
  {
    id: "event-003",
    investigationId,
    entityType: "Finding",
    entityId: "finding-001",
    eventType: "Updated",
    timestamp: "2026-01-03T00:00:00.000Z",
    reason: "Finding updated",
  },
  {
    id: "event-001",
    investigationId,
    entityType: "Investigation",
    entityId: investigationId,
    eventType: "Created",
    timestamp: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "event-002",
    investigationId,
    entityType: "FindingValidation",
    entityId: "validation-001",
    eventType: "Validated",
    timestamp: "2026-01-02T00:00:00.000Z",
    reason: "Validation completed",
  },
  {
    id: "event-004",
    investigationId: "investigation-events-002",
    entityType: "Investigation",
    entityId: "investigation-events-002",
    eventType: "Created",
    timestamp: "2026-01-04T00:00:00.000Z",
  },
];

const validation: ResearchFindingValidation = {
  id: "validation-001",
  findingId: "finding-001",
  status: "Validated",
  decision: "Accept",
  rationale: "The evidence supports the finding.",
  confidenceAtValidation: 0.9,
  evidenceAssessmentCount: 1,
  supportingEvidenceCount: 1,
  contradictingEvidenceCount: 0,
  validator: "Researcher",
  validatedAt: "2026-01-02T00:00:00.000Z",
  createdAt: "2026-01-02T00:00:00.000Z",
  updatedAt: "2026-01-02T00:00:00.000Z",
};

const finding: ResearchFinding = {
  id: "finding-001",
  statement: "The finding is supported.",
  evidenceAssessments: [],
  confidence: 0.9,
  validationIds: [validation.id],
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-03T00:00:00.000Z",
};

const dependencies = {
  getResearchProvenanceEvents: () => events,
  getResearchFindingValidations: () => [validation],
  getResearchFindings: () => [finding],
  validateResearchProvenanceIntegrity: () => ({
    issues: [],
  }),
};

describe("research provenance events", () => {
  it("filters events by investigation", () => {
    expect(
      getResearchProvenanceEventsByInvestigation(
        events,
        investigationId,
      ),
    ).toHaveLength(3);
  });

  it("filters events by entity", () => {
    expect(
      getResearchProvenanceEventsByEntity(
        events,
        "Finding",
        "finding-001",
      ),
    ).toHaveLength(1);
  });

  it("filters events by investigation and entity", () => {
    expect(
      getResearchProvenanceEventsByInvestigationAndEntity(
        events,
        investigationId,
        "FindingValidation",
        "validation-001",
      ),
    ).toHaveLength(1);
  });

  it("returns chronological events without mutating the source collection", () => {
    const chronological =
      getResearchProvenanceEventsChronological(events);

    expect(chronological.map((event) => event.id)).toEqual([
      "event-001",
      "event-002",
      "event-003",
      "event-004",
    ]);

    expect(events.map((event) => event.id)).toEqual([
      "event-003",
      "event-001",
      "event-002",
      "event-004",
    ]);
  });

  it("projects validation events into timeline items", () => {
    const timeline =
      getResearchProvenanceTimeline(dependencies);

    const validationItem = timeline.find(
      (item) => item.eventId === "event-002",
    );

    expect(validationItem).toBeDefined();
    expect(validationItem?.findingId).toBe("finding-001");
    expect(validationItem?.findingStatement).toBe(
      "The finding is supported.",
    );
    expect(validationItem?.validationId).toBe("validation-001");
    expect(validationItem?.validator).toBe("Researcher");
    expect(validationItem?.decision).toBe("Accept");
  });

  it("projects an investigation-specific timeline chronologically", () => {
    const timeline =
      getResearchProvenanceTimelineByInvestigation(
        investigationId,
        dependencies,
      );

    expect(timeline.map((item) => item.eventId)).toEqual([
      "event-001",
      "event-002",
      "event-003",
    ]);
  });

  it("builds an investigation provenance summary", () => {
    const summary =
      getResearchProvenanceInvestigationSummary(
        investigationId,
        dependencies,
      );

    expect(summary.investigationId).toBe(
      investigationId,
    );
    expect(summary.eventCount).toBe(3);
    expect(summary.firstEventTimestamp).toBe(
      "2026-01-01T00:00:00.000Z",
    );
    expect(summary.latestEventTimestamp).toBe(
      "2026-01-03T00:00:00.000Z",
    );
    expect(summary.latestEventType).toBe("Updated");
    expect(summary.latestEntityType).toBe("Finding");
    expect(summary.latestEntityId).toBe("finding-001");
    expect(summary.validationEventCount).toBe(1);
    expect(summary.statusChangeEventCount).toBe(0);
    expect(summary.valid).toBe(true);
  });

  it("reports investigation provenance integrity issues in the summary", () => {
    const summary =
      getResearchProvenanceInvestigationSummary(
        investigationId,
        {
          ...dependencies,
          validateResearchProvenanceIntegrity: () => ({
            issues: [
              {
                investigationId,
                code: "TEST_ISSUE",
              },
            ],
          }),
        },
      );

    expect(summary.valid).toBe(false);
  });

  it("filters provenance events by event type", () => {
    expect(
      getResearchProvenanceEventsByEventType(
        events,
        "Created",
      ),
    ).toHaveLength(2);
  });

  it("returns investigation events chronologically", () => {
    const chronological =
      getResearchProvenanceEventsByInvestigationChronological(
        events,
        investigationId,
      );

    expect(chronological.map((event) => event.id)).toEqual([
      "event-001",
      "event-002",
      "event-003",
    ]);

    expect(events.map((event) => event.id)).toEqual([
      "event-003",
      "event-001",
      "event-002",
      "event-004",
    ]);
  });

  it("returns the latest event for an entity", () => {
    const latest = getLatestResearchProvenanceEvent(
      events,
      "Finding",
      "finding-001",
    );

    expect(latest?.id).toBe("event-003");
    expect(latest?.timestamp).toBe(
      "2026-01-03T00:00:00.000Z",
    );
  });

  it("returns null when no event exists for an entity", () => {
    expect(
      getLatestResearchProvenanceEvent(
        events,
        "Conclusion",
        "conclusion-001",
      ),
    ).toBeNull();
  });

  it("exposes provenance query operations through the service factory", () => {
    const service =
      createResearchProvenanceEventService(dependencies);

    expect(
      service.getResearchProvenanceEventsByInvestigation(
        events,
        investigationId,
      ),
    ).toHaveLength(3);

    expect(
      service.getResearchProvenanceEventsChronological(events)
        .map((event) => event.id),
    ).toEqual([
      "event-001",
      "event-002",
      "event-003",
      "event-004",
    ]);

    expect(
      service.getLatestResearchProvenanceEvent(
        events,
        "Finding",
        "finding-001",
      )?.id,
    ).toBe("event-003");
  });

});