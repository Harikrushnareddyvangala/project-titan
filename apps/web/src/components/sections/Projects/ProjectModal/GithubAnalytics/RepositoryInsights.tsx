"use client";

import { motion } from "framer-motion";

import {
  Brain,
  Sparkles,
  TrendingUp,
  ShieldCheck,
  Activity,
} from "lucide-react";

import type { GithubRepository, RepositoryAnalytics } from "@/types/github";

interface RepositoryInsightsProps {
  repository: GithubRepository | null;
  analytics: RepositoryAnalytics | null;
}

/* --------------------------
   Animation Variants
-------------------------- */

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

export function RepositoryInsights({
  repository,
  analytics,
}: RepositoryInsightsProps) {
  if (!repository) return null;

const quality =
  analytics?.quality ?? "Growing";

const engineeringScore =
  analytics?.engineeringScore ?? 0;

const productionScore =
  analytics?.productionScore ?? 0;

const healthScore =
  analytics?.healthScore ?? 0;

const deploymentReady =
  analytics?.deploymentReady ?? false;



const riskLevel =
  analytics?.riskLevel ?? "Medium";
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
        border-white/[0.08]
        bg-white/[0.05]
        backdrop-blur-3xl
        p-6
        lg:p-8
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
    bg-cyan-500/10
    blur-[120px]
    pointer-events-none
  "
  animate={{
    scale: [1, 1.15, 1],
    opacity: [0.15, 0.4, 0.15],
  }}
  transition={{
    duration: 10,
    repeat: Infinity,
  }}
/>
      <div className="relative z-10">

<motion.div
initial={{
    opacity:0,
    y:18,
}}
whileInView={{
    opacity:1,
    y:0,
}}
viewport={{
    once:true,
}}
className="flex items-center gap-4"
>
        <motion.div
  animate={{
    rotate: [0, 6, -6, 0],
  }}
  transition={{
    duration: 6,
    repeat: Infinity,
  }}
>
  <Brain
    size={28}
    className="text-cyan-400"
  />
</motion.div>

        <div>

          <h3 className="text-2xl font-bold text-white">
            AI Repository Insights
          </h3>

          <p className="mt-1 text-zinc-400">
            Automatically generated repository assessment.
          </p>
<motion.p
variants={itemVariants}
className="
mt-2
text-xs
uppercase
tracking-[0.35em]
text-cyan-400
"
>
AI Powered Analysis
</motion.p>
        </div>

      </motion.div>

      <motion.div
  variants={containerVariants}
  initial="hidden"
  whileInView="show"
  viewport={{ once: true }}
  className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-5"
>
       <motion.div variants={itemVariants}>
        <InsightCard
          icon={<TrendingUp size={22} />}
          title="Popularity"
          value={`${repository.stargazers_count} Stars`}
          description="Repository community adoption."
        />
        </motion.div>

        <motion.div variants={itemVariants}>
        <InsightCard
          icon={<ShieldCheck size={22} />}
          title="Repository Quality"
          value={quality}
          description="Estimated engineering maturity."
        />
        </motion.div>

       <motion.div variants={itemVariants}>
        <InsightCard
          icon={<Activity size={22} />}
          title="Community Activity"
          value={`${repository.watchers_count} Watchers`}
          description="Current repository engagement."
        />
        </motion.div>

        <motion.div variants={itemVariants}>
        <InsightCard
    icon={<ShieldCheck size={22} />}
    title="Engineering Score"
    value={`${engineeringScore}%`}
    description="Overall engineering quality."
/>
</motion.div>

<motion.div variants={itemVariants}> 
  <InsightCard
    icon={<TrendingUp size={22} />}
    title="Production Score"
    value={`${productionScore}%`}
    description="Estimated production readiness."
/>
</motion.div>

      </motion.div>

      <motion.div
        className="
          mt-10
          rounded-2xl
          border
          border-cyan-500/20
          bg-cyan-500/10
          p-6
        "
        whileHover={{
  y: -3,
  scale: 1.01,
}}
        animate={{
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
        }}
      >
        <div className="flex items-center gap-3">

          <Sparkles
            className="text-cyan-400"
          />

          <p className="leading-8 text-zinc-300">

            <span className="font-semibold text-white">
    Repository Quality:
  </span>{" "}
  {quality}

  <br /><br />

  Engineering Score:
  <span className="ml-2 font-semibold text-cyan-300">
    {engineeringScore}%
  </span>

  <br />

  Production Score:
  <span className="ml-2 font-semibold text-cyan-300">
    {productionScore}%
  </span>

  <br />

  Repository Health:
  <span className="ml-2 font-semibold text-cyan-300">
    {healthScore}%
  </span>

  <br />

  Deployment Ready:
  <span className="ml-2 font-semibold text-cyan-300">
    {deploymentReady ? "Yes" : "No"}
  </span>

  <br />

  Risk Level:
  <span className="ml-2 font-semibold text-cyan-300">
    {riskLevel}
  </span>
<br /><br />
<span className="font-semibold text-white">
    AI Summary:
  </span>{" "}
  This repository demonstrates{" "}
  <span className="text-cyan-300 font-semibold">
    {quality.toLowerCase()}
  </span>{" "}
  engineering quality with an engineering score of{" "}
  <span className="text-cyan-300 font-semibold">
    {engineeringScore}%
  </span>
  . Its production readiness is rated at{" "}
  <span className="text-cyan-300 font-semibold">
    {productionScore}%
  </span>
  , while repository health remains{" "}
  <span className="text-cyan-300 font-semibold">
    {healthScore}%
  </span>
  . Overall deployment confidence is{" "}
  <span className="text-cyan-300 font-semibold">
    {deploymentReady ? "high" : "moderate"}
  </span>
  {" "}with{" "}
  <span className="text-cyan-300 font-semibold">
    {riskLevel.toLowerCase()}
  </span>{" "}
  operational risk.
          </p>

        </div>

      </motion.div>
      <div
className="
mt-10
h-px
bg-gradient-to-r
from-transparent
via-cyan-400/60
to-transparent
animate-pulse
"
/>
<motion.div
  initial={{ scaleX: 0 }}
  whileInView={{ scaleX: 1 }}
  viewport={{ once: true }}
  transition={{
    duration: 1,
    delay: 0.25,
  }}
  className="
    mt-10
    h-px
    origin-left
    bg-gradient-to-r
    from-cyan-400
    via-blue-500/40
    to-transparent
  "
/>
</div>
    </motion.section>
  );
}

