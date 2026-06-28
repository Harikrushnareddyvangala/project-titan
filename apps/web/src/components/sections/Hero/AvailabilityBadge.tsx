"use client";

import { motion } from "framer-motion";

export function AvailabilityBadge() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="inline-flex items-center gap-3 rounded-full border border-emerald-400/20 bg-emerald-500/10 px-5 py-2 backdrop-blur-xl"
    >
      <span className="relative flex h-3 w-3">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
        <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-400" />
      </span>

      <span className="text-sm font-medium text-emerald-300">
        Available for AI & Data Science along Research Opportunities
      </span>
    </motion.div>
  );
}