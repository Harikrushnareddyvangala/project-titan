"use client";

import { motion } from "framer-motion";
import {
  Code2,
  CheckCircle2,
  FileText,
  Bug,
  Gauge,
} from "lucide-react";

import type {
  GithubRepository,
  RepositoryAnalytics,
} from "@/types/github";

interface Props {
  repository: GithubRepository;
  analytics: RepositoryAnalytics | null;
}

export function RepositoryCodeQualityAnalysis({
  repository,
  analytics,
}: Props) {

  const engineering =
    analytics?.engineeringScore ?? 0;

  const production =
    analytics?.productionScore ?? 0;

  const health =
    analytics?.healthScore ?? 0;

  const maintainability =
    Math.round((engineering + health) / 2);

  const documentation =
    repository.description ? 90 : 40;

  const technicalDebt =
    Math.max(5, 100 - maintainability);

  const quality =
    Math.round(
      (
        engineering +
        production +
        health +
        documentation
      ) / 4
    );

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
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

        <Code2
          className="text-cyan-400"
          size={28}
        />

        <div>

          <h2 className="text-2xl font-bold text-white">
            AI Code Quality Intelligence
          </h2>

          <p className="text-zinc-400">
            AI engineering quality assessment
          </p>

        </div>

      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-5">

        <Metric
          icon={<Gauge size={20} />}
          title="Quality"
          value={`${quality}%`}
        />

        <Metric
          icon={<CheckCircle2 size={20} />}
          title="Maintainability"
          value={`${maintainability}%`}
        />

        <Metric
          icon={<FileText size={20} />}
          title="Documentation"
          value={`${documentation}%`}
        />

        <Metric
          icon={<Bug size={20} />}
          title="Technical Debt"
          value={`${technicalDebt}%`}
        />

        <Metric
          icon={<Code2 size={20} />}
          title="Engineering"
          value={`${engineering}%`}
        />

      </div>

      <motion.div
        whileHover={{ scale: 1.01 }}
        className="
        mt-10
        rounded-3xl
        border
        border-cyan-400/20
        bg-cyan-500/10
        p-6
        "
      >

        <h3 className="text-lg font-semibold text-white">
          AI Quality Assessment
        </h3>

        <p className="mt-5 leading-8 text-zinc-300">

          TITAN estimates the repository code quality as

          <span className="ml-2 font-semibold text-cyan-300">
            {quality}%
          </span>

          based on engineering quality,
          production readiness,
          maintainability,
          repository health,
          and documentation.

          <br /><br />

          Maintainability:
          <span className="ml-2 text-cyan-300">
            {maintainability}%
          </span>

          <br />

          Documentation:
          <span className="ml-2 text-cyan-300">
            {documentation}%
          </span>

          <br />

          Technical Debt:
          <span className="ml-2 text-cyan-300">
            {technicalDebt}%
          </span>

        </p>

      </motion.div>

    </motion.section>
  );
}

function Metric({
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
        y: -5,
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