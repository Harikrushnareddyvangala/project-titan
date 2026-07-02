"use client";

import { motion } from "framer-motion";

import { ProjectFeatures } from "../ProjectFeatures";
import { ProjectTechStack } from "../ProjectTechStack";

interface ProjectOverviewProps {
  challenge: string;
  solution: string;
  features: string[];
  technologies: string[];
}

function ContentSection({
  title,
  children,
  delay,
}: {
  title: string;
  children: React.ReactNode;
  delay: number;
}) {
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
      transition={{
        duration: 0.45,
        delay,
      }}
      className="
        group
        relative
        overflow-hidden
        rounded-2xl
        border
        border-white/10
        bg-white/[0.03]
        p-8
        backdrop-blur-xl
        transition-all
        duration-300
        hover:-translate-y-1
        hover:border-cyan-500/40
        hover:bg-white/[0.05]
      "
    >
      <div
        className="
          absolute
          inset-0
          rounded-2xl
          bg-gradient-to-r
          from-cyan-500/5
          to-blue-500/5
          opacity-0
          transition-opacity
          duration-300
          group-hover:opacity-100
        "
      />

      <h3 className="mb-5 text-2xl font-bold tracking-tight text-cyan-400">
        {title}
      </h3>

      {children}
    </motion.section>
  );
}

export function ProjectOverview({
  challenge,
  solution,
  features,
  technologies,
}: ProjectOverviewProps) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 20,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.5,
        delay: 0.2,
      }}
      className="space-y-10 p-10"
    >
      <ContentSection
        title="Challenge"
        delay={0.1}
      >
        <p className="leading-8 tracking-wide text-zinc-300">
          {challenge}
        </p>
      </ContentSection>

      <ContentSection
        title="Solution"
        delay={0.2}
      >
        <p className="leading-8 tracking-wide text-zinc-300">
          {solution}
        </p>
      </ContentSection>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{
          opacity: 1,
          y: 0,
        }}
        viewport={{
          once: true,
        }}
        transition={{
          delay: 0.25,
        }}
      >
        <ProjectFeatures
          features={features}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{
          opacity: 1,
          y: 0,
        }}
        viewport={{
          once: true,
        }}
        transition={{
          delay: 0.35,
        }}
      >
        <ProjectTechStack
          technologies={technologies}
        />
      </motion.div>
    </motion.div>
  );
}