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
        y: 20,
      }}
      animate={{
        opacity: 1,
        y: 0,
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
      p-8
      "
    >
      <div className="flex items-start justify-between">

        <div>

          <div
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
          </div>

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

        <div
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
        >
          <GitBranch
            className="text-cyan-400"
            size={38}
          />
        </div>

      </div>

      <div
        className="
        mt-8
        flex
        gap-3
        flex-wrap
        "
      >
        <div
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
        </div>

        <div
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
        </div>

        <div
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
        </div>

      </div>

    </motion.section>
  );
}