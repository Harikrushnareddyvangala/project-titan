import { describe, expect, it, vi } from "vitest";

import type { ResearchProvenanceEvent } from "@/types/research";

import {
  createResearchProvenanceRepository,
  createResearchProvenanceEvent,
  getResearchProvenanceEvents,
  saveResearchProvenanceEvent,
} from "../repository";

const investigationId = "investigation-provenance-001";

const event: ResearchProvenanceEvent = {
  id: "event-001",
  investigationId,
  entityType: "Investigation",
  entityId: investigationId,
  eventType: "Created",
  timestamp: "2026-01-01T00:00:00.000Z",
};

describe("research provenance repository", () => {
  it("loads provenance events from persistence", () => {
    const events = [event];

    expect(
      getResearchProvenanceEvents({
        loadResearchProvenanceEvents: () => events,
        saveResearchProvenanceEvents: vi.fn(),
        createId: vi.fn(),
        now: vi.fn(),
      }),
    ).toEqual(events);
  });

  it("inserts new provenance events at the beginning", () => {
    const existingEvent: ResearchProvenanceEvent = {
      ...event,
      id: "event-existing",
    };

    const events = [existingEvent];
    const saveResearchProvenanceEvents = vi.fn();

    saveResearchProvenanceEvent(event, {
      loadResearchProvenanceEvents: () => events,
      saveResearchProvenanceEvents,
      createId: vi.fn(),
      now: vi.fn(),
    });

    expect(saveResearchProvenanceEvents).toHaveBeenCalledWith([
      event,
      existingEvent,
    ]);
  });

  it("does not persist duplicate provenance events", () => {
    const events = [event];
    const saveResearchProvenanceEvents = vi.fn();

    saveResearchProvenanceEvent(event, {
      loadResearchProvenanceEvents: () => events,
      saveResearchProvenanceEvents,
      createId: vi.fn(),
      now: vi.fn(),
    });

    expect(saveResearchProvenanceEvents).not.toHaveBeenCalled();
  });

  it("creates an event with a generated id and timestamp", () => {
    const saveResearchProvenanceEvents = vi.fn();

    const created = createResearchProvenanceEvent(
      {
        investigationId,
        entityType: "Finding",
        entityId: "finding-001",
        eventType: "Updated",
        reason: "Finding updated",
      },
      {
        loadResearchProvenanceEvents: () => [],
        saveResearchProvenanceEvents,
        createId: () => "research-provenance-001",
        now: () => "2026-01-05T00:00:00.000Z",
      },
    );

    expect(created).toEqual({
      investigationId,
      entityType: "Finding",
      entityId: "finding-001",
      eventType: "Updated",
      reason: "Finding updated",
      id: "research-provenance-001",
      timestamp: "2026-01-05T00:00:00.000Z",
    });

    expect(saveResearchProvenanceEvents).toHaveBeenCalledWith([
      created,
    ]);
  });

  it("exposes the repository operations through the factory", () => {
    const saveResearchProvenanceEvents = vi.fn();

    const repository = createResearchProvenanceRepository({
      loadResearchProvenanceEvents: () => [],
      saveResearchProvenanceEvents,
      createId: () => "research-provenance-002",
      now: () => "2026-01-06T00:00:00.000Z",
    });

    expect(repository.getResearchProvenanceEvents()).toEqual([]);

    const created = repository.createResearchProvenanceEvent({
      investigationId,
      entityType: "Finding",
      entityId: "finding-002",
      eventType: "Created",
    });

    expect(created.id).toBe("research-provenance-002");
    expect(saveResearchProvenanceEvents).toHaveBeenCalledWith([
      created,
    ]);
  });
});
