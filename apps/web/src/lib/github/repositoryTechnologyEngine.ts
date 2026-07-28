import type {
  RepositoryAnalytics,
  RepositoryTechnologyAnalysis,
  TechnologyCategorySummary,
  TechnologyInsight,
  TechnologyRecommendation,
  TechnologyUsage,
} from "@/types/github";

interface TechnologyRecord {
  name: string;
  category: TechnologyUsage["category"];
}

export function buildRepositoryTechnologyAnalysis(
  repositories: RepositoryAnalytics[],
): RepositoryTechnologyAnalysis {
  const technologyMap = new Map<
    string,
    TechnologyUsage
  >();

  const categoryRepositoryTracker = new Map<
    string,
    Set<string>
  >();

  repositories.forEach((repository) => {
    const technologies: TechnologyRecord[] = [
      {
        name: repository.frontend,
        category: "Language",
      },
      {
        name: repository.backend,
        category: "Language",
      },
      {
        name: repository.frontendFramework,
        category: "Framework",
      },
      {
        name: repository.backendFramework,
        category: "Framework",
      },
      {
        name: repository.database,
        category: "Database",
      },
      {
        name: repository.vectorDatabase,
        category: "Database",
      },
      {
        name: repository.cloud,
        category: "Cloud",
      },
      {
        name: repository.packageManager,
        category: "DevOps",
      },
      {
        name: repository.aiFramework,
        category: "AI/ML",
      },
      {
        name: repository.aiLibrary,
        category: "AI/ML",
      },
    ];

    technologies
      .filter(
        (technology) =>
          technology.name &&
          technology.name !== "Unknown" &&
          technology.name !== "None",
      )
      .forEach((technology) => {
        const key = `${technology.category}:${technology.name}`;

        if (!technologyMap.has(key)) {
          technologyMap.set(key, {
            name: technology.name,
            category: technology.category,
            repositoryCount: 0,
            adoptionPercentage: 0,
          });
        }

        technologyMap.get(key)!.repositoryCount++;

        if (
          !categoryRepositoryTracker.has(
            technology.category,
          )
        ) {
          categoryRepositoryTracker.set(
            technology.category,
            new Set(),
          );
        }

        categoryRepositoryTracker
          .get(technology.category)!
          .add(repository.repositoryName);
      });
  });

  const technologies = Array.from(
    technologyMap.values(),
  ).map((technology) => ({
    ...technology,
    adoptionPercentage: Number(
      (
        (technology.repositoryCount /
          repositories.length) *
        100
      ).toFixed(1),
    ),
  }));
    const categories =
    buildCategorySummary(
      technologies,
      repositories.length,
    );

  const diversityScore =
    calculateDiversityScore(
      technologies,
    );

  const insights =
    buildTechnologyInsights(
      technologies,
      diversityScore,
    );

  const recommendations =
    buildTechnologyRecommendations(
      diversityScore,
    );

  return {
    totalRepositories:
      repositories.length,

    totalTechnologies:
      technologies.length,

    languageCount: technologies.filter(
      (technology) =>
        technology.category ===
        "Language",
    ).length,

    frameworkCount:
      technologies.filter(
        (technology) =>
          technology.category ===
          "Framework",
      ).length,

    databaseCount:
      technologies.filter(
        (technology) =>
          technology.category ===
          "Database",
      ).length,

    cloudPlatformCount:
      technologies.filter(
        (technology) =>
          technology.category ===
          "Cloud",
      ).length,

    devOpsToolCount:
      technologies.filter(
        (technology) =>
          technology.category ===
          "DevOps",
      ).length,

    diversityScore,

    technologies,

    categories,

    insights,

    recommendations,
  };
}
function buildCategorySummary(
  technologies: TechnologyUsage[],
  totalRepositories: number,
): TechnologyCategorySummary[] {
  const categories = [
    "Language",
    "Framework",
    "Database",
    "Cloud",
    "DevOps",
    "AI/ML",
  ] as const;

  return categories.map((category) => {
    const items = technologies.filter(
      (technology) =>
        technology.category ===
        category,
    );

    const repositories =
      items.reduce(
        (sum, technology) =>
          sum +
          technology.repositoryCount,
        0,
      );

    return {
      category,
      technologyCount: items.length,
      repositoryCount: repositories,
      adoptionPercentage:
        totalRepositories === 0
          ? 0
          : Number(
              (
                (repositories /
                  totalRepositories) *
                100
              ).toFixed(1),
            ),
    };
  });
}

function calculateDiversityScore(
  technologies: TechnologyUsage[],
): number {
  return Math.min(
    technologies.length * 10,
    100,
  );
}

function buildTechnologyInsights(
  technologies: TechnologyUsage[],
  diversityScore: number,
): TechnologyInsight[] {
  return [
    {
      title: "Technology Portfolio",
      description: `Detected ${technologies.length} technologies across the repository portfolio.`,
      severity: "Info",
    },
    {
      title: "Technology Diversity",
      description: `Current diversity score is ${diversityScore}/100.`,
      severity: "Recommendation",
    },
  ];
}

function buildTechnologyRecommendations(
  diversityScore: number,
): TechnologyRecommendation[] {
  if (diversityScore >= 70) {
    return [
      {
        title: "Maintain Standardization",
        description:
          "Continue enforcing engineering standards across the technology ecosystem.",
        priority: "Low",
      },
    ];
  }

  return [
    {
      title: "Increase Technology Coverage",
      description:
        "Consider broadening the technology ecosystem where appropriate to improve platform capabilities.",
      priority: "Medium",
    },
  ];
}