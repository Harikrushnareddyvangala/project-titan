import type { ResearchProvenanceEvent } from "@/types/research";

export interface ResearchProvenanceRepositoryDependencies {
  loadResearchProvenanceEvents(): ResearchProvenanceEvent[];
  saveResearchProvenanceEvents(
    events: ResearchProvenanceEvent[],
  ): void;
  createId(prefix: string): string;
  now(): string;
}

export function getResearchProvenanceEvents(
  dependencies: ResearchProvenanceRepositoryDependencies,
): ResearchProvenanceEvent[] {
  return dependencies.loadResearchProvenanceEvents();
}

export function saveResearchProvenanceEvent(
  event: ResearchProvenanceEvent,
  dependencies: ResearchProvenanceRepositoryDependencies,
): void {
  const events = getResearchProvenanceEvents(dependencies);

  const alreadyExists = events.some(
    (item) => item.id === event.id,
  );

  if (alreadyExists) {
    return;
  }

  events.unshift(event);

  dependencies.saveResearchProvenanceEvents(events);
}

export function createResearchProvenanceEvent(
  input: Omit<ResearchProvenanceEvent, "id" | "timestamp">,
  dependencies: ResearchProvenanceRepositoryDependencies,
): ResearchProvenanceEvent {
  const event: ResearchProvenanceEvent = {
    ...input,
    id: dependencies.createId("research-provenance"),
    timestamp: dependencies.now(),
  };

  saveResearchProvenanceEvent(event, dependencies);

  return event;
}

export function createResearchProvenanceRepository(
  dependencies: ResearchProvenanceRepositoryDependencies,
) {
  return {
    getResearchProvenanceEvents: () =>
      getResearchProvenanceEvents(dependencies),

    saveResearchProvenanceEvent: (
      event: ResearchProvenanceEvent,
    ): void =>
      saveResearchProvenanceEvent(event, dependencies),

    createResearchProvenanceEvent: (
      input: Omit<ResearchProvenanceEvent, "id" | "timestamp">,
    ): ResearchProvenanceEvent =>
      createResearchProvenanceEvent(input, dependencies),
  };
}
