"use client";

import { motion } from "framer-motion";

interface ProgressBarProps {
  title: string;
  value: number;
}

export function ProgressBar({
  title,
  value,
}: ProgressBarProps) {
  return (
    <div>

      <div
        className="
        mb-2
        flex
        items-center
        justify-between
        "
      >

        <span className="text-sm text-zinc-400">
          {title}
        </span>

        <span
          className="
          text-sm
          font-semibold
          text-white
          "
        >
          {value}%
        </span>

      </div>

      <div
        className="
        h-3
        overflow-hidden
        rounded-full
        bg-white/10
        "
      >

        <motion.div
          initial={{
            width: 0,
          }}
          animate={{
            width: `${value}%`,
          }}
          transition={{
            duration: 1.5,
          }}
          className="
          h-full
          rounded-full
          bg-gradient-to-r
          from-cyan-400
          via-blue-500
          to-violet-500
          "
        />

      </div>

    </div>
  );
}