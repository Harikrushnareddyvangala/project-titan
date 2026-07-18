"use client";

import { motion } from "framer-motion";
import {
  Lightbulb,
  CheckCircle2,
  AlertTriangle,
  ShieldAlert,
  Sparkles,
} from "lucide-react";

import type {
  GithubRepository,
  RepositoryAnalytics,
} from "@/types/github";

interface Props {
  repository: GithubRepository;
  analytics: RepositoryAnalytics | null;
}

type RecommendationSeverity =
  | "Critical"
  | "High"
  | "Medium"
  | "Low";

interface Recommendation {
  title: string;
  description: string;
  severity: RecommendationSeverity;
  priority: number;
}

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  show: {
    opacity: 1,
    y: 0,
  },
};

export function RepositoryRecommendations({
  repository,
  analytics,
}: Props) {
  const engineering =
    analytics?.engineeringScore ?? 0;

  const production =
    analytics?.productionScore ?? 0;

  const health =
    analytics?.healthScore ?? 0;

  const deploymentReady =
    analytics?.deploymentReady ?? false;

  const risk =
    analytics?.riskLevel ?? "Medium";

  const recommendations: Recommendation[] = [];

  if (engineering < 85) {
    recommendations.push({
      title: "Improve Engineering Quality",
      description:
        "Increase code quality through stronger architecture, automated testing, static analysis, and code reviews.",
      severity: "High",
      priority: 100,
    });
  }

  if (production < 80) {
    recommendations.push({
      title: "Prepare Production Release",
      description:
        "Strengthen CI/CD pipelines, deployment automation, monitoring, observability and rollback strategy.",
      severity: "Critical",
      priority: 120,
    });
  }

  if (health < 80) {
    recommendations.push({
      title: "Repository Maintenance",
      description:
        "Resolve stale issues, review pull requests, and improve maintainability.",
      severity: "Medium",
      priority: 80,
    });
  }

  if (!deploymentReady) {
    recommendations.push({
      title: "Deployment Readiness",
      description:
        "Configure production deployment, secrets management and environment validation.",
      severity: "Critical",
      priority: 110,
    });
  }

  if (risk === "High") {
    recommendations.push({
      title: "Reduce Operational Risk",
      description:
        "Improve automated testing, security scanning and dependency management.",
      severity: "Critical",
      priority: 130,
    });
  }

  if (!repository.homepage) {
    recommendations.push({
      title: "Publish Live Demo",
      description:
        "Deploy the project and configure the GitHub homepage.",
      severity: "Low",
      priority: 40,
    });
  }

  if (!repository.license) {
    recommendations.push({
      title: "Add Open Source License",
      description:
        "Choose an appropriate license to encourage community adoption.",
      severity: "Medium",
      priority: 60,
    });
  }

  if (recommendations.length === 0) {
    recommendations.push({
      title: "Excellent Repository",
      description:
        "Repository follows enterprise engineering standards and is production ready.",
      severity: "Low",
      priority: 0,
    });
  }

  recommendations.sort(
    (a, b) => b.priority - a.priority
  );

  const aiScore =
    Math.max(
      0,
      100 - recommendations.length * 8
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
      relative
      overflow-hidden
      rounded-[34px]
      border
      border-white/10
      bg-white/[0.04]
      backdrop-blur-3xl
      p-8
      "
    >
      <motion.div
        className="
        absolute
        -right-28
        -top-28
        h-80
        w-80
        rounded-full
        bg-yellow-400/10
        blur-[120px]
        pointer-events-none
      "
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.15, 0.35, 0.15],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
        }}
      />

      <div className="relative z-10">

        <div className="flex items-center justify-between">

          <div className="flex items-center gap-4">

            <motion.div
              animate={{
                rotate: [0, 6, -6, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
              }}
            >
              <Lightbulb
                size={30}
                className="text-yellow-400"
              />
            </motion.div>

            <div>
              <h3 className="text-2xl font-bold text-white">
                AI Recommendations
              </h3>

              <p className="text-zinc-400">
                Prioritized engineering improvements
              </p>
            </div>

          </div>

          <div className="text-right">

            <p className="text-sm text-zinc-500">
              AI Recommendation Score
            </p>

            <p className="text-3xl font-bold text-cyan-400">
              {aiScore}
            </p>

          </div>

        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{
            once: true,
          }}
          className="mt-10 space-y-5"
        >
          {recommendations.map((item) => (
            <motion.div
              key={item.title}
              variants={itemVariants}
            >
              <motion.div
                whileHover={{
                  x: 10,
                  scale: 1.02,
                }}
                className="
                rounded-2xl
                border
                border-white/10
                bg-white/[0.03]
                p-5
              "
              >
                <div className="flex gap-4">

                  <div className="mt-1">

                    {item.severity === "Critical" ? (
                      <ShieldAlert
                        className="text-red-400"
                        size={20}
                      />
                    ) : item.severity === "High" ? (
                      <AlertTriangle
                        className="text-orange-400"
                        size={20}
                      />
                    ) : (
                      <CheckCircle2
                        className="text-cyan-400"
                        size={20}
                      />
                    )}

                  </div>

                  <div className="flex-1">

                    <div className="flex items-center justify-between">

                      <h4 className="font-semibold text-white">
                        {item.title}
                      </h4>

                      <span
                        className={`
                        rounded-full
                        px-3
                        py-1
                        text-xs
                        font-semibold

                        ${
                          item.severity === "Critical"
                            ? "bg-red-500/20 text-red-300"
                            : item.severity === "High"
                            ? "bg-orange-500/20 text-orange-300"
                            : item.severity === "Medium"
                            ? "bg-yellow-500/20 text-yellow-300"
                            : "bg-cyan-500/20 text-cyan-300"
                        }
                      `}
                      >
                        {item.severity}
                      </span>

                    </div>

                    <p className="mt-3 leading-7 text-zinc-400">
                      {item.description}
                    </p>

                  </div>

                </div>

              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="
          mt-10
          rounded-2xl
          border
          border-cyan-400/20
          bg-cyan-500/10
          p-6
        "
        >
          <div className="flex items-center gap-3">

            <Sparkles
              size={20}
              className="text-cyan-400"
            />

            <span className="font-semibold text-white">
              AI Summary
            </span>

          </div>

          <p className="mt-4 leading-8 text-zinc-300">
            {deploymentReady
              ? "This repository demonstrates strong engineering quality and production readiness. Continue maintaining documentation, testing, and community engagement."
              : `The repository requires ${recommendations.length} engineering improvement${
                  recommendations.length > 1 ? "s" : ""
                } before it reaches enterprise production standards.`}
          </p>
        </motion.div>

      </div>
    </motion.section>
  );
}