"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

import { TrendingUp } from "lucide-react";

import { AnimatedCounter } from "./AnimatedCounter";

interface KpiCardProps {
  title: string;
  value: number;

  icon: ReactNode;

  subtitle?: string;

  trend?: number;

  prefix?: string;

  suffix?: string;

  decimals?: number;
}

export function KpiCard({
  title,
  value,
  icon,
  subtitle,
  trend,
  prefix,
  suffix,
  decimals,
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
        damping: 20,
      }}
      className="
        group
        relative
        overflow-hidden
        rounded-3xl
        border
        border-white/10
        bg-white/[0.05]
        backdrop-blur-3xl
        p-6
        shadow-[0_15px_45px_rgba(0,0,0,.35)]
      "
    >
      {/* Animated Glow */}
      <motion.div
        className="
          absolute
          -right-12
          -top-12
          h-40
          w-40
          rounded-full
          bg-cyan-500/15
          blur-[80px]
        "
        animate={{
          scale: [1, 1.25, 1],
          opacity: [0.25, 0.55, 0.25],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
        }}
      />

      {/* Animated Border */}
      <motion.div
        className="
          absolute
          inset-0
          rounded-3xl
          border
          border-cyan-400/10
        "
        animate={{
          opacity: [0.15, 0.4, 0.15],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
        }}
      />

      <div className="relative z-10">

        <div className="flex items-center justify-between">

          <div
            className="
              flex
              h-12
              w-12
              items-center
              justify-center
              rounded-2xl
              border
              border-cyan-400/20
              bg-cyan-500/10
              text-cyan-300
            "
          >
            {icon}
          </div>

          {trend !== undefined && (
            <div
              className="
                flex
                items-center
                gap-1
                rounded-full
                border
                border-emerald-400/20
                bg-emerald-500/10
                px-3
                py-1
                text-xs
                font-medium
                text-emerald-300
              "
            >
              <TrendingUp size={12} />

              {trend}%
            </div>
          )}

        </div>

        <div className="mt-8">

          <p
            className="
              text-sm
              font-medium
              uppercase
              tracking-wider
              text-zinc-400
            "
          >
            {title}
          </p>

          <div className="mt-3 text-4xl font-bold">

            <AnimatedCounter
              value={value}
              prefix={prefix}
              suffix={suffix}
              decimals={decimals}
            />

          </div>

          {subtitle && (
            <p
              className="
                mt-3
                text-sm
                leading-relaxed
                text-zinc-500
              "
            >
              {subtitle}
            </p>
          )}

        </div>

      </div>
    </motion.div>
  );
}