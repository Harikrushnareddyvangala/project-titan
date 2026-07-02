"use client";

import { motion } from "framer-motion";

export function ArchitectureBackground() {
  return (
    <>
      {/* Grid */}

      <div
        className="
          absolute
          inset-0
          opacity-[0.05]
        "
        style={{
          backgroundImage: `
            linear-gradient(to right, white 1px, transparent 1px),
            linear-gradient(to bottom, white 1px, transparent 1px)
          `,
          backgroundSize: "48px 48px",
        }}
      />

      {/* Cyan Blob */}

      <motion.div
        className="
          absolute
          -left-48
          -top-48
          h-[420px]
          w-[420px]
          rounded-full
          bg-cyan-500/20
          blur-[140px]
        "
        animate={{
          x: [-40, 40],
          y: [-20, 20],
        }}
        transition={{
          type: "tween",
          duration: 14,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
        }}
      />

      {/* Purple Blob */}

      <motion.div
        className="
          absolute
          -right-40
          bottom-0
          h-[380px]
          w-[380px]
          rounded-full
          bg-violet-500/20
          blur-[140px]
        "
        animate={{
          x: [30, -30],
          y: [20, -20],
        }}
        transition={{
          type: "tween",
          duration: 16,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
        }}
      />
    </>
  );
}