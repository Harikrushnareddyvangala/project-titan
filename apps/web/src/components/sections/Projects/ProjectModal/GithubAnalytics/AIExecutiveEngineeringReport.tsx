"use client";

import { motion } from "framer-motion";

import {
  Brain,
  Building2,
  ShieldCheck,
  Rocket,
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

export function AIExecutiveEngineeringReport({
  repository,
  analytics,
}: Props) {

  const engineering =
    analytics?.engineeringScore ?? 0;

  const production =
    analytics?.productionScore ?? 0;

  const health =
    analytics?.healthScore ?? 0;

  const deployment =
    analytics?.deploymentReady ?? false;

  const risk =
    analytics?.riskLevel ?? "Medium";

  const quality =
    analytics?.quality ?? "Growing";

  const strengths: string[] = [];

  if (engineering > 90)
    strengths.push(
      "Excellent engineering practices with maintainable architecture."
    );

  if (production > 90)
    strengths.push(
      "Production-ready deployment confidence."
    );

  if (health > 85)
    strengths.push(
      "Healthy repository maintenance and long-term sustainability."
    );

  if (repository.watchers_count > 10)
    strengths.push(
      "Strong community engagement."
    );

  if (strengths.length === 0)
    strengths.push(
      "Solid engineering foundation with growth potential."
    );

  const risks: string[] = [];

  if (!deployment)
    risks.push(
      "Production deployment pipeline is incomplete."
    );

  if (risk === "High")
    risks.push(
      "High operational risk detected."
    );

  if (!repository.homepage)
    risks.push(
      "No live deployment available."
    );

  if (!repository.license)
    risks.push(
      "Repository license is missing."
    );

  if (risks.length === 0)
    risks.push(
      "No significant engineering risks detected."
    );

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="
      rounded-[36px]
      border
      border-white/10
      bg-white/[0.04]
      backdrop-blur-3xl
      p-8
      "
    >

      <div className="flex items-center gap-3">

        <Building2
          className="text-cyan-400"
          size={28}
        />

        <div>

          <h2 className="text-2xl font-bold text-white">
            AI Executive Engineering Report
          </h2>

          <p className="text-zinc-400">
            Enterprise repository review
          </p>

        </div>

      </div>

      <div className="mt-8 rounded-3xl border border-cyan-500/20 bg-cyan-500/10 p-6">

        <div className="flex items-center gap-3">

          <Brain className="text-cyan-400"/>

          <h3 className="text-lg font-semibold text-white">
            Executive Summary
          </h3>

        </div>

        <p className="mt-5 leading-8 text-zinc-300">

          This repository demonstrates

          <span className="font-semibold text-cyan-300">
            {" "}{quality}
          </span>

          {" "}engineering maturity.

          Engineering Score:
          <span className="font-semibold text-cyan-300">
            {" "}{engineering}%
          </span>

          ,

          Production Score:
          <span className="font-semibold text-cyan-300">
            {" "}{production}%
          </span>

          ,

          Repository Health:
          <span className="font-semibold text-cyan-300">
            {" "}{health}%
          </span>.

        </p>

      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">

        <div>

          <div className="flex items-center gap-3 mb-5">

            <CheckCircle2
              className="text-green-400"
            />

            <h3 className="font-semibold text-white">
              Engineering Strengths
            </h3>

          </div>

          <div className="space-y-4">

            {strengths.map(item => (

              <div
                key={item}
                className="
                rounded-2xl
                border
                border-green-500/20
                bg-green-500/5
                p-4
                text-zinc-300
                "
              >
                {item}
              </div>

            ))}

          </div>

        </div>

        <div>

          <div className="flex items-center gap-3 mb-5">

            <AlertTriangle
              className="text-yellow-400"
            />

            <h3 className="font-semibold text-white">
              Technical Risks
            </h3>

          </div>

          <div className="space-y-4">

            {risks.map(item => (

              <div
                key={item}
                className="
                rounded-2xl
                border
                border-yellow-500/20
                bg-yellow-500/5
                p-4
                text-zinc-300
                "
              >
                {item}
              </div>

            ))}

          </div>

        </div>

      </div>

      <div className="mt-8 rounded-3xl border border-blue-500/20 bg-blue-500/10 p-6">

        <div className="flex items-center gap-3">

          <Rocket className="text-cyan-400"/>

          <h3 className="text-lg font-semibold text-white">
            AI Final Verdict
          </h3>

        </div>

        <p className="mt-5 leading-8 text-zinc-300">

          TITAN concludes this repository is

          <span className="font-bold text-cyan-300">
            {deployment
              ? " suitable for enterprise deployment"
              : " approaching production readiness"}
          </span>

          {" "}with

          <span className="font-bold text-cyan-300">
            {" "}{quality}
          </span>

          {" "}engineering quality.

        </p>

      </div>

    </motion.section>
  );
}
    