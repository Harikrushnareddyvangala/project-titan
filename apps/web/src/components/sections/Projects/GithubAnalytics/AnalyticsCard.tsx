"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface AnalyticsCardProps {
  title: string;
  children: ReactNode;
}

export function AnalyticsCard({
  title,
  children,
}: AnalyticsCardProps) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 20,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      viewport={{
        once: true,
      }}
      whileHover={{
        y: -6,
      }}
      transition={{
        duration: 0.35,
      }}
      className="
        group
        relative
        overflow-hidden
        rounded-3xl
        border
        border-white/[0.08]
        bg-white/[0.04]
        p-7
        backdrop-blur-xl
      "
    >
      <div
        className="
          absolute
          inset-0
          bg-gradient-to-br
          from-cyan-500/5
          via-transparent
          to-violet-500/5
          opacity-0
          transition-opacity
          duration-500
          group-hover:opacity-100
        "
      />

      <div className="relative z-10">
        <h3
          className="
            mb-6
            text-xl
            font-semibold
            text-white
          "
        >
          {title}
        </h3>

        {children}
      </div>
    </motion.div>
  );
}