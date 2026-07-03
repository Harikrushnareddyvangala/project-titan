"use client";

import { motion } from "framer-motion";

export function AuroraBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Cyan Aurora */}
      <motion.div
        className="
          absolute
          -left-40
          -top-32
          h-[34rem]
          w-[34rem]
          rounded-full
          bg-cyan-500/20
          blur-[140px]
        "
        animate={{
          x: [0, 80, -40, 0],
          y: [0, -50, 30, 0],
          scale: [1, 1.2, 0.95, 1],
          rotate: [0, 12, -8, 0],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Violet Aurora */}
      <motion.div
        className="
          absolute
          -right-44
          top-10
          h-[30rem]
          w-[30rem]
          rounded-full
          bg-violet-500/20
          blur-[140px]
        "
        animate={{
          x: [0, -90, 50, 0],
          y: [0, 40, -30, 0],
          scale: [1, 0.9, 1.15, 1],
          rotate: [0, -14, 8, 0],
        }}
        transition={{
          duration: 26,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Blue Aurora */}
      <motion.div
        className="
          absolute
          left-1/2
          bottom-[-10rem]
          h-[32rem]
          w-[32rem]
          -translate-x-1/2
          rounded-full
          bg-blue-500/20
          blur-[150px]
        "
        animate={{
          y: [0, -80, 20, 0],
          x: [0, 40, -40, 0],
          scale: [1, 1.25, 0.9, 1],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Pink Accent */}
      <motion.div
        className="
          absolute
          right-1/4
          bottom-0
          h-72
          w-72
          rounded-full
          bg-fuchsia-500/15
          blur-[120px]
        "
        animate={{
          x: [0, 40, -20, 0],
          y: [0, -40, 30, 0],
          scale: [1, 1.15, 0.95, 1],
        }}
        transition={{
          duration: 24,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Animated Mesh Gradient */}
      <motion.div
        className="
          absolute
          inset-0
          opacity-30
          bg-[radial-gradient(circle_at_20%_20%,rgba(34,211,238,0.20),transparent_30%),radial-gradient(circle_at_80%_30%,rgba(139,92,246,0.20),transparent_35%),radial-gradient(circle_at_50%_100%,rgba(59,130,246,0.18),transparent_35%)]
        "
        animate={{
          opacity: [0.25, 0.45, 0.25],
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Aurora Sweep */}
      <motion.div
        className="
          absolute
          inset-y-0
          -left-1/3
          w-1/2
          bg-gradient-to-r
          from-transparent
          via-cyan-300/10
          to-transparent
          blur-3xl
          rotate-12
        "
        animate={{
          x: ["-20%", "220%"],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      {/* Noise Overlay */}
      <div
        className="
          absolute
          inset-0
          opacity-[0.03]
          mix-blend-soft-light
          bg-[url('/noise.png')]
        "
      />

      {/* Vignette */}
      <div
        className="
          absolute
          inset-0
          bg-[radial-gradient(circle_at_center,transparent_35%,rgba(0,0,0,0.55)_100%)]
        "
      />
    </div>
  );
}