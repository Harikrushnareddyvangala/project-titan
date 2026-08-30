import type {
  ResearchFinding,
  ResearchFindingValidation,
  ResearchProvenanceEntityType,
  ResearchProvenanceEvent,
  ResearchProvenanceEventType,
  ResearchProvenanceInvestigationSummary,
  ResearchProvenanceTimelineItem,
} from "@/types/research";

export interface ResearchProvenanceEventDependencies {
  getResearchProvenanceEvents(): ResearchProvenanceEvent[];

  getResearchFindingValidations(): ResearchFindingValidation[];

  getResearchFindings(): ResearchFinding[];

  validateResearchProvenanceIntegrity(): {
    issues: Array<{
      investigationId: string;
    }>;
  };
}

export function getResearchProvenanceEventsByInvestigation(
  events: ResearchProvenanceEvent[],
  investigationId: string,
): ResearchProvenanceEvent[] {
  return events.filter((event) => event.investigationId === investigationId);
}

export function getResearchProvenanceEventsByEntity(
  events: ResearchProvenanceEvent[],
  entityType: ResearchProvenanceEntityType,
  entityId: string,
): ResearchProvenanceEvent[] {
  return events.filter(
    (event) =>
      event.entityType === entityType &&
      event.entityId === entityId,
  );
}

export function getResearchProvenanceEventsByInvestigationAndEntity(
  events: ResearchProvenanceEvent[],
  investigationId: string,
  entityType: ResearchProvenanceEntityType,
  entityId: string,
): ResearchProvenanceEvent[] {
  return events.filter(
    (event) =>
      event.investigationId === investigationId &&
      event.entityType === entityType &&
      event.entityId === entityId,
  );
}

export function getResearchProvenanceEventsChronological(
  events: ResearchProvenanceEvent[],
): ResearchProvenanceEvent[] {
  return [...events].sort(
    (a, b) =>
      new Date(a.timestamp).getTime() -
      new Date(b.timestamp).getTime(),
  );
}

function createTimelineItem(
  event: ResearchProvenanceEvent,
  dependencies: ResearchProvenanceEventDependencies,
): ResearchProvenanceTimelineItem {
  const validation =
    event.entityType === "FindingValidation"
      ? dependencies
          .getResearchFindingValidations()
          .find((item) => item.id === event.entityId)
      : undefined;

  const finding = validation
    ? dependencies
        .getResearchFindings()
        .find((item) => item.id === validation.findingId)
    : undefined;

  const statusDescription =
    event.fromStatus && event.toStatus
      ? `${event.fromStatus} → ${event.toStatus}`
      : undefined;

  return {
    eventId: event.id,
    investigationId: event.investigationId,
    entityType: event.entityType,
    entityId: event.entityId,
    eventType: event.eventType,
    findingId: finding?.id,
    findingStatement: finding?.statement,
    validationId: validation?.id,
    validator: validation?.validator,
    decision: validation?.decision,
    title: `${event.entityType} ${event.eventType}`,
    description:
      statusDescription ??
      event.reason ??
      `${event.entityType} ${event.eventType} event.`,
    fromStatus: event.fromStatus,
    toStatus: event.toStatus,
    reason: event.reason,
    actor: event.actor,
    timestamp: event.timestamp,
    metadata: event.metadata,
  };
}

export function getResearchProvenanceTimeline(
  dependencies: ResearchProvenanceEventDependencies,
): ResearchProvenanceTimelineItem[] {
  return getResearchProvenanceEventsChronological(
    dependencies.getResearchProvenanceEvents(),
  ).map((event) => createTimelineItem(event, dependencies));
}

export function getResearchProvenanceTimelineByInvestigation(
  investigationId: string,
  dependencies: ResearchProvenanceEventDependencies,
): ResearchProvenanceTimelineItem[] {
  return getResearchProvenanceEventsChronological(
    getResearchProvenanceEventsByInvestigation(
      dependencies.getResearchProvenanceEvents(),
      investigationId,
    ),
  ).map((event) => createTimelineItem(event, dependencies));
}

export function getResearchProvenanceInvestigationSummary(
  investigationId: string,
  dependencies: ResearchProvenanceEventDependencies,
): ResearchProvenanceInvestigationSummary {
  const events = getResearchProvenanceEventsChronological(
    getResearchProvenanceEventsByInvestigation(
      dependencies.getResearchProvenanceEvents(),
      investigationId,
    ),
  );

  const latest =
    events.length > 0 ? events[events.length - 1] : undefined;

  const validationEventCount = events.filter(
    (event) =>
      event.entityType === "FindingValidation" ||
      event.eventType === "Validated" ||
      event.eventType === "Rejected" ||
      event.eventType === "RevisionRequested" ||
      event.eventType === "Accepted",
  ).length;

  const statusChangeEventCount = events.filter(
    (event) => event.eventType === "StatusChanged",
  ).length;

  return {
    investigationId,
    eventCount: events.length,
    firstEventTimestamp: events[0]?.timestamp,
    latestEventTimestamp: latest?.timestamp,
    latestEventType: latest?.eventType,
    latestEntityType: latest?.entityType,
    latestEntityId: latest?.entityId,
    validationEventCount,
    statusChangeEventCount,
    valid:
      dependencies
        .validateResearchProvenanceIntegrity()
        .issues.filter(
          (issue) => issue.investigationId === investigationId,
        ).length === 0,
  };
}

export function getResearchProvenanceEventsByEventType(
  events: ResearchProvenanceEvent[],
  eventType: ResearchProvenanceEventType,
): ResearchProvenanceEvent[] {
  return events.filter((event) => event.eventType === eventType);
}

export function getResearchProvenanceEventsByInvestigationChronological(
  events: ResearchProvenanceEvent[],
  investigationId: string,
): ResearchProvenanceEvent[] {
  return getResearchProvenanceEventsChronological(
    getResearchProvenanceEventsByInvestigation(events, investigationId),
  );
}

export function getLatestResearchProvenanceEvent(
  events: ResearchProvenanceEvent[],
  entityType: ResearchProvenanceEntityType,
  entityId: string,
): ResearchProvenanceEvent | null {
  const matchingEvents = getResearchProvenanceEventsByEntity(
    events,
    entityType,
    entityId,
  );

  if (matchingEvents.length === 0) {
    return null;
  }

  return matchingEvents.reduce((latest, event) =>
    new Date(event.timestamp).getTime() >
    new Date(latest.timestamp).getTime()
      ? event
      : latest,
  );
}
