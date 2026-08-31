import type { ResearchExperiment } from "@/types/research";

export interface ResearchExperimentRepositoryDependencies {
  loadResearchExperiments(): ResearchExperiment[];
  saveResearchExperiments(
    experiments: ResearchExperiment[],
  ): void;
}

function normalizeResearchExperiment(
  experiment: ResearchExperiment,
): ResearchExperiment {
  return {
    ...experiment,
    lifecycle: Array.isArray(experiment.lifecycle)
      ? experiment.lifecycle
      : [],
  };
}

export function getResearchExperiments(
  dependencies: ResearchExperimentRepositoryDependencies,
): ResearchExperiment[] {
  return dependencies
    .loadResearchExperiments()
    .map(normalizeResearchExperiment);
}

export function saveResearchExperiment(
  experiment: ResearchExperiment,
  dependencies: ResearchExperimentRepositoryDependencies,
): void {
  const experiments = getResearchExperiments(dependencies);
  const nextExperiments = [...experiments];

  const existingIndex = nextExperiments.findIndex(
    (item) => item.id === experiment.id,
  );

  if (existingIndex >= 0) {
    nextExperiments[existingIndex] = experiment;
  } else {
    nextExperiments.unshift(experiment);
  }

  dependencies.saveResearchExperiments(nextExperiments);
}

export function createResearchExperimentRepository(
  dependencies: ResearchExperimentRepositoryDependencies,
) {
  return {
    getResearchExperiments: (): ResearchExperiment[] =>
      getResearchExperiments(dependencies),

    saveResearchExperiment: (
      experiment: ResearchExperiment,
    ): void =>
      saveResearchExperiment(
        experiment,
        dependencies,
      ),
  };
}
