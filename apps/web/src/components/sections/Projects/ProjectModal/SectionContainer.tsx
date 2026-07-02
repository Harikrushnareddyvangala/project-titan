"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface SectionContainerProps {
  id?: string;
  title: string;
  subtitle?: string;
  children: ReactNode;
}

export function SectionContainer({
  id,
  title,
  subtitle,
  children,
}: SectionContainerProps) {
  return (
    <motion.section
      id={id}
      initial={{
        opacity: 0,
        y: 30,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      viewport={{
        once: true,
        amount: 0.2,
      }}
      transition={{
        duration: 0.45,
      }}
      className="
        relative
        overflow-hidden
        rounded-[32px]
        border
        border-white/10
        bg-gradient-to-br
        from-white/[0.05]
        to-white/[0.02]
        p-10
        backdrop-blur-2xl
      "
    >
      <div className="mb-10">

        <h2 className="text-3xl font-bold text-white">
          {title}
        </h2>

        {subtitle && (
          <p className="mt-2 text-zinc-400">
            {subtitle}
          </p>
        )}

      </div>

      {children}
    </motion.section>
  );
}