"use client";

import type { RankedRepository } from "@/types/github";

interface RepositoryEngineeringInsightsCardProps {
  repository: RankedRepository;
}

export function RepositoryEngineeringInsightsCard({
  repository,
}: RepositoryEngineeringInsightsCardProps) {
  const strengths: string[] = [];
  const risks: string[] = [];
  const recommendations: string[] = [];

  if (repository.engineeringScore >= 90) {
    strengths.push("Excellent engineering quality.");
  } else if (repository.engineeringScore >= 80) {
    strengths.push("Strong engineering foundations.");
  } else {
    risks.push("Engineering quality should be improved.");
    recommendations.push(
      "Increase maintainability and code quality."
    );
  }

  if (repository.securityScore >= 90) {
    strengths.push("Strong security posture.");
  } else {
    risks.push("Security posture can be strengthened.");
    recommendations.push(
      "Improve security practices and dependency management."
    );
  }

  if (repository.productionScore >= 90) {
    strengths.push("Production-ready deployment practices.");
  } else {
    recommendations.push(
      "Improve CI/CD reliability and production readiness."
    );
  }

  if (repository.enterpriseReadiness >= 90) {
    strengths.push("Enterprise-ready architecture.");
  } else {
    risks.push("Enterprise readiness requires improvement.");
    recommendations.push(
      "Enhance documentation, governance, and scalability."
    );
  }

  if (repository.hiringScore < 80) {
    risks.push("Repository may be difficult for new engineers.");
    recommendations.push(
      "Improve documentation and onboarding experience."
    );
  }

  const maturity =
    repository.overallScore >= 90
      ? "Excellent"
      : repository.overallScore >= 80
      ? "Advanced"
      : repository.overallScore >= 70
      ? "Intermediate"
      : "Developing";

  return (
    <div className="rounded-[34px] border border-emerald-400/20 bg-emerald-500/5 p-8 backdrop-blur-3xl">
      <h3 className="text-2xl font-bold text-white">
        Repository Engineering Intelligence
      </h3>

      <p className="mt-2 text-zinc-400">
        Engineering interpretation generated from repository analytics.
      </p>

      <div className="mt-8 rounded-2xl border border-white/10 bg-black/20 p-6">
        <p className="text-sm uppercase tracking-[0.25em] text-zinc-400">
          Repository
        </p>

        <h4 className="mt-2 text-2xl font-bold text-white">
          {repository.repositoryName}
        </h4>

        <p className="mt-5 text-sm uppercase tracking-[0.25em] text-zinc-400">
          Engineering Maturity
        </p>

        <p className="mt-2 text-4xl font-bold text-emerald-300">
          {maturity}
        </p>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <InsightSection
          title="Engineering Strengths"
          items={strengths}
          color="emerald"
        />

        <InsightSection
          title="Engineering Risks"
          items={risks}
          color="red"
        />
      </div>

      <div className="mt-8 rounded-2xl border border-white/10 bg-black/20 p-6">
        <h4 className="text-lg font-semibold text-white">
          Recommended Next Steps
        </h4>

        <ol className="mt-4 space-y-3">
          {recommendations.map((item) => (
            <li
              key={item}
              className="text-zinc-300"
            >
              • {item}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

interface InsightSectionProps {
  title: string;
  items: string[];
  color: "emerald" | "red";
}

function InsightSection({
  title,
  items,
  color,
}: InsightSectionProps) {
  const titleColor =
    color === "emerald"
      ? "text-emerald-300"
      : "text-red-300";

  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-6">
      <h4 className={`font-semibold ${titleColor}`}>
        {title}
      </h4>

      <ul className="mt-4 space-y-3">
        {items.length > 0 ? (
          items.map((item) => (
            <li
              key={item}
              className="text-zinc-300"
            >
              • {item}
            </li>
          ))
        ) : (
          <li className="text-zinc-500">
            No significant findings.
          </li>
        )}
      </ul>
    </div>
  );
}