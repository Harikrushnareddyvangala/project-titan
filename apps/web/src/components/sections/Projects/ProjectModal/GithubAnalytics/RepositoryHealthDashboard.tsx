"use client";

import { motion } from "framer-motion";
import {
  ShieldCheck,
  Activity,
  Gauge,
  CheckCircle2,
  Brain,
  AlertTriangle,
  Rocket,
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

  const risk =
  analytics?.riskLevel ?? "Medium";

const quality =
  analytics?.quality ?? "Growing";

const overallScore =
  Math.round(
    (engineering +
      production +
      health) / 3,
  );

const verdict =
  overallScore >= 90
    ? "Enterprise Ready"
    : overallScore >= 80
    ? "Production Ready"
    : overallScore >= 65
    ? "Development Ready"
    : "Needs Improvement";

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

      <div className="mt-10 grid gap-6 lg:grid-cols-2">

<div>

<motion.div

animate={{
scale:[1,1.05,1],
}}

transition={{
duration:5,
repeat:Infinity,
}}

className="
mx-auto
flex
h-56
w-56
items-center
justify-center
rounded-full
border-[10px]
border-cyan-500/30
bg-cyan-500/10
"

>

<div>

<p className="text-center text-6xl font-bold text-white">

{overallScore}

</p>

<p className="mt-2 text-center text-cyan-300">

Overall Score

</p>

</div>

</motion.div>

</div>
        <div className="space-y-5">

<HealthCard
    icon={<Activity size={22}/>}
    title="Engineering"
    score={engineering}
/>

<HealthCard
    icon={<Rocket size={22}/>}
    title="Production"
    score={production}
/>

<HealthCard
    icon={<ShieldCheck size={22}/>}
    title="Repository Health"
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

<Brain
className="text-cyan-400"
size={24}
/>

<p className="mt-5 text-sm text-zinc-400">

AI Verdict

</p>

<p className="mt-2 text-xl font-bold text-white">

{verdict}

</p>

<p className="mt-4 text-sm text-zinc-400">

Risk

<span className="ml-2 font-semibold text-cyan-300">

{risk}

</span>

</p>

<p className="mt-3 text-sm text-zinc-400">

Deployment

<span className="ml-2 font-semibold text-cyan-300">

{deploymentReady ? "Ready" : "Not Ready"}

</span>

</p>

</div>

</div>
</div>
<motion.div

whileHover={{
scale:1.01,
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

<h3 className="text-xl font-semibold text-white">

AI Executive Summary

</h3>

<p className="mt-6 leading-8 text-zinc-300">

Overall Repository Quality

<span className="ml-2 font-semibold text-cyan-300">

{quality}

</span>

<br/><br/>

Repository Status

<span className="ml-2 font-semibold text-cyan-300">

{verdict}

</span>

<br/>

Risk Level

<span className="ml-2 font-semibold text-cyan-300">

{risk}

</span>

<br/>

Engineering Score

<span className="ml-2 font-semibold text-cyan-300">

{engineering}%

</span>

<br/>

Production Score

<span className="ml-2 font-semibold text-cyan-300">

{production}%

</span>

</p>

</motion.div>

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