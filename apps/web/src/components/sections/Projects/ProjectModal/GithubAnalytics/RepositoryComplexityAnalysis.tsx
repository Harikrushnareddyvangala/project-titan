"use client";

import { motion } from "framer-motion";
import {
  Layers,
  Brain,
  Activity,
  BarChart3,
} from "lucide-react";

import type {
  GithubRepository,
  GithubLanguages,
  RepositoryAnalytics,
} from "@/types/github";

interface Props {
  repository: GithubRepository;
  languages: GithubLanguages;
   analytics: RepositoryAnalytics | null;
}

export function RepositoryComplexityAnalysis({
  repository,
  languages,
  analytics,
}: Props) {

  const languageCount = Object.keys(languages).length;

const engineering =
  analytics?.engineeringScore ?? 0;

const production =
  analytics?.productionScore ?? 0;

const health =
  analytics?.healthScore ?? 0;

const deploymentReady =
  analytics?.deploymentReady ?? false;

const complexity = Math.min(
  100,
  languageCount * 10 +
  engineering * 0.30 +
  production * 0.30 +
  health * 0.30
);

const maintainability =
  Math.round((engineering + health) / 2);

const scalability =
  Math.round((production + engineering) / 2);

const technicalDebt =
  Math.max(5, 100 - maintainability);

const enterpriseReadiness =
  Math.round(
    (
      maintainability +
      scalability +
      production
    ) / 3
  );

const level =
  complexity >= 90
    ? "Enterprise"
    : complexity >= 75
    ? "Advanced"
    : complexity >= 60
    ? "Professional"
    : "Growing";
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

        <Brain
          className="text-cyan-400"
          size={28}
        />

        <div>

          <h3 className="text-2xl font-bold text-white">
            Repository Complexity Analysis
          </h3>

          <p className="text-zinc-400">
            AI-estimated software complexity
          </p>

        </div>

      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-5">

<Card
    icon={<Layers size={20} />}
    title="Complexity"
    value={`${complexity}%`}
/>

<Card
    icon={<Activity size={20} />}
    title="Maintainability"
    value={`${maintainability}%`}
/>

<Card
    icon={<BarChart3 size={20} />}
    title="Scalability"
    value={`${scalability}%`}
/>

<Card
    icon={<Brain size={20} />}
    title="Enterprise"
    value={`${enterpriseReadiness}%`}
/>

<Card
    icon={<Brain size={20} />}
    title="Level"
    value={level}
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
        border-cyan-400/20
        bg-cyan-500/10
        p-6
        "
      >

        <h4 className="text-lg font-semibold text-white">
          AI Assessment
        </h4>

        <p className="mt-5 leading-8 text-zinc-300">

TITAN estimates an overall engineering complexity of

<span className="ml-2 font-semibold text-cyan-300">
{complexity.toFixed(0)}%
</span>

which places this repository in the

<span className="ml-2 font-semibold text-cyan-300">
{level}
</span>

category.

<br /><br />

Maintainability:
<span className="ml-2 font-semibold text-cyan-300">
{maintainability}%
</span>

<br />

Scalability:
<span className="ml-2 font-semibold text-cyan-300">
{scalability}%
</span>

<br />

Technical Debt:
<span className="ml-2 font-semibold text-cyan-300">
{technicalDebt}%
</span>

<br />

Enterprise Readiness:
<span className="ml-2 font-semibold text-cyan-300">
{enterpriseReadiness}%
</span>

<br />

Deployment Ready:
<span className="ml-2 font-semibold text-cyan-300">
{deploymentReady ? "Yes" : "No"}
</span>

</p>

      </motion.div>

    </motion.section>
  );
}

function Card({
  icon,
  title,
  value,
}:{
  icon: React.ReactNode;
  title: string;
  value: string;
}){

  return(

    <motion.div
      whileHover={{
        y:-5,
        scale:1.02,
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