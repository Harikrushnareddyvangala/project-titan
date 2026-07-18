"use client";

import { motion } from "framer-motion";
import {
  Activity,
  GitBranch,
  Sparkles,
} from "lucide-react";

export function AnalyticsHeader() {
  return (
    <motion.section
      initial={{
        opacity: 0,
        y: -20,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
  duration: 0.6,
}}
      className="
      relative
      overflow-hidden
      rounded-3xl
      border
      border-white/10
      bg-gradient-to-br
      from-cyan-500/10
      via-zinc-900
      to-violet-500/10
      p-6
      lg:p-8
      "
    >
      <motion.div
  className="
    absolute
    -right-28
    -top-28
    h-72
    w-72
    rounded-full
    bg-cyan-500/10
    blur-[140px]
  "
  animate={{
    scale: [1, 1.15, 1],
    opacity: [0.15, 0.4, 0.15],
  }}
  transition={{
    duration: 10,
    repeat: Infinity,
  }}
/>
      <div className="flex items-start justify-between">

        <div>

          <motion.div
  animate={{
    scale: [1, 1.03, 1],
  }}
  transition={{
    duration: 2,
    repeat: Infinity,
  }}
  className="
    inline-flex
    items-center
    gap-2
    rounded-full
    border
    border-cyan-400/20
    bg-cyan-500/10
    px-4
    py-2
    text-sm
    text-cyan-300
  "
>
            <Sparkles size={16} />

            Live GitHub Intelligence
          </motion.div>

          <h2
            className="
            mt-5
            text-4xl
            font-black
            text-white
            "
          >
            Repository Dashboard
          </h2>

          <p
            className="
            mt-3
            max-w-2xl
            text-zinc-400
            leading-8
            "
          >
            Monitor repository health,
            development activity,
            collaboration,
            engineering metrics,
            and project growth
            from one centralized dashboard.
          </p>

        </div>

        <motion.div
          className="
          flex
          h-20
          w-20
          items-center
          justify-center
          rounded-3xl
          border
          border-white/10
          bg-white/5
          "
          whileHover={{
    rotate: 8,
    scale: 1.05,
  }}
  transition={{
    type: "spring",
    stiffness: 260,
  }}
        >
          <GitBranch
            className="text-cyan-400"
            size={38}
          />
        </motion.div>

      </div>

      <motion.div
  className="
    mt-8
    flex
    gap-3
    flex-wrap
  "
  initial="hidden"
  whileInView="show"
  viewport={{ once: true }}
  variants={{
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.08,
      },
    },
  }}
>
        <motion.div
  variants={{
    hidden: {
      opacity: 0,
      y: 12,
    },
    show: {
      opacity: 1,
      y: 0,
    },
  }}
  whileHover={{
    y: -4,
    scale: 1.03,
  }}
  transition={{
    type: "spring",
    stiffness: 260,
  }}
  className="
    rounded-full
    bg-white/5
    px-4
    py-2
    text-sm
    text-zinc-300
  "
>
          <Activity
            className="mr-2 inline"
            size={14}
          />
          Real-time Metrics
        </motion.div>

        <motion.div
  variants={{
    hidden: {
      opacity: 0,
      y: 12,
    },
    show: {
      opacity: 1,
      y: 0,
    },
  }}
  whileHover={{
    y: -4,
    scale: 1.03,
  }}
  transition={{
    type: "spring",
    stiffness: 260,
  }}
  className="
    rounded-full
    bg-white/5
    px-4
    py-2
    text-sm
    text-zinc-300
  "
>
          Repository Intelligence
        </motion.div>

        <motion.div
  variants={{
    hidden: {
      opacity: 0,
      y: 12,
    },
    show: {
      opacity: 1,
      y: 0,
    },
  }}
  whileHover={{
    y: -4,
    scale: 1.03,
  }}
  transition={{
    type: "spring",
    stiffness: 260,
  }}
  className="
    rounded-full
    bg-white/5
    px-4
    py-2
    text-sm
    text-zinc-300
  "
>
          Developer Analytics
        </motion.div>

      </motion.div>
      <motion.div
  initial={{
    scaleX: 0,
  }}
  animate={{
    scaleX: 1,
  }}
  transition={{
    duration: 1,
    delay: 0.3,
  }}
  className="
    mt-8
    h-px
    origin-left
    bg-gradient-to-r
    from-cyan-400
    via-blue-500/40
    to-transparent
  "
/>
 </motion.section>
  );
}