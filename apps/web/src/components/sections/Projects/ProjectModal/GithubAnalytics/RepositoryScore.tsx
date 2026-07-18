"use client";

import { motion } from "framer-motion";
import { Award, BrainCircuit } from "lucide-react";
import { ProgressBar } from "./ProgressBar";

import type { GithubRepository, RepositoryAnalytics, } from "@/types/github";
import { AnimatedCounter } from "./AnimatedCounter";
interface RepositoryScoreProps {
  repository: GithubRepository;
  analytics: RepositoryAnalytics | null;
}
const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.12,
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
export function RepositoryScore({
  repository,
  analytics,
}: RepositoryScoreProps) {
  const score =
    analytics?.engineeringScore ?? 0;



  const grade =
    score >= 95
    ? "A+"
    : score >= 90
    ? "A"
    : score >= 80
    ? "B"
    : score >= 70
    ? "C"
    : "D";

  const description =
    analytics?.quality ??
  "Unknown";
  
  const communityScore = Math.min(
  100,
  Math.round(
    repository.stargazers_count * 2 +
    repository.forks_count * 3
  )
);

const maintenanceScore =
Math.max(
  40,
  100 -
  repository.open_issues_count * 4
);

const popularityScore =
Math.min(
  100,
  Math.round(
    repository.watchers_count * 4 +
    repository.stargazers_count
  )
);

  return (
    <motion.div
    initial="hidden"
    whileInView="show"
    viewport={{ once: true }}
    variants={containerVariants}
    whileHover={{
        y:-8,
scale:1.015,
      }}
      transition={{
        type: "spring",
        stiffness: 250,
      }}
      className="
        relative
        overflow-hidden
        rounded-[34px]
        border
        border-white/10
        bg-white/[0.05]
        backdrop-blur-3xl
        p-6
        lg:p-8
        min-h-[280px]
      "
    >
      <motion.div
        className="
          absolute
          -right-24
          -top-24
          h-60
          w-60
          rounded-full
          bg-cyan-500/10
          blur-[120px]
        "
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.45, 0.2],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
        }}
      />

      <div className="relative z-10">

        <div className="flex items-center gap-3">

          <motion.div
    variants={itemVariants}
    animate={{
        rotate: [0, 8, -8, 0],
        scale: [1, 1.06, 1],
    }}
    transition={{
        duration: 6,
        repeat: Infinity,
    }}
    className="
relative
flex
h-12
w-12
items-center
justify-center
rounded-2xl
border
border-cyan-400/20
bg-cyan-500/10
shadow-[0_0_35px_rgba(34,211,238,.18)]
"
          >
            <Award
              size={22}
              className="text-cyan-300"
            />
          </motion.div>

          <motion.div variants={itemVariants}>

            <h3 className="text-lg font-semibold text-white">
              Repository Score
            </h3>

            <p className="text-sm text-zinc-400">
              Machine Learning Repository Evaluation
            </p>

          </motion.div>

        </div>

        <div className="mt-10">

          <motion.div
          variants = {itemVariants}
            initial={{
              opacity: 0,
              y: 25,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
          >
            <div
className="
flex
items-end
gap-4
pb-3
border-b
border-white/10
"
>
              <span className="text-6xl font-bold text-white">
                <motion.div
    animate={{
        scale: [1, 1.05, 1],
    }}
    transition={{
        duration: 3,
        repeat: Infinity,
    }}
>
    <AnimatedCounter
        value={score}
    />
</motion.div> 
              </span>

              <span className="mb-2 text-zinc-400">
                /100
              </span>

            </div>

            <motion.div
    animate={{
        scale: [1, 1.04, 1],
    }}
    transition={{
        duration: 2,
        repeat: Infinity,
    }}
              className="
                mt-5
                inline-flex
                rounded-full
                border
                border-emerald-400/20
                bg-emerald-500/10
                px-4
                py-2
                text-sm
                font-semibold
                text-emerald-300
              "
            >
              <p
className="
mb-2
text-xs
uppercase
tracking-[0.3em]
text-zinc-500
"
>
Engineering Grade
</p>
              ★★★★★ {grade}
            </motion.div>

            <motion.div
    variants={containerVariants}
    className="mt-8 space-y-7"
>

  <motion.div
    variants={itemVariants}
    whileHover={{
        scale: 1.02,
        y: -4,
        boxShadow: "0 0 45px rgba(34,211,238,.18)"
    }}
    transition={{
        type: "spring",
        stiffness: 260,
    }}
    className="
    rounded-2xl
    border
    border-cyan-400/20
    bg-cyan-500/5
    p-5
    "
  >

    <div className="flex items-center gap-3">

      <BrainCircuit
        className="text-cyan-400"
        size={20}
      />

      <span
        className="
        font-semibold
        text-cyan-300
        "
      >
        AI Assessment
      </span>

    </div>

    <p
      className="
      mt-4
      leading-7
      text-zinc-300
      "
    >
      {description}
    </p>

  </motion.div>

<motion.div variants={itemVariants}>
  <ProgressBar
    title="Community"
    value={communityScore}
  />
  </motion.div>
<motion.div variants={itemVariants}>
  <ProgressBar
    title="Maintenance"
    value={maintenanceScore}
  />
</motion.div>

 <motion.div variants={itemVariants}>
   <ProgressBar
    title="Popularity"
    value={popularityScore}
  />
  </motion.div>

</motion.div>

          </motion.div>

        </div>

</div>
<motion.div
    initial={{
        scaleX: 0,
    }}
    whileInView={{
        scaleX: 1,
    }}
    viewport={{
        once: true,
    }}
    transition={{
        duration: 1,
        delay: 0.5,
    }}
    className="
        mt-8
        h-px
        origin-left
        bg-gradient-to-r
        from-cyan-400
        via-blue-500
        to-transparent
    "
/>
      </motion.div>

    
  );
}