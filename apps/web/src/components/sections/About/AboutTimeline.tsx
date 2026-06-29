"use client";

import { motion } from "framer-motion";

import { careerTimeline } from "./data";

export function AboutTimeline() {
  return (
    <div className="relative border-l border-white/10 pl-6">
      {careerTimeline.map((item, index) => (
        <motion.div
          key={item.year}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            delay: index * 0.1,
          }}
          className="relative mb-10"
        >
          {/* Timeline Node */}
          <div className="absolute -left-[34px] top-1 h-4 w-4 rounded-full bg-cyan-400 shadow-lg shadow-cyan-500/50" />

          <div className="text-sm font-medium text-cyan-400">
            {item.year}
          </div>

          <h3 className="mt-1 text-xl font-semibold text-white">
            {item.title}
          </h3>

          <p className="mt-2 leading-7 text-zinc-400">
            {item.description}
          </p>
        </motion.div>
      ))}
    </div>
  );
}