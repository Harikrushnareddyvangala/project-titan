import type {
  ArchitectureIntelligence,
  RepositoryAnalytics,
} from "@/types/github";

interface ArchitectureIntelligenceInput {
  repositories: RepositoryAnalytics[];
}
function calculateConsistency(values: Array<string | undefined>,): number {

  const filtered = values.filter(
  (value): value is string => Boolean(value),
);

  if (filtered.length === 0) {
    return 0;
  }

  const counts = new Map<string, number>();

  filtered.forEach((value) => {
    counts.set(value, (counts.get(value) ?? 0) + 1);
  });

  const highest =
    Math.max(...counts.values());

  return Math.round(
    (highest / filtered.length) * 100,
  );

}
export function buildArchitectureIntelligence({
  repositories,
}: ArchitectureIntelligenceInput): ArchitectureIntelligence {
    if (repositories.length === 0) {
  return {
    frontendConsistency: 0,
    backendConsistency: 0,
    frameworkConsistency: 0,
    databaseConsistency: 0,
    aiConsistency: 0,
    technologyDiversity: 0,
    architectureGrade: "N/A",
    recommendations: [],
  };
}
const frontendConsistency =
  calculateConsistency(
    repositories.map(
      (repo) => repo.frontendFramework,
    ),
  );

const backendConsistency =
  calculateConsistency(
    repositories.map(
      (repo) => repo.backendFramework,
    ),
  );

const frameworkConsistency =
  calculateConsistency([
    ...repositories.map(
      (repo) => repo.frontendFramework,
    ),
    ...repositories.map(
      (repo) => repo.backendFramework,
    ),
  ]);

const databaseConsistency =
  calculateConsistency(
    repositories.map(
      (repo) => repo.database,
    ),
  );



const aiConsistency =
  calculateConsistency(
    repositories.map(
      (repo) => repo.aiLibrary,
    ),
  );
  const technologies = new Set<string>();

repositories.forEach((repo) => {

  [
    repo.frontendFramework,
    repo.backendFramework,
    repo.database,
    repo.aiLibrary,
  ]
    .filter(Boolean)
    .forEach((tech) => technologies.add(tech));

});

const technologyDiversity =
  technologies.size;

  const averageConsistency = Math.round(

  (
    frontendConsistency +
    backendConsistency +
    frameworkConsistency +
    databaseConsistency +
    
    aiConsistency
  ) / 5, 
);
let architectureGrade = "D";

if (averageConsistency >= 90) {
  architectureGrade = "A+";
}
else if (averageConsistency >= 80) {
  architectureGrade = "A";
}
else if (averageConsistency >= 70) {
  architectureGrade = "B";
}
else if (averageConsistency >= 60) {
  architectureGrade = "C";
}
const recommendations: string[] = [];

/*
 * Frontend
 */
if (frontendConsistency >= 90) {
  recommendations.push(
    "Frontend technologies are highly standardized across the portfolio.",
  );
} else if (frontendConsistency >= 75) {
  recommendations.push(
    "Frontend architecture is mostly consistent with minor variations.",
  );
} else {
  recommendations.push(
    "Standardize frontend frameworks to reduce maintenance overhead.",
  );
}

/*
 * Backend
 */
if (backendConsistency >= 90) {
  recommendations.push(
    "Backend services demonstrate excellent architectural consistency.",
  );
} else if (backendConsistency >= 75) {
  recommendations.push(
    "Backend technologies are generally aligned across repositories.",
  );
} else {
  recommendations.push(
    "Reduce backend framework fragmentation to improve maintainability.",
  );
}

/*
 * Database
 */
if (databaseConsistency < 75) {
  recommendations.push(
    "Consolidate database technologies where practical.",
  );
}

/*
 * AI
 */
if (aiConsistency < 75) {
  recommendations.push(
    "Align AI frameworks and model-serving libraries across projects.",
  );
}

/*
 * Technology diversity
 */
if (technologyDiversity > 20) {
  recommendations.push(
    "Technology diversity is high. Evaluate opportunities to simplify the engineering stack.",
  );
} else if (technologyDiversity < 8) {
  recommendations.push(
    "Technology stack is highly standardized, improving long-term maintainability.",
  );
}

/*
 * Overall architecture
 */
if (architectureGrade === "A+" || architectureGrade === "A") {
  recommendations.push(
    "Overall architecture demonstrates strong portfolio governance.",
  );
} else if (architectureGrade === "B") {
  recommendations.push(
    "Architecture is healthy with opportunities for additional standardization.",
  );
} else {
  recommendations.push(
    "Prioritize architectural consolidation before introducing new technologies.",
  );
}
const uniqueRecommendations = [...new Set(recommendations)];
return {
  frontendConsistency,
  backendConsistency,
  frameworkConsistency,
  databaseConsistency,
  aiConsistency,
  technologyDiversity,
  architectureGrade,
  recommendations: uniqueRecommendations,
};

}