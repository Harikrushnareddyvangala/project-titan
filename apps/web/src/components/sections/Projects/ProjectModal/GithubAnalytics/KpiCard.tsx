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
const containerVariants = {
  hidden: {},
  visible: {
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
  visible: {
    opacity: 1,
    y: 0,
  },
};
export function KpiCard({
  title,
  value,
  icon,
  color,
  subtitle,
}: KpiCardProps) {
  return (
    <motion.div
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true }}
    variants={containerVariants}
    whileHover={{
        y:-8,
        scale:1.02,
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
    scale:[1,1.3,1],
    rotate:[0,20,0],
    opacity:[0.18,0.5,0.18],
}}
        transition={{
          duration: 6,
          repeat: Infinity,
        }}
      />

      <div className="relative z-10">

        <div className="flex items-center justify-between">

          <motion.div
    variants={itemVariants}
    animate={{
        scale:[1,1.06,1],
    }}
    transition={{
        duration:3,
        repeat:Infinity,
    }}
    style={{
    boxShadow: `0 0 30px ${color}30`,
}}
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
          </motion.div>

        </div>

        <motion.h4
    variants={itemVariants} className="mt-6 text-sm text-zinc-400">
          {title}
        </motion. h4>

        
          <motion.div variants={itemVariants}>

<AnimatedCounter
    value={value}
    formatter={(v)=>Math.round(v).toLocaleString()}
    className="mt-3 text-4xl font-bold text-white"
/>

</motion.div>
        

        {subtitle && (
          <motion.p
    variants={itemVariants} className="mt-2 text-sm text-zinc-500">
            {subtitle}
          </motion.p>
        )}
        <motion.div
    variants={itemVariants}
    className="
        mt-6
        h-px
        bg-gradient-to-r
        from-cyan-400
        via-blue-500
        to-transparent
    "
/>

      </div>

    </motion.div>
  );
}