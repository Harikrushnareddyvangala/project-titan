"use client";

import { motion } from "framer-motion";
import {
  Briefcase,
  Trophy,
  ShieldCheck,
  BarChart3,
  Star,
  GitFork,
} from "lucide-react";

import type {
  PortfolioAnalytics,
} from "@/types/github";

interface Props {
  portfolio: PortfolioAnalytics;
}

export function PortfolioIntelligenceDashboard({
  portfolio,
}: Props) {
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
      <div className="flex items-center gap-3">

        <Briefcase
          size={28}
          className="text-cyan-400"
        />

        <div>

          <h3 className="text-2xl font-bold text-white">
            Portfolio Intelligence
          </h3>

          <p className="text-zinc-400">
            Engineering portfolio overview
          </p>

        </div>

      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-3">

        <MetricCard
          icon={<BarChart3 size={22} />}
          title="Repositories"
          value={portfolio.totalRepositories.toString()}
        />

        <MetricCard
          icon={<Star size={22} />}
          title="Total Stars"
          value={portfolio.totalStars.toString()}
        />

        <MetricCard
          icon={<GitFork size={22} />}
          title="Total Forks"
          value={portfolio.totalForks.toString()}
        />

        <MetricCard
          icon={<ShieldCheck size={22} />}
          title="Enterprise"
          value={`${portfolio.enterpriseReadiness}%`}
        />

        <MetricCard
          icon={<Trophy size={22} />}
          title="Portfolio Grade"
          value={portfolio.portfolioGrade}
        />

        <MetricCard
          icon={<Briefcase size={22} />}
          title="Languages"
          value={portfolio.totalLanguages.toString()}
        />

      </div>

      <div
        className="
        mt-10
        rounded-3xl
        border
        border-cyan-400/20
        bg-cyan-500/10
        p-6
        "
      >

        <h4 className="text-lg font-semibold text-white">
          Executive Summary
        </h4>

        <div className="mt-6 space-y-4 text-zinc-300">

          <p>

            <span className="font-semibold text-cyan-300">
              Strongest Repository:
            </span>{" "}

            {portfolio.strongestRepository}

          </p>

          <p>

            <span className="font-semibold text-cyan-300">
              Weakest Repository:
            </span>{" "}

            {portfolio.weakestRepository}

          </p>

          <p>

            Average Engineering Score

            <span className="ml-2 font-semibold text-cyan-300">

              {portfolio.averageEngineeringScore}%

            </span>

          </p>

          <p>

            Average Production Score

            <span className="ml-2 font-semibold text-cyan-300">

              {portfolio.averageProductionScore}%

            </span>

          </p>

        </div>

      </div>

    </motion.section>
  );
}

function MetricCard({
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

      <p className="mt-2 text-3xl font-bold text-white">

        {value}

      </p>

    </motion.div>

  );

}