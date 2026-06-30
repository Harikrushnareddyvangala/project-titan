"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, GitBranch } from "lucide-react";

interface ProjectActionsProps {
  title: string;
  github: string;
  live: string;
}

export function ProjectActions({
  title,
  github,
  live,
}: ProjectActionsProps) {
  return (
    <motion.div
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
      }}
      className="flex flex-wrap gap-5 pt-4"
    >
      <motion.a
        whileHover={{
          scale: 1.05,
        }}
        whileTap={{
          scale: 0.98,
        }}
        href={github}
        target="_blank"
        rel="noreferrer"
        aria-label={`View GitHub repository for ${title}`}
        className="
          inline-flex
          items-center
          gap-3
          rounded-xl
          border
          border-white/10
          bg-white/5
          px-6
          py-3
          text-white
          backdrop-blur-xl
          transition-all
          duration-300
          hover:border-cyan-500
          hover:bg-cyan-500/10
        "
      >
        <GitBranch className="h-5 w-5" />

        <span>GitHub</span>
      </motion.a>

      <motion.a
        whileHover={{
          scale: 1.05,
        }}
        whileTap={{
          scale: 0.98,
        }}
        href={live}
        target="_blank"
        rel="noreferrer"
        aria-label={`Open live demo for ${title}`}
        className="
          inline-flex
          items-center
          gap-3
          rounded-xl
          bg-cyan-500
          px-6
          py-3
          font-medium
          text-white
          transition-all
          duration-300
          hover:bg-cyan-400
          hover:shadow-lg
          hover:shadow-cyan-500/30
        "
      >
        <span>Live Demo</span>

        <ArrowUpRight className="h-5 w-5" />
      </motion.a>
    </motion.div>
  );
}