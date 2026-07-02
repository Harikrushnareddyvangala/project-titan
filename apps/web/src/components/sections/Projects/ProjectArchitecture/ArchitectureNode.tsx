"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

interface ArchitectureNodeProps {
  title: string;
  subtitle?: string;
  icon: LucideIcon;
  color?: string;
  delay?: number;
}

export function ArchitectureNode({
  title,
  subtitle,
  icon: Icon,
  color = "#22d3ee",
  delay = 0,
}: ArchitectureNodeProps) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        scale: 0.8,
        y: 30,
      }}
      animate={{
        opacity: 1,
        scale: 1,
        y: 0,
      }}
      transition={{
    type: "spring",
    stiffness: 220,
    damping: 18,
}}
      whileHover={{
  scale: 1.08,
  rotateX: -6,
  rotateY: 6,
  y: -10,
}}
style={{
  transformStyle: "preserve-3d",
}}  
      className="group relative"
    >
      {/* Glow */}
      <motion.div
        className="absolute inset-0 rounded-3xl blur-2xl"
        style={{
          background: color,
          opacity: 0.15,
        }}
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.15, 0.3, 0.15],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Card */}
      <div
        className="
          relative
          w-64
          rounded-3xl
          border
          border-white/10
          bg-white/[0.05]
          backdrop-blur-2xl
          p-6
          transition-all
          duration-500
          group-hover:border-cyan-400/60
        "
      >
        {/* Status Dot */}
        <motion.div
          className="absolute right-5 top-5 h-3 w-3 rounded-full"
          style={{
            background: color,
          }}
          animate={{
            scale: [1, 1.4, 1],
            opacity: [0.8, 1, 0.8],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
        />

        {/* Icon */}
        <motion.div
          whileHover={{
            rotate: 8,
          }}
          className="mb-5 inline-flex rounded-2xl p-4"
          style={{
            background: `${color}20`,
          }}
        >
          <motion.div
    animate={{
        y: [0, -5, 0],
    }}
    transition={{
        type: "tween",
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
    }}
>
    <Icon className="h-10 w-10 text-cyan-400" />
</motion.div>
        </motion.div>

        {/* Title */}
        <h3 className="text-xl font-bold text-white">
          {title}
        </h3>

        {/* Subtitle */}
        {subtitle && (
          <p className="mt-2 text-sm leading-6 text-zinc-400">
            {subtitle}
          </p>
        )}
      </div>
    </motion.div>
  );
}