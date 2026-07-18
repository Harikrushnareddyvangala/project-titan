"use client";

import { motion } from "framer-motion";

interface ProgressBarProps {
  title: string;
  value: number;
}
const itemVariants = {
  hidden: {
    opacity: 0,
    y: 12,
  },
  visible: {
    opacity: 1,
    y: 0,
  },
};

export function ProgressBar({
  title,
  value,
}: ProgressBarProps) {
  return (
    <motion.div
    variants={itemVariants}
    whileHover={{
        x: 4,
    }}
>

      <motion.div
    variants={itemVariants}
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

        <motion.span
    animate={{
        opacity: [0.8, 1, 0.8],
    }}
    transition={{
        duration: 3,
        repeat: Infinity,
    }}
    className="
        text-sm
        font-semibold
        text-white
    "
>
          {value}%
        </motion.span>

      </motion.div>

      <div
    className="
        relative
        h-3
        overflow-hidden
        rounded-full
        border
        border-white/10
        bg-white/5
    "
>
        <motion.div
    initial={{
        width: 0,
    }}
    whileInView={{
        width: `${value}%`,
    }}
    viewport={{
        once: true,
    }}
          animate={{
            width: `${value}%`,
          }}
          transition={{
            duration: 1.5,
          }}
          className="
          relative
          overflow-hidden
          h-full
          rounded-full
          "
        />
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-500" />
        <motion.div
    className="
      absolute
      top-0
      left-0
      h-full
      w-10
      bg-white/30
      blur-sm
      rounded-full
      pointer-events-none
    "
    animate={{
      x: ["-150%", "450%"],
    }}
    transition={{
      duration: 2.5,
      repeat: Infinity,
      ease: "linear",
    }}
  />

     
      </div>
    </motion.div>
    

  );
}