"use client";

import { motion } from "framer-motion";
import {
  Shield,
  Lock,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";

import type {
  GithubRepository,
  RepositoryAnalytics,
} from "@/types/github";

interface Props {
  repository: GithubRepository;
  analytics: RepositoryAnalytics | null;
}

export function RepositorySecurityAnalysis({
  repository,
  analytics,
}: Props) {

  const engineering =
    analytics?.engineeringScore ?? 0;

  const production =
    analytics?.productionScore ?? 0;

  const health =
    analytics?.healthScore ?? 0;

  const risk =
    analytics?.riskLevel ?? "Medium";

  const securityScore = Math.round(
    (engineering + production + health) / 3
  );

  const visibility =
    repository.visibility;

  const recommendations = [];

  if (!repository.license)
    recommendations.push("Missing license");

  if (risk === "High")
    recommendations.push("High operational risk");

  if (repository.open_issues_count > 15)
    recommendations.push("Large number of unresolved issues");

  if (visibility === "public")
    recommendations.push("Public repository");

  return (
    <motion.section
    id = "security"
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="
      rounded-[34px]
      border
      border-white/10
      bg-white/[0.04]
      backdrop-blur-3xl
      p-8
      "
    >

      <div className="flex items-center gap-3">

        <Shield
          className="text-cyan-400"
          size={28}
        />

        <div>

          <h2 className="text-2xl font-bold text-white">
            AI Security Intelligence
          </h2>

          <p className="text-zinc-400">
            Enterprise security posture estimation
          </p>

        </div>

      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">

        <SecurityCard
          icon={<Shield size={20} />}
          title="Security"
          value={`${securityScore}%`}
        />

        <SecurityCard
          icon={<Lock size={20} />}
          title="Visibility"
          value={visibility}
        />

        <SecurityCard
          icon={<AlertTriangle size={20} />}
          title="Risk"
          value={risk}
        />

        <SecurityCard
          icon={<CheckCircle2 size={20} />}
          title="Issues"
          value={repository.open_issues_count.toString()}
        />

      </div>

      <motion.div
        whileHover={{
          scale: 1.01,
        }}
        className="
        mt-10
        rounded-3xl
        border
        border-cyan-500/20
        bg-cyan-500/10
        p-6
        "
      >

        <h3 className="text-lg font-semibold text-white">
          AI Security Assessment
        </h3>

        <p className="mt-5 leading-8 text-zinc-300">

          TITAN estimates the repository security posture as

          <span className="ml-2 font-semibold text-cyan-300">
            {securityScore}%
          </span>

          based on repository health, engineering quality,
          deployment readiness and project maturity.

        </p>

        <div className="mt-6 space-y-3">

          {recommendations.length === 0 ? (

            <div className="text-green-400">
              ✓ No major security observations detected.
            </div>

          ) : (

            recommendations.map((item) => (

              <div
                key={item}
                className="flex items-center gap-3 text-yellow-300"
              >

                <AlertTriangle size={16} />

                {item}

              </div>

            ))

          )}

        </div>

      </motion.div>

    </motion.section>
  );
}

function SecurityCard({
  icon,
  title,
  value,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
}) {

  return (

    <motion.div
      whileHover={{
        y: -6,
        scale: 1.02,
      }}
      className="
      rounded-3xl
      border
      border-white/10
      bg-white/[0.04]
      p-6
      "
    >

      <div className="text-cyan-400">
        {icon}
      </div>

      <p className="mt-5 text-xs uppercase tracking-wider text-zinc-500">
        {title}
      </p>

      <p className="mt-2 text-2xl font-bold text-white">
        {value}
      </p>

    </motion.div>

  );

}