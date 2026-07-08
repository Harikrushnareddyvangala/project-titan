"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface PremiumCardProps {
  children: ReactNode;
  className?: string;
}

export function PremiumCard({
  children,
  className = "",
}: PremiumCardProps) {
  return (
    <motion.div
      whileHover={{
        y: -6,
        scale: 1.01,
      }}
      transition={{
        type: "spring",
        stiffness: 240,
        damping: 22,
      }}
      className={`
relative
overflow-hidden
rounded-[34px]
border
border-white/[0.08]
bg-white/[0.05]
backdrop-blur-3xl
shadow-[0_30px_90px_rgba(0,0,0,.45)]
${className}
`}
    >
      {/* Background Glow */}

      <motion.div
        className="
absolute
-right-24
-top-24
h-72
w-72
rounded-full
bg-cyan-500/10
blur-[130px]
"
        animate={{
          scale: [1, 1.15, 1],
          opacity: [.15, .45, .15],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
        }}
      />

      {/* Shine */}

      <motion.div
        className="
absolute
inset-y-0
-left-40
w-40
bg-gradient-to-r
from-transparent
via-white/10
to-transparent
rotate-12
"
        animate={{
          x: [-200, 900],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
}