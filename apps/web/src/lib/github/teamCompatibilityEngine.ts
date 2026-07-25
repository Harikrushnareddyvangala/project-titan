export interface TeamCompatibility {

  compatibilityScore: number;

  communicationStyle:
    | "Independent"
    | "Collaborative"
    | "Leadership";

  idealRole:
    | "Backend Engineer"
    | "Frontend Engineer"
    | "Full Stack Engineer"
    | "Architect"
    | "Tech Lead"
    | "Engineering Manager";

  leadershipReadiness: number;

  mentoringPotential: number;

  collaborationIndex: number;

  preferredTeamSize: string;

  executiveSummary: string;

}

export interface TeamCompatibilityInput {

  engineeringScore: number;

  collaborationScore: number;

  architectureScore: number;

  innovationScore: number;

  contributorCount: number;

}

export function buildTeamCompatibility({

  engineeringScore,

  collaborationScore,

  architectureScore,

  innovationScore,

  contributorCount,

}: TeamCompatibilityInput): TeamCompatibility {

  const compatibilityScore =
    Math.round(

      (
        engineeringScore +
        collaborationScore +
        architectureScore
      ) / 3

    );

  const leadershipReadiness =
    Math.round(

      (
        architectureScore +
        collaborationScore
      ) / 2

    );

  const mentoringPotential =
    Math.round(

      (
        engineeringScore +
        collaborationScore
      ) / 2

    );

  let communicationStyle:
    TeamCompatibility["communicationStyle"];

  if (collaborationScore >= 92)

    communicationStyle = "Leadership";

  else if (collaborationScore >= 75)

    communicationStyle = "Collaborative";

  else

    communicationStyle = "Independent";

  let idealRole:
    TeamCompatibility["idealRole"];

  if (
    leadershipReadiness >= 95
  ) {

    idealRole = "Engineering Manager";

  } else if (

    architectureScore >= 92

  ) {

    idealRole = "Architect";

  } else if (

    collaborationScore >= 90

  ) {

    idealRole = "Tech Lead";

  } else if (

    innovationScore >= 90

  ) {

    idealRole = "Full Stack Engineer";

  } else {

    idealRole = "Backend Engineer";

  }

  const preferredTeamSize =
    contributorCount <= 2

      ? "Small Agile Team"

      : contributorCount <= 6

      ? "Medium Engineering Team"

      : "Large Enterprise Team";

  return {

    compatibilityScore,

    communicationStyle,

    idealRole,

    leadershipReadiness,

    mentoringPotential,

    collaborationIndex:
      collaborationScore,

    preferredTeamSize,

    executiveSummary:

      `${idealRole} exhibiting ${compatibilityScore}% team compatibility.`,

  };

}