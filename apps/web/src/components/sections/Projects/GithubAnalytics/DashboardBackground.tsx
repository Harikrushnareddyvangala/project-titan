"use client";

import { motion } from "framer-motion";

export function DashboardBackground() {
  return (
    <>
      <motion.div
        className="
          absolute
          -top-40
          -left-40
          h-96
          w-96
          rounded-full
          bg-cyan-500/10
          blur-[140px]
        "
        animate={{
  x: [0, 50, -20, 0],
  y: [0, -40, 20, 0],
}}

transition={{
  type: "tween",
  duration: 18,
  repeat: Infinity,
  ease: "easeInOut",
}}
      />

      <motion.div
        className="
          absolute
          bottom-0
          right-0
          h-80
          w-80
          rounded-full
          bg-violet-500/10
          blur-[140px]
        "
        animate={{
          x: [0, -40, 20, 0],
          y: [0, 30, -30, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
          type: "tween",
    stiffness: 260,
        }}
        whileHover={{
    y: -8,
    scale: 1.02,
}}

      />
    </>
  );
}