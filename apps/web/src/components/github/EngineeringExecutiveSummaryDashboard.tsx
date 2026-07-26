"use client";

import { motion } from "framer-motion";
import {
  BarChart3,
  Award,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";

import type {
  EngineeringExecutiveSummary,
} from "@/lib/github/reports/engineeringExecutiveSummaryEngine";

interface Props {
  summary: EngineeringExecutiveSummary;
}

export function EngineeringExecutiveSummaryDashboard({
  summary,
}: Props) {
  return (
    <section
      className="
      rounded-[34px]
      border
      border-white/10
      bg-white/[0.04]
      backdrop-blur-3xl
      p-8
      space-y-8
      "
    >
      <div className="flex items-center gap-3">
        <BarChart3
          className="text-cyan-400"
          size={30}
        />

        <div>
          <h2 className="text-2xl font-bold text-white">
            Engineering Intelligence Report
          </h2>

          <p className="text-zinc-400">
            Executive Summary
          </p>
        </div>
      </div>

      <div
        className="
        grid
        md:grid-cols-3
        gap-6
        "
      >
        <Metric
          title="Overall Score"
          value={`${summary.overallScore}`}
        />

        <Metric
          title="Grade"
          value={summary.engineeringGrade}
        />

        <Metric
          title="Health"
          value={summary.repositoryHealth}
        />
      </div>

      <Panel
        icon={<Award className="text-emerald-400" />}
        title="Strengths"
        items={summary.strengths}
      />

      <Panel
        icon={<AlertTriangle className="text-amber-400" />}
        title="Improvement Areas"
        items={summary.improvementAreas}
      />

      <div
        className="
        rounded-3xl
        border
        border-cyan-500/20
        bg-cyan-500/10
        p-6
        "
      >
        <h3 className="text-xl font-semibold text-cyan-300">
          Executive Summary
        </h3>

        <p className="mt-4 leading-8 text-zinc-300">
          {summary.executiveSummary}
        </p>

        <p className="mt-6 leading-8 text-white">
          <strong>Recommendation:</strong>{" "}
          {summary.recommendation}
        </p>
      </div>
    </section>
  );
}

function Metric({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="
      rounded-3xl
      border
      border-white/10
      bg-white/[0.03]
      p-6
      "
    >
      <p className="text-zinc-500">
        {title}
      </p>

      <h2 className="mt-3 text-3xl font-bold text-white">
        {value}
      </h2>
    </motion.div>
  );
}

function Panel({
  title,
  items,
  icon,
}: {
  title: string;
  items: string[];
  icon: React.ReactNode;
}) {
  return (
    <div
      className="
      rounded-3xl
      border
      border-white/10
      bg-white/[0.03]
      p-6
      "
    >
      <div className="flex items-center gap-2">
        {icon}

        <h3 className="text-xl font-semibold text-white">
          {title}
        </h3>
      </div>

      <div className="mt-5 space-y-3">
        {items.map((item) => (
          <div
            key={item}
            className="flex gap-3"
          >
            <CheckCircle2
              className="text-cyan-400 mt-1"
              size={18}
            />

            <span className="text-zinc-300">
              {item}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}