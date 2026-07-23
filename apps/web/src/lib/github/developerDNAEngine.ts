export interface DeveloperDNA {

  archetype:
    | "Architect"
    | "Builder"
    | "Researcher"
    | "Maintainer"
    | "Full-Stack Innovator";

  innovationScore: number;

  architectureScore: number;

  executionScore: number;

  collaborationScore: number;

  learningScore: number;

  dnaSummary: string;

  strengths: string[];

}

export interface DeveloperDNAInput {

  engineeringScore: number;

  codeQuality: number;

  documentationQuality: number;

  enterpriseReadiness: number;

  contributorCount: number;

  collaborationIndex: number;

  commitsPerWeek: number;

  languageCount: number;

}

export function buildDeveloperDNA({

  engineeringScore,

  codeQuality,

  documentationQuality,

  enterpriseReadiness,

  contributorCount,

  collaborationIndex,

  commitsPerWeek,

  languageCount,

}: DeveloperDNAInput): DeveloperDNA {

  const innovationScore =
    Math.min(
      100,
      Math.round(
        languageCount * 12 +
        commitsPerWeek * 2
      ),
    );

  const architectureScore =
    Math.round(
      (engineeringScore +
      enterpriseReadiness +
      codeQuality) / 3
    );

  const executionScore =
    Math.round(
      (engineeringScore +
      commitsPerWeek * 3) / 2
    );

  const collaborationScore =
    Math.round(
      collaborationIndex
    );

  const learningScore =
    Math.round(
      (documentationQuality +
      innovationScore) / 2
    );

  let archetype: DeveloperDNA["archetype"];

  if (
    architectureScore > 92 &&
    enterpriseReadiness > 90
  ) {

    archetype = "Architect";

  } else if (

    innovationScore > 90

  ) {

    archetype = "Researcher";

  } else if (

    executionScore > 90

  ) {

    archetype = "Builder";

  } else if (

    collaborationScore > 85

  ) {

    archetype = "Maintainer";

  } else {

    archetype = "Full-Stack Innovator";

  }

  const strengths: string[] = [];

  if (architectureScore > 90)
    strengths.push("System Architecture");

  if (executionScore > 90)
    strengths.push("Execution Speed");

  if (innovationScore > 90)
    strengths.push("Innovation");

  if (collaborationScore > 90)
    strengths.push("Team Collaboration");

  if (learningScore > 90)
    strengths.push("Continuous Learning");

  return {

    archetype,

    innovationScore,

    architectureScore,

    executionScore,

    collaborationScore,

    learningScore,

    dnaSummary:

      `${archetype} profile exhibiting strong engineering characteristics.`,

    strengths,

  };

}