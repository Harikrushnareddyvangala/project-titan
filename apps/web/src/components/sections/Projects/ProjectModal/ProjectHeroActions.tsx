"use client";

import { motion } from "framer-motion";
import { GitBranch, ExternalLink } from "lucide-react";

interface ProjectHeroActionsProps {
  githubUrl?: string;
  liveUrl?: string;
}

export function ProjectHeroActions({
  githubUrl,
  liveUrl,
}: ProjectHeroActionsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.75 }}
      className="mt-8 flex flex-wrap gap-4"
    >
      {githubUrl && (
        <motion.a
          whileHover={{
            scale: 1.05,
            y: -2,
          }}
          whileTap={{
            scale: 0.97,
          }}
          href={githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="
          inline-flex
          items-center
          gap-2
          rounded-xl
          bg-gradient-to-r
          from-cyan-500
          to-blue-600
          px-6
          py-3
          font-semibold
          text-white
          shadow-lg
          shadow-cyan-500/30
          transition-all
          "
        >
          <GitBranch size={20} />
          View Source
        </motion.a>
      )}

      {liveUrl && (
        <motion.a
          whileHover={{
            scale: 1.05,
            y: -2,
          }}
          whileTap={{
            scale: 0.97,
          }}
          href={liveUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="
          inline-flex
          items-center
          gap-2
          rounded-xl
          border
          border-white/15
          bg-white/10
          px-6
          py-3
          font-semibold
          text-white
          backdrop-blur-xl
          "
        >
          <ExternalLink size={20} />
          Live Demo
        </motion.a>
      )}
    </motion.div>
  );
}