function InsightCard({
  icon,
  title,
  value,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  description: string;
}) {
  return (
    <motion.div
variants={itemVariants}
      whileHover={{
    y:-8,
    scale:1.03,
    boxShadow:
        "0 0 35px rgba(34,211,238,.18)",
}}

transition={{
    type:"spring",
    stiffness:250,
}}
      className="
        relative
        overflow-hidden
        rounded-3xl
        border
        border-white/[0.08]
        bg-white/[0.03]
        p-6
      "
    >
      <motion.div
    className="
      absolute
      -right-10
      -top-10
      h-40
      w-40
      rounded-full
      bg-cyan-500/10
      blur-[80px]
    "
    animate={{
      scale: [1, 1.2, 1],
      opacity: [0.2, 0.4, 0.2],
    }}
    transition={{
      duration: 8,
      repeat: Infinity,
    }}
  />
      <motion.div
  animate={{
    rotate: [0, 6, -6, 0],
  }}
  transition={{
    duration: 6,
    repeat: Infinity,
  }}
  className="text-cyan-400"
>
  {icon}
</motion.div>

      <h4 className="mt-5 text-lg font-semibold text-white">
        {title}
      </h4>

      <p
className="
mt-3
text-3xl
font-black
bg-gradient-to-r
from-cyan-300
to-blue-400
bg-clip-text
text-transparent
"
>
        {value}
      </p>

      <p className="mt-3 text-sm leading-7 text-zinc-400">
        {description}
      </p>

    </motion.div>
  );
}