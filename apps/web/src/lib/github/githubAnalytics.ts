import type {
  GithubRepository,
  GithubLanguages,
} from "@/types/github";

export interface RepositoryAnalytics {
  engineeringScore: number;
  productionScore: number;
  healthScore: number;

  quality:
    | "Growing"
    | "Good"
    | "Excellent"
    | "Outstanding";

  deploymentReady: boolean;

  riskLevel:
    | "Low"
    | "Medium"
    | "High";

  summary: string;

  recommendations: string[];
}
export function analyzeRepository(
  repository: GithubRepository,
  languages: GithubLanguages,
): RepositoryAnalytics {
    let engineering = 55;

engineering += Math.min(
  repository.stargazers_count,
  20,
);

engineering += Math.min(
  repository.forks_count * 2,
  20,
);

engineering += Math.min(
  Object.keys(languages).length * 3,
  15,
);

engineering -= Math.min(
  repository.open_issues_count,
  10,
);

engineering = Math.max(
  0,
  Math.min(100, engineering),
);
let production = engineering;

if (repository.homepage)
  production += 8;

if (repository.license)
  production += 8;

production = Math.min(
  100,
  production,
);
let health = 100;

health -= Math.min(
  repository.open_issues_count,
  30,
);

health -= Math.min(
  Math.floor(
    repository.size / 5000,
  ),
  10,
);

health = Math.max(
  40,
  health,
);
let quality:
  | "Growing"
  | "Good"
  | "Excellent"
  | "Outstanding";

if (engineering >= 90)
  quality = "Outstanding";
else if (engineering >= 80)
  quality = "Excellent";
else if (engineering >= 65)
  quality = "Good";
else
  quality = "Growing";
const deploymentReady =
  production >= 85 &&
  health >= 80 &&
  !!repository.homepage &&
  !!repository.license;
  let riskLevel:
  | "Low"
  | "Medium"
  | "High";

if (health >= 85)
  riskLevel = "Low";
else if (health >= 65)
  riskLevel = "Medium";
else
  riskLevel = "High";
const summary =
  `${repository.name} demonstrates ${quality.toLowerCase()} engineering quality with an engineering score of ${engineering}/100. The repository has ${riskLevel.toLowerCase()} operational risk and is ${deploymentReady ? "" : "not "}ready for production deployment.`;
  const recommendations: string[] = [];

if (!repository.homepage)
  recommendations.push(
    "Deploy a live demo.",
  );

if (!repository.license)
  recommendations.push(
    "Add an open-source license.",
  );

if (repository.open_issues_count > 15)
  recommendations.push(
    "Resolve stale GitHub issues.",
  );

if (repository.stargazers_count < 20)
  recommendations.push(
    "Increase project visibility.",
  );
  return {
  engineeringScore: engineering,
  productionScore: production,
  healthScore: health,
  quality,
  deploymentReady,
  riskLevel,
  summary,
  recommendations,
};
}