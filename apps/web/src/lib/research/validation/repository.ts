import type {
  ResearchFindingValidation,
  ResearchFindingValidationHistoryEvent,
} from "@/types/research";

export interface ResearchFindingValidationRepositoryDependencies {
  loadResearchFindingValidations(): ResearchFindingValidation[];
  saveResearchFindingValidations(
    validations: ResearchFindingValidation[],
  ): void;

  loadResearchFindingValidationHistory(): ResearchFindingValidationHistoryEvent[];
  saveResearchFindingValidationHistory(
    history: ResearchFindingValidationHistoryEvent[],
  ): void;
}

export function getResearchFindingValidations(
  dependencies: ResearchFindingValidationRepositoryDependencies,
): ResearchFindingValidation[] {
  return dependencies.loadResearchFindingValidations();
}

export function saveResearchFindingValidation(
  validation: ResearchFindingValidation,
  dependencies: ResearchFindingValidationRepositoryDependencies,
): void {
  const validations = getResearchFindingValidations(dependencies);

  const existingIndex = validations.findIndex(
    (item) => item.id === validation.id,
  );

  if (existingIndex >= 0) {
    validations[existingIndex] = validation;
  } else {
    validations.unshift(validation);
  }

  dependencies.saveResearchFindingValidations(validations);
}

export function getResearchFindingValidationHistory(
  dependencies: ResearchFindingValidationRepositoryDependencies,
): ResearchFindingValidationHistoryEvent[] {
  return dependencies.loadResearchFindingValidationHistory();
}

export function saveResearchFindingValidationHistoryEvent(
  event: ResearchFindingValidationHistoryEvent,
  dependencies: ResearchFindingValidationRepositoryDependencies,
): void {
  const history = getResearchFindingValidationHistory(dependencies);

  const alreadyExists = history.some((item) => item.id === event.id);

  if (alreadyExists) {
    return;
  }

  history.unshift(event);

  dependencies.saveResearchFindingValidationHistory(history);
}
