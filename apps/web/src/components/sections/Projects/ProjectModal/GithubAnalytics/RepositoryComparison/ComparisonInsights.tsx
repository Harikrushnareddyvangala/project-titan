"use client";

import { motion } from "framer-motion";
import {
  Brain,
  ShieldCheck,
  Rocket,
  Trophy,
  Sparkles,
} from "lucide-react";

import type {
  RepositoryAnalytics,
} from "@/types/github";

interface RepositoryComparisonData {
  id: number;
  name: string;
  analytics: RepositoryAnalytics;
}

interface ComparisonInsightsProps {
  repositories: RepositoryComparisonData[];
}

export function ComparisonInsights({
  repositories,
}: ComparisonInsightsProps) {

  if (repositories.length === 0) {

    return null;

  }

  //----------------------------------------
  // AI Ranking
  //----------------------------------------

  const engineeringLeader =
    [...repositories].sort(
      (a, b) =>
        b.analytics.engineeringScore -
        a.analytics.engineeringScore,
    )[0];

  const securityLeader =
    [...repositories].sort(
      (a, b) =>
        b.analytics.securityScore -
        a.analytics.securityScore,
    )[0];

  const productionLeader =
    [...repositories].sort(
      (a, b) =>
        b.analytics.productionScore -
        a.analytics.productionScore,
    )[0];

  const enterpriseLeader =
    [...repositories].sort(
      (a, b) =>
        b.analytics.enterpriseReadiness -
        a.analytics.enterpriseReadiness,
    )[0];

  const hiringLeader =
    [...repositories].sort(
      (a, b) =>

        (

          b.analytics.engineeringScore +

          b.analytics.codeQuality +

          b.analytics.enterpriseReadiness

        ) -

        (

          a.analytics.engineeringScore +

          a.analytics.codeQuality +

          a.analytics.enterpriseReadiness

        ),

    )[0];

  //----------------------------------------

  const insights = [

    {

      icon: Trophy,

      title: "Best Engineering Repository",

      repository: engineeringLeader.name,

      description:

        "Highest engineering maturity and software quality.",

    },

    {

      icon: ShieldCheck,

      title: "Security Champion",

      repository: securityLeader.name,

      description:

        "Strongest security posture among compared repositories.",

    },

    {

      icon: Rocket,

      title: "Production Ready",

      repository: productionLeader.name,

      description:

        "Highest production deployment readiness.",

    },

    {

      icon: Sparkles,

      title: "Enterprise Architecture",

      repository: enterpriseLeader.name,

      description:

        "Most enterprise-ready implementation.",

    },

    {

      icon: Brain,

      title: "AI Hiring Recommendation",

      repository: hiringLeader.name,

      description:

        "Best overall candidate repository for technical interviews.",

    },

  ];

  //----------------------------------------

  return (

    <motion.section

      initial={{
        opacity: 0,
        y: 20,
      }}

      whileInView={{
        opacity: 1,
        y: 0,
      }}

      viewport={{
        once: true,
      }}

      className="
      mt-8
      rounded-3xl
      border
      border-cyan-500/20
      bg-gradient-to-br
      from-zinc-950
      via-zinc-900
      to-black
      p-8
      backdrop-blur-xl
      "

    >

      <div className="mb-8">

        <h2 className="text-2xl font-bold text-white">

          AI Executive Insights

        </h2>

        <p className="mt-2 text-zinc-400">

          Automated executive recommendations generated from repository intelligence.

        </p>

      </div>

      <div className="grid gap-6 lg:grid-cols-2">

        {insights.map((item, index) => {

          const Icon = item.icon;

          return (

            <motion.div

              key={item.title}

              initial={{
                opacity: 0,
                y: 15,
              }}

              whileInView={{
                opacity: 1,
                y: 0,
              }}

              viewport={{
                once: true,
              }}

              transition={{
                delay: index * .08,
              }}

              className="
              rounded-2xl
              border
              border-white/5
              bg-white/[0.03]
              p-6
              "

            >

              <div className="flex items-center gap-3">

                <Icon

                  className="text-cyan-400"

                  size={24}

                />

                <h3

                  className="
                  font-semibold
                  text-white
                  "

                >

                  {item.title}

                </h3>

              </div>

              <p

                className="
                mt-5
                text-xl
                font-bold
                text-cyan-300
                "

              >

                {item.repository}

              </p>

              <p

                className="
                mt-2
                text-zinc-400
                "

              >

                {item.description}

              </p>

            </motion.div>

          );

        })}

      </div>

    </motion.section>

  );

}