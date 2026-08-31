import type {
  ResearchExperiment,
  ResearchExperimentLifecycleEvent,
  ResearchStatus,
} from "@/types/research";

export interface ResearchExperimentLifecycleDependencies {
  saveResearchExperiment: (
    experiment: ResearchExperiment,
  ) => void;
  createResearchProvenanceEvent: (event: {
    investigationId: string;
    entityType: "Experiment";
    entityId: string;
    eventType: "StatusChanged";
    fromStatus: ResearchStatus;
    toStatus: ResearchStatus;
    reason?: string;
  }) => void;
  createId: (prefix: string) => string;
  now: () => string;
}

const RESEARCH_EXPERIMENT_TRANSITIONS: Record<
  ResearchStatus,
  ResearchStatus[]
> = {
  Draft: ["Investigating"],
  Investigating: ["Evidence Collected"],
  "Evidence Collected": ["Finding Produced"],
  "Finding Produced": ["Validated"],
  Validated: ["Published"],
  Published: [],
};

export function canTransitionResearchExperiment(
  from: ResearchStatus,
  to: ResearchStatus,
): boolean {
  return RESEARCH_EXPERIMENT_TRANSITIONS[from]?.includes(to) ?? false;
}

export function transitionResearchExperiment(
  experiment: ResearchExperiment,
  to: ResearchStatus,
  reason: string | undefined,
  dependencies: ResearchExperimentLifecycleDependencies,
): ResearchExperiment | null {
  if (experiment.status === to) {
    return experiment;
  }

  if (!canTransitionResearchExperiment(experiment.status, to)) {
    return null;
  }

  const now = dependencies.now();

  const lifecycleEvent: ResearchExperimentLifecycleEvent = {
    id: dependencies.createId("experiment-lifecycle"),
    from: experiment.status,
    to,
    reason: reason?.trim() || undefined,
    timestamp: now,
  };

  const updatedExperiment: ResearchExperiment = {
    ...experiment,
    status: to,
    lifecycle: [...experiment.lifecycle, lifecycleEvent],
    updatedAt: now,
  };

  dependencies.saveResearchExperiment(updatedExperiment);

  dependencies.createResearchProvenanceEvent({
    investigationId: experiment.investigationId,
    entityType: "Experiment",
    entityId: experiment.id,
    eventType: "StatusChanged",
    fromStatus: experiment.status,
    toStatus: to,
    reason: reason?.trim() || undefined,
  });

  return updatedExperiment;
}

export function createResearchExperimentLifecycleService(
  dependencies: ResearchExperimentLifecycleDependencies,
) {
  return {
    canTransitionResearchExperiment: (
      from: ResearchStatus,
      to: ResearchStatus,
    ): boolean =>
      canTransitionResearchExperiment(
        from,
        to,
      ),

    transitionResearchExperiment: (
      experiment: ResearchExperiment,
      to: ResearchStatus,
      reason?: string,
    ): ResearchExperiment | null =>
      transitionResearchExperiment(
        experiment,
        to,
        reason,
        dependencies,
      ),
  };
}