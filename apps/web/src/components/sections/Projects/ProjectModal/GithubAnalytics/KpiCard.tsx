"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { AnimatedCounter } from "./AnimatedCounter";

interface KpiCardProps {
  title: string;
  value: number;
  icon: ReactNode;
  color: string;
  subtitle?: string;
}

export function KpiCard({
  title,
  value,
  icon,
  color,
  subtitle,
}: KpiCardProps) {
  return (
    <motion.div
      whileHover={{
        y: -8,
        scale: 1.02,
      }}
      transition={{
        type: "spring",
        stiffness: 280,
      }}
      className="
        group
        relative
        overflow-hidden
        rounded-[30px]
        border
        border-white/[0.08]
        bg-white/[0.05]
        backdrop-blur-3xl
        p-6
      "
    >
      <motion.div
        className="
          absolute
          -right-16
          -top-16
          h-44
          w-44
          rounded-full
          blur-[90px]
        "
        style={{
          background: color,
        }}
        animate={{
          scale: [1, 1.25, 1],
          opacity: [0.2, 0.45, 0.2],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
        }}
      />

      <div className="relative z-10">

        <div className="flex items-center justify-between">

          <div
            className="
              flex
              h-14
              w-14
              items-center
              justify-center
              rounded-2xl
              border
              border-white/[0.08]
              bg-white/5
            "
          >
            {icon}
          </div>

        </div>

        <h4 className="mt-6 text-sm text-zinc-400">
          {title}
        </h4>

        <p className="mt-3 text-4xl font-bold text-white">
          <AnimatedCounter value={value} />
        </p>

        {subtitle && (
          <p className="mt-2 text-sm text-zinc-500">
            {subtitle}
          </p>
        )}

      </div>

    </motion.div>
  );
}