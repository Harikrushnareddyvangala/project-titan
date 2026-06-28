"use client";

import { motion } from "framer-motion";

const stats = [
  {
    value: "3+",
    label: "Years Experience",
  },
  {
    value: "25+",
    label: "Projects",
  },
  {
    value: "20+",
    label: "Technologies",
  },
];

export function HeroStats() {
  return (
    <div className="mt-16 grid grid-cols-3 gap-8">
      {stats.map((item, index) => (
        <motion.div
          key={item.label}
          initial={{
            opacity: 0,
            y: 20,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.2 * index,
          }}
          viewport={{
            once: true,
          }}
          className="text-center"
        >
          <div className="text-4xl font-black text-white">
            {item.value}
          </div>

          <div className="mt-2 text-sm text-zinc-400">
            {item.label}
          </div>
        </motion.div>
      ))}
    </div>
  );
}