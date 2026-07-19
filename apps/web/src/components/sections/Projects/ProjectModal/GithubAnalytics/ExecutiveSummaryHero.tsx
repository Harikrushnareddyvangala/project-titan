"use client";

import { motion } from "framer-motion";
import { formatDistanceToNowStrict } from "date-fns";

import {
  Sparkles,
  Brain,
  GitFork,
  Activity,
  ShieldCheck,
  Cpu,
  Server,
  Database,
} from "lucide-react";

import type {
  GithubRepository,
  GithubLanguages,
  RepositoryAnalytics,
} from "@/types/github";

interface ExecutiveSummaryHeroProps {
  repository: GithubRepository;
  languages: GithubLanguages;
  analytics: RepositoryAnalytics | null;
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

export function ExecutiveSummaryHero({
  repository,
  languages,
  analytics,
}: ExecutiveSummaryHeroProps) {
  const primaryLanguage =
    Object.entries(languages)
      .sort((a, b) => b[1] - a[1])[0]?.[0] ??
    "Unknown";

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



  const lastUpdated = formatDistanceToNowStrict(
  new Date(repository.updated_at),
);

  return (
    <motion.section
    id = "executive"
      initial={{
        opacity: 0,
        y: 20,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      className="
        relative
        overflow-hidden
        rounded-[40px]
        border
        border-white/10
        bg-gradient-to-br
        from-cyan-500/10
        via-blue-500/5
        to-transparent
        p-8
      "
    >
      <motion.div
    className="
        absolute
        -right-24
        -top-24
        h-80
        w-80
        rounded-full
        bg-cyan-500/10
        blur-[140px]
    "
    animate={{
        scale:[1,1.2,1],
        opacity:[0.15,0.45,0.15],
    }}
    transition={{
        duration:10,
        repeat:Infinity,
    }}
/>

      <div className="relative z-10">

        <motion.div
initial={{
opacity:0,
x:-20,
}}
animate={{
opacity:1,
x:0,
}}
transition={{
delay:.15,
}}
className="flex items-center gap-3"
>

          <Sparkles
            className="
              text-cyan-400
            "
          />

          <span
            className="
              text-sm
              uppercase
              tracking-[0.25em]
              text-cyan-300
            "
          >
            Executive Summary
          </span>

        </motion.div>

        <motion.h2
initial={{
opacity:0,
y:20,
}}
animate={{
opacity:1,
y:0,
}}
transition={{
delay:.2,
}}
className="
            mt-4
            text-4xl
            font-bold
            text-white
          "
        >
          {repository.name}
        </motion.h2>

        <motion.p
        initial={{
opacity:0,
}}
animate={{
opacity:1,
}}
transition={{
delay:.35,
}}
          className="
            mt-4
            max-w-3xl
            text-zinc-300
            leading-8
          "
        >
          This repository demonstrates
enterprise-grade engineering,
strong maintainability,
excellent production readiness,
and AI-evaluated software quality.

Overall engineering score:
{" "}{engineering}/100.
        </motion.p>

        <motion.div
className="mt-10
grid
gap-6
sm:grid-cols-2
lg:grid-cols-3
xl:grid-cols-6"
initial="hidden"
whileInView="show"
viewport={{once:true}}
variants={containerVariants}
>
          <motion.div variants={itemVariants}>
          <MetricCard
    icon={<Activity size={18} />}
    label="Engineering"
    value={`${engineering}%`}
/> 
</motion.div>

<motion.div variants={itemVariants}>
<MetricCard
    icon={<ShieldCheck size={18} />}
    label="Production"
    value={`${production}%`}
/>
</motion.div>
<motion.div variants={itemVariants}>
<MetricCard
    icon={<Sparkles size={18} />}
    label="Health"
    value={`${health}%`}
/>
</motion.div>

<motion.div variants={itemVariants}>
<MetricCard
    icon={<Brain size={18} />}
    label="Risk"
    value={risk}
/>
</motion.div>
<motion.div variants={itemVariants}>
<MetricCard
    icon={<GitFork size={18} />}
    label="Language"
    value={primaryLanguage}
/>
</motion.div>
<motion.div variants={itemVariants}>
  <MetricCard
    icon={<Activity size={18} />}
    label="Updated"
    value={`${lastUpdated} ago`}
/>
</motion.div>

        </motion.div>
<motion.div
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
        AI Executive Summary
    </h3>

    <p className="mt-5 leading-8 text-zinc-300">
This repository has been evaluated using Project TITAN&apos;s AI engineering
framework.

It currently achieves an
<span className="font-semibold text-cyan-300">
 {" "}{engineering}% Engineering Score
</span>,
a
<span className="font-semibold text-cyan-300">
 {" "}{production}% Production Readiness
</span>,
and an overall repository quality rating of
<span className="font-semibold text-cyan-300">
 {" "}{quality}
</span>.

The repository is currently

<span className="font-semibold text-cyan-300">
 {deploymentReady
   ? " production ready"
   : " not yet production ready"}
</span>

{" "}with

<span className="font-semibold text-cyan-300">
 {" "}{risk}{" "}
</span>

deployment risk.
</p>
<div className="mt-8 grid md:grid-cols-2 gap-5">

<MetricCard
icon={<Cpu size={18}/>}
label="Frontend"
value={analytics?.frontend ?? "Unknown"}
/>

<MetricCard
icon={<Server size={18}/>}
label="Backend"
value={analytics?.backend ?? "Unknown"}
/>

<MetricCard
icon={<Database size={18}/>}
label="Database"
value={analytics?.database ?? "Unknown"}
/>

<MetricCard
icon={<Brain size={18}/>}
label="AI"
value={analytics?.aiFramework ?? "None"}
/>

</div>
</motion.div>
<motion.div
initial={{ scaleX: 0 }}
whileInView={{ scaleX: 1 }}
viewport={{ once: true }}
transition={{
    duration: 1,
    delay: .35,
}}
className="
mt-10
h-px
origin-left
bg-gradient-to-r
from-cyan-400
via-blue-500
to-transparent
"
/>
      </div>

    </motion.section>
  );
}

function MetricCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <motion.div
whileHover={{
    y: -6,
    scale: 1.03,
}}
transition={{
    type: "spring",
    stiffness: 260,
}}
      className="
        rounded-2xl
        border
        border-white/10
        bg-white/[0.04]
        p-4
      "
    >
      <div
        className="
          flex
          items-center
          gap-2
          text-cyan-400
        "
      >
        {icon}
      </div>

      <p
        className="
          mt-3
          text-xs
          uppercase
          tracking-wider
          text-zinc-500
        "
      >
        {label}
      </p>

      <p
        className="
          mt-2
          text-xl
          font-semibold
          text-white
        "
      >
        {value}
      </p>
    </motion.div>
  );
}