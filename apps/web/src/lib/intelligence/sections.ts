import type { IntelligenceSection } from "./types";

export const intelligenceSections: IntelligenceSection[] = [
  {
    id: "executive",
    title: "Executive Intelligence",
    description:
      "High-level engineering assessment, repository health, maturity, readiness, and executive-level findings.",
    enabled: true,
    order: 1,
  },
  {
    id: "engineering",
    title: "Engineering Intelligence",
    description:
      "Engineering quality, maintainability, productivity, stability, delivery, and technical performance.",
    enabled: true,
    order: 2,
  },
  {
    id: "technology",
    title: "Technology Intelligence",
    description:
      "Languages, frameworks, databases, cloud platforms, AI technologies, and technology maturity.",
    enabled: true,
    order: 3,
  },
  {
    id: "development",
    title: "Development Intelligence",
    description:
      "Development activity, contributors, collaboration, velocity, momentum, and repository evolution.",
    enabled: true,
    order: 4,
  },
  {
    id: "enterprise",
    title: "Enterprise Intelligence",
    description:
      "Security, DevOps, enterprise readiness, architecture maturity, risk, and benchmark performance.",
    enabled: true,
    order: 5,
  },
  {
    id: "recruiter",
    title: "Recruiter Intelligence",
    description:
      "Engineering level, hiring signal, recommended roles, hiring confidence, and developer profile insights.",
    enabled: true,
    order: 6,
  },
  {
    id: "recommendations",
    title: "AI Recommendations",
    description:
      "Prioritized recommendations and actionable engineering improvements generated from repository intelligence.",
    enabled: true,
    order: 7,
  },
];