"use client";

import { motion } from "framer-motion";
import {
  ShieldAlert,
  ShieldCheck,
  Activity,
  Users,
  Bug,
  Rocket,
} from "lucide-react";

import type { GithubRepository, RepositoryAnalytics, } from "@/types/github";

interface RepositoryRiskAssessmentProps {
  repository: GithubRepository | null;
  analytics: RepositoryAnalytics | null;
}

export function RepositoryRiskAssessment({
  repository,
  analytics,
}: RepositoryRiskAssessmentProps) {
  if (!repository) return null;

  // const updatedDays = Math.floor(
  //   (new Date().getTime() -
  //     new Date(repository.updated_at).getTime()) /
  //     (1000 * 60 * 60 * 24),
  // );

  // // -------------------------
  // // Individual Risk Scores
  // // -------------------------

  // const maintenanceRisk =
  //   repository.open_issues_count > 20
  //     ? "High"
  //     : repository.open_issues_count > 5
  //     ? "Medium"
  //     : "Low";

  // const communityRisk =
  //   repository.watchers_count < 3
  //     ? "Medium"
  //     : "Low";

  // const activityRisk =
  //   updatedDays > 180
  //     ? "High"
  //     : updatedDays > 90
  //     ? "Medium"
  //     : "Low";

  // const deploymentReady =
  //   repository.open_issues_count < 10 &&
  //   updatedDays < 90;

  // // -------------------------
  // // Overall Risk Score
  // // -------------------------

  // let score = 100;

  // score -= repository.open_issues_count * 2;

  // if (updatedDays > 90) score -= 20;

  // if (updatedDays > 180) score -= 15;

  // if (repository.watchers_count < 3)
  //   score -= 10;

  // score = Math.max(0, Math.min(score, 100));

  // const overallRisk =
  //   score >= 80
  //     ? "Low"
  //     : score >= 60
  //     ? "Medium"
  //     : "High";

  // const confidence = Math.min(
  //   99,
  //   Math.round(
  //     80 +
  //       repository.watchers_count +
  //       repository.forks_count +
  //       repository.stargazers_count,
  //   ),
  // );
const overallRisk =
  analytics?.riskLevel ?? "Medium";

const deploymentReady =
  analytics?.deploymentReady ?? false;

const inactiveDays =
  analytics?.inactiveDays ?? 0;

const healthScore =
  analytics?.healthScore ?? 0;

const productionScore =
  analytics?.productionScore ?? 0;

const maintenanceRisk =
  repository.open_issues_count > 20
    ? "High"
    : repository.open_issues_count > 5
    ? "Medium"
    : "Low";

const communityRisk =
  repository.watchers_count < 3
    ? "Medium"
    : "Low";

const activityRisk =
  inactiveDays > 180
    ? "High"
    : inactiveDays > 90
    ? "Medium"
    : "Low";

const confidence =
  Math.min(
    99,
    Math.round(
      (healthScore +
        productionScore) / 2,
    ),
  );
  return (
    <motion.section
      initial={{
        opacity: 0,
        y: 30,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      viewport={{
        once: true,
      }}
      className="
        rounded-[34px]
        border
        border-white/10
        bg-white/[0.04]
        backdrop-blur-3xl
        p-8
      "
    >
      <div className="flex items-center gap-4">

        <ShieldAlert
          size={34}
          className="text-cyan-400"
        />

        <div>

          <h2 className="text-2xl font-bold text-white">
            AI Risk Assessment
          </h2>

          <p className="mt-1 text-zinc-400">
            Engineering health analysis generated
            from repository activity.
          </p>

        </div>

      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">

        <RiskCard
          title="Overall Risk"
          value={overallRisk}
        />

        <RiskCard
          title="Maintenance"
          value={maintenanceRisk}
        />

        <RiskCard
          title="Community"
          value={communityRisk}
        />

        <RiskCard
          title="Activity"
          value={activityRisk}
        />

        <RiskCard
          title="Deployment"
          value={
            deploymentReady
              ? "Ready"
              : "Needs Review"
          }
        />
        <RiskCard
  title="Health Score"
  value={`${healthScore}%`}
/>

<RiskCard
  title="Production Score"
  value={`${productionScore}%`}
/>  

        <motion.div
          whileHover={{
            y: -4,
          }}
          className="
            rounded-2xl
            border
            border-white/10
            bg-white/[0.03]
            p-5
          "
        >
          <div className="flex items-center gap-3">

            <ShieldCheck
              className="text-cyan-400"
              size={22}
            />

            <div>

              <p className="text-sm text-zinc-500">
                Confidence
              </p>

              <p className="mt-1 text-2xl font-bold text-white">
                {confidence}%
              </p>

            </div>

          </div>

        </motion.div>

      </div>
    </motion.section>
  );
}

interface RiskCardProps {
  title: string;
  value: string;
}

function RiskCard({
  title,
  value,
}: RiskCardProps) {
  const numeric =
  Number.parseInt(value);

const color =
  !Number.isNaN(numeric)
    ? numeric >= 80
      ? "text-green-400"
      : numeric >= 60
      ? "text-yellow-400"
      : "text-red-400"
    : value === "Low" ||
      value === "Ready"
    ? "text-green-400"
    : value === "Medium"
    ? "text-yellow-400"
    : value === "High"
    ? "text-red-400"
    : "text-cyan-400";

  const Icon =
  title === "Maintenance"
    ? Activity
    : title === "Community"
    ? Users
    : title === "Activity"
    ? Activity
    : title === "Deployment"
    ? Rocket
    : title === "Health Score"
    ? ShieldCheck
    : title === "Production Score"
    ? ShieldCheck
    : title === "Overall Risk"
    ? ShieldAlert
    : Bug;

  return (
    <motion.div
      whileHover={{
        y: -5,
        scale: 1.02,
      }}
      className="
        rounded-2xl
        border
        border-white/10
        bg-white/[0.03]
        p-6
      "
    >
      <div className="flex items-center gap-3">

        <Icon
          size={22}
          className={color}
        />

        <div>

          <p className="text-sm text-zinc-500">
            {title}
          </p>

          <p
            className={`mt-2 text-xl font-semibold ${color}`}
          >
            {value}
          </p>

        </div>

      </div>
    </motion.div>
  );
}