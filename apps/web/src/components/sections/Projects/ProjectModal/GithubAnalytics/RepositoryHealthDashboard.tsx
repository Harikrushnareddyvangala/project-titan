"use client";

import { motion } from "framer-motion";
import {
  ShieldCheck,
  Activity,
  Gauge,
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

export function RepositoryHealthDashboard({
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

        <ShieldCheck
          className="text-cyan-400"
          size={28}
        />

        <div>

          <h3 className="text-2xl font-bold text-white">
            Repository Health Dashboard
          </h3>

          <p className="text-zinc-400">
            Enterprise health indicators
          </p>

        </div>

      </div>

      <div className="mt-10 grid md:grid-cols-4 gap-6">

        <HealthCard
          icon={<Activity size={22} />}
          title="Engineering"
          score={engineering}
        />

        <HealthCard
          icon={<Gauge size={22} />}
          title="Production"
          score={production}
        />

        <HealthCard
          icon={<ShieldCheck size={22} />}
          title="Health"
          score={health}
        />

        <div
          className="
          rounded-3xl
          border
          border-cyan-400/20
          bg-cyan-500/10
          p-6
          "
        >
          <CheckCircle2
            className="text-cyan-400"
            size={24}
          />

          <p className="mt-5 text-sm text-zinc-400">
            Deployment
          </p>

          <p className="mt-2 text-xl font-bold text-white">
            {deploymentReady
              ? "Ready"
              : "Not Ready"}
          </p>

        </div>

      </div>

    </motion.section>
  );
}

function HealthCard({
  icon,
  title,
  score,
}: {
  icon: React.ReactNode;
  title: string;
  score: number;
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

      <p className="mt-5 text-sm text-zinc-500">
        {title}
      </p>

      <p className="mt-2 text-3xl font-bold text-white">
        {score}%
      </p>

      <div className="mt-5 h-2 rounded-full bg-white/10">

        <motion.div
          initial={{ width: 0 }}
          whileInView={{
            width: `${score}%`,
          }}
          viewport={{
            once: true,
          }}
          transition={{
            duration: 1,
          }}
          className="
          h-full
          rounded-full
          bg-gradient-to-r
          from-cyan-400
          to-blue-500
          "
        />

      </div>

    </motion.div>
  );
}