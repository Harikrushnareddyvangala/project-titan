"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface GithubCardProps {
  children: ReactNode;
  className?: string;
}

export function GithubCard({
  children,
  className = "",
}: GithubCardProps) {
  return (
    <motion.section
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
        scale: 1.01,
      }}
      transition={{
        duration: 0.35,
      }}
      className={`
        group
relative
overflow-hidden
h-full
rounded-[30px]
border
border-white/[0.08]
bg-gradient-to-br
from-white/[0.06]
to-white/[0.02]
backdrop-blur-2xl
p-8
transition-all
duration-500
hover:border-cyan-400/40
hover:shadow-[0_25px_60px_rgba(34,211,238,0.12)]
${className}
`}
    >
      {/* animated glow */}

      <div
        className="
absolute
inset-0
bg-gradient-to-br
from-cyan-500/5
via-transparent
to-blue-500/5
opacity-0
transition-opacity
duration-500
group-hover:opacity-100
"
      />

      {/* content */}

      <div className="relative z-10">
        {children}
      </div>
    </motion.section>
  );
}