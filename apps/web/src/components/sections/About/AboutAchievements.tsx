"use client";

import { motion } from "framer-motion";

const achievements = [
  {
    value: "25+",
    title: "Projects",
    description:
      "Academic, professional and personal software & AI projects.",
  },
  {
    value: "AI",
    title: "Engineering Focus",
    description:
      "Building intelligent software with Machine Learning, LLMs and Data Science.",
  },
  {
    value: "Production",
    title: "Software Mindset",
    description:
      "Focused on scalable architecture, clean code and long-term maintainability.",
  },
  {
    value: "∞",
    title: "Continuous Learning",
    description:
      "Driven by research, experimentation and continuous improvement.",
  },
];

export function AboutAchievements() {
  return (
    <div className="mt-24">
      <div className="mb-10">
        <span className="text-sm font-semibold uppercase tracking-[0.35em] text-cyan-300">
          Highlights
        </span>

        <h3 className="mt-4 text-3xl font-bold text-white">
          Engineering Snapshot
        </h3>

        <p className="mt-4 max-w-2xl leading-8 text-zinc-400">
          A quick overview of the experience, mindset and engineering
          principles that define my work.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {achievements.map((item, index) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.5,
              delay: index * 0.12,
            }}
            className="
              group
              rounded-3xl
              border
              border-white/10
              bg-white/5
              p-8
              backdrop-blur-xl
              transition-all
              duration-300
              hover:-translate-y-1
              hover:border-cyan-400/40
              hover:bg-white/10
            "
          >
            <div className="text-4xl font-black text-white">
              {item.value}
            </div>

            <h4 className="mt-6 text-xl font-semibold text-white">
              {item.title}
            </h4>

            <p className="mt-4 leading-7 text-zinc-400">
              {item.description}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}