"use client";

import { motion } from "framer-motion";
import { careerTimeline } from "./data";

export function AboutTimeline() {
  return (
    <div className="relative border-l border-white/10 pl-6">
      {careerTimeline.map((item, i) => (
        <motion.div
          key={item.year}
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.1 }}
          className="mb-10"
        >
          <div className="text-sm text-cyan-400">
            {item.year}
          </div>

          <div className="text-lg font-semibold text-white">
            {item.title}
          </div>

          <p className="mt-2 text-sm text-zinc-400">
            {item.description}
          </p>
        </motion.div>
      ))}
    </div>
  );
}   