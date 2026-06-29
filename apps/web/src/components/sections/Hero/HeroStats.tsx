"use client";

import { motion } from "framer-motion";

const stats = [
  {
    label: "Projects",
    value: "25+",
  },
  {
    label: "Datasets Analyzed",
    value: "50+",
  },
  {
    label: "Models Built",
    value: "15+",
  },
  {
    label: "Experience",
    value: "3+ yrs",
  },
];

export function HeroStats() {
  return (
    <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-4">
      {stats.map((item) => (
        <motion.div
          key={item.label}
          className="
            rounded-2xl
            border border-white/10
            bg-white/5
            p-6
            backdrop-blur-xl
            transition-all duration-300
            hover:-translate-y-2
            hover:border-blue-500/30
            hover:bg-white/10
          "
          whileHover={{ scale: 1.03 }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 20,
          }}
        >
          <p className="text-2xl font-bold text-white">
            {item.value}
          </p>

          <p className="mt-1 text-sm text-zinc-400">
            {item.label}
          </p>
        </motion.div>
      ))}
    </div>
  );
}