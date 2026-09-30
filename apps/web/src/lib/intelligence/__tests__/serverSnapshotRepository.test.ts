import { beforeEach, describe, expect, it, vi } from "vitest";

import type { IntelligenceSnapshot } from "@/types/intelligence";

import {
  createIntelligenceSnapshotRecord,
  getIntelligenceSnapshotRecord,
  getIntelligenceSnapshotRecords,
} from "@titan/database";

import {
  createIntelligenceSnapshot,
  getIntelligenceSnapshot,
  getIntelligenceSnapshots,
} from "../serverSnapshotRepository";

vi.mock("@titan/database", () => ({
  createIntelligenceSnapshotRecord: vi.fn(),
  getIntelligenceSnapshotRecord: vi.fn(),
  getIntelligenceSnapshotRecords: vi.fn(),
}));

const mockedCreateIntelligenceSnapshotRecord = vi.mocked(
  createIntelligenceSnapshotRecord,
);

const mockedGetIntelligenceSnapshotRecord = vi.mocked(
  getIntelligenceSnapshotRecord,
);

const mockedGetIntelligenceSnapshotRecords = vi.mocked(
  getIntelligenceSnapshotRecords,
);

const createdAt = "2026-09-29T10:00:00.000Z";

function createAnalytics(): IntelligenceSnapshot["analytics"] {
  return {
    repositoryName: "project-titan",
    repositoryFullName: "Harikrushnareddyvangala/project-titan",
    stars: 12,
    forks: 3,
    watchers: 5,
    issues: 2,
    repositoryAge: 1000,
    inactiveDays: 2,
    languageCount: 2,
    contributorCount: 4,
    engineeringScore: 91,
    healthScore: 88,
    productionScore: 84,
    deploymentReady: true,
    riskLevel: "Low",
    quality: "Excellent",
    maturity: "Advanced",
    recommendations: [
      {
        title: "Improve documentation",
        description: "Expand architectural documentation.",
      },
    ],
    securityScore: 90,
    devopsScore: 86,
    hasLicense: true,
    archived: false,
    hasWiki: true,
    hasProjects: true,
    hasIssues: true,
    frontend: "Next.js",
    backend: "Next.js",
    database: "PostgreSQL",
    aiFramework: "LangChain",
    vectorDatabase: "pgvector",
    cloud: "AWS",
    packageManager: "pnpm",
    frontendFramework: "React",
    backendFramework: "Next.js",
    aiLibrary: "OpenAI",
    dependencyRisk: "Low",
    technologyMaturity: "Advanced",
    codeQuality: 92,
    documentationQuality: 87,
    maintainability: 89,
    enterpriseReadiness: 85,
    repositoryGrade: "A",
    busFactor: 2,
    collaborationIndex: 84,
    teamHealth: 88,
    topContributorShare: 0.6,
    contributorDistribution: "Balanced",
    executiveSummary: "Project TITAN demonstrates strong engineering maturity.",
    strengths: ["Architecture", "Research", "Data Science"],
    risks: ["Documentation depth"],
    hiringSignal: "Strong",
    enterpriseSummary: "Strong technical foundation with room for greater documentation depth.",
    totalCommits: 125,
    commitsPerWeek: 12,
    recentCommits: 8,
    developmentVelocity: 85,
    developmentMomentum: 82,
    engineeringStability: 88,
    releaseReadiness: 80,
    activityTrend: "Growing",

    benchmarkEngineering: 89,
    benchmarkSecurity: 90,
    benchmarkDevOps: 86,
    benchmarkCodeQuality: 92,
    benchmarkEnterprise: 85,
    engineeringGap: 6,
    securityGap: 4,
    devopsGap: 8,
    codeQualityGap: 3,
    enterpriseGap: 10,
    overallBenchmarkScore: 88,
    enterprisePercentile: 91,
    overallRanking: "Top Tier",
    benchmarkSummary: "Strong engineering and security benchmark performance.",

    aiRecommendations: [
      {
        priority: "High",
        category: "Architecture",
        recommendation: "Continue strengthening platform boundaries.",
      },
    ],

    executiveReport: {
      title: "Project TITAN Engineering Report",
      summary: "Strong engineering maturity.",
      engineeringVerdict: "Strong",
      recruiterVerdict: "Promising",
      enterpriseVerdict: "Ready with improvements",
      strengths: ["Architecture", "Engineering"],
      concerns: ["Documentation"],
      recommendations: [
        {
          title: "Document architecture",
          description: "Increase architecture documentation coverage.",
        },
      ],
    },

    recruiterIntelligence: {
      hiringScore: 88,
      engineeringLevel: "Senior",
      recruiterVerdict: "Strong engineering profile",
      salaryRange: "Test Range",
      hiringConfidence: 0.9,
      recommendedRoles: ["Data Scientist", "AI Engineer"],
    },

    developerDNA: {
      archetype: "Researcher",
      innovationScore: 92,
      architectureScore: 88,
      executionScore: 85,
      collaborationScore: 84,
      learningScore: 95,
      dnaSummary: "Research-driven engineering profile.",
      strengths: ["Research", "AI", "Data Science"],
    },

    careerIntelligence: {
      careerStage: "Senior Engineer",
      promotionReadiness: 84,
      marketDemand: 90,
      leadershipPotential: 82,
      careerRisk: 15,
      estimatedMarketValue: "Test Range",
      nextCareerStep: "Technical Leader",
      executiveSummary: "Strong progression potential.",
    },

    engineeringMentor: {
      maturityLevel: "Advanced",
      learningPriority: "System architecture",
      recommendedSkills: ["Distributed Systems", "MLOps"],
      roadmap: ["Architecture", "Platform Engineering"],
      mentorSummary: "Continue developing platform architecture depth.",
    },

    teamCompatibility: {
      compatibilityScore: 88,
      communicationStyle: "Collaborative",
      idealRole: "Architect",
      leadershipReadiness: 82,
      mentoringPotential: 85,
      collaborationIndex: 84,
      preferredTeamSize: "5-10",
      executiveSummary: "Strong collaborative profile.",
    },

    organizationIntelligence: {
      engineeringCulture: 88,
      deliveryMaturity: 84,
      innovationCulture: 93,
      technicalDebt: 18,
      organizationalReadiness: 82,
      scalingReadiness: 80,
      engineeringGovernance: 78,
      executiveSummary: "Strong innovation culture with growing governance maturity.",
    },

    // Deliberately nested JSON data used by the persistence test.
  };
}

function createSnapshot(): IntelligenceSnapshot {
  return {
    id: "snapshot-001",
    repository: "Harikrushnareddyvangala/project-titan",
    createdAt,
    analytics: createAnalytics(),
  };
}

function createDatabaseRecord() {
  return {
    id: "snapshot-001",
    repository: "Harikrushnareddyvangala/project-titan",
    createdAt: new Date(createdAt),
    analytics: createAnalytics(),
  };
}

describe("intelligence snapshot server repository", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("loads and maps a database snapshot to the domain model", async () => {
    const record = createDatabaseRecord();

    mockedGetIntelligenceSnapshotRecord.mockResolvedValue(record);

    const result = await getIntelligenceSnapshot(record.id);

    expect(mockedGetIntelligenceSnapshotRecord).toHaveBeenCalledWith(
      record.id,
    );

    expect(result).toEqual<IntelligenceSnapshot>({
      id: record.id,
      repository: record.repository,
      createdAt,
      analytics: record.analytics,
    });
  });

  it("returns null when the database snapshot does not exist", async () => {
    mockedGetIntelligenceSnapshotRecord.mockResolvedValue(null);

    const result = await getIntelligenceSnapshot("missing-snapshot");

    expect(result).toBeNull();

    expect(mockedGetIntelligenceSnapshotRecord).toHaveBeenCalledWith(
      "missing-snapshot",
    );
  });

  it("loads and maps all database snapshots", async () => {
    const first = createDatabaseRecord();

    const second = {
      ...createDatabaseRecord(),
      id: "snapshot-002",
      repository: "another/repository",
      createdAt: new Date("2026-09-29T11:00:00.000Z"),
      analytics: {
        ...createAnalytics(),
        repository: {
          name: "another-repository",
          owner: "another-owner",
        },
      },
    };

    mockedGetIntelligenceSnapshotRecords.mockResolvedValue([
      first,
      second,
    ]);

    const result = await getIntelligenceSnapshots();

    expect(mockedGetIntelligenceSnapshotRecords).toHaveBeenCalledTimes(1);

    expect(result).toEqual([
      {
        id: first.id,
        repository: first.repository,
        createdAt: "2026-09-29T10:00:00.000Z",
        analytics: first.analytics,
      },
      {
        id: second.id,
        repository: second.repository,
        createdAt: "2026-09-29T11:00:00.000Z",
        analytics: second.analytics,
      },
    ]);
  });

  it("preserves the complete analytics payload when loading", async () => {
    const analytics = {
      ...createAnalytics(),
      deeplyNested: {
        quality: {
          score: 0.94,
          signals: ["a", "b", "c"],
        },
        trends: [
          {
            period: "2026-Q3",
            value: 87,
          },
        ],
      },
      nullableValue: null,
      booleanValue: true,
    };

    mockedGetIntelligenceSnapshotRecord.mockResolvedValue({
      id: "snapshot-complete",
      repository: "project-titan",
      createdAt: new Date(createdAt),
      analytics,
    });

    const result = await getIntelligenceSnapshot("snapshot-complete");

    expect(result?.analytics).toEqual(analytics);
  });

  it("converts domain timestamps to database dates when creating", async () => {
    const snapshot = createSnapshot();
    const record = createDatabaseRecord();

    mockedCreateIntelligenceSnapshotRecord.mockResolvedValue(record);

    const result = await createIntelligenceSnapshot(snapshot);

    expect(mockedCreateIntelligenceSnapshotRecord).toHaveBeenCalledWith({
      id: snapshot.id,
      repository: snapshot.repository,
      createdAt: new Date(createdAt),
      analytics: snapshot.analytics,
    });

    expect(result).toEqual(snapshot);
  });

  it("rejects an invalid creation timestamp before database persistence", async () => {
    const snapshot: IntelligenceSnapshot = {
      ...createSnapshot(),
      createdAt: "not-a-timestamp",
    };

    await expect(createIntelligenceSnapshot(snapshot)).rejects.toThrow(
      "Invalid intelligence snapshot timestamp: not-a-timestamp",
    );

    expect(mockedCreateIntelligenceSnapshotRecord).not.toHaveBeenCalled();
  });
});
