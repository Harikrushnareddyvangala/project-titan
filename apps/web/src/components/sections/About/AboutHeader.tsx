"use client";

import { motion } from "framer-motion";

export function AboutHeader() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7 }}
      className="max-w-5xl"
    >
      {/* Section Label */}
      <div className="inline-flex items-center rounded-full border border-cyan-500/20 bg-cyan-500/10 px-4 py-2">
        <span className="text-xs font-semibold uppercase tracking-[0.35em] text-cyan-300">
          About Me
        </span>
      </div>

      {/* Heading */}
      <div className="mt-8">
        <h2 className="text-5xl font-black leading-tight tracking-tight text-white md:text-6xl xl:text-7xl">
          Harikrushnareddy
          <br />
          <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
            Vangala
          </span>
        </h2>

        <p className="mt-5 text-xl font-medium text-zinc-300 md:text-2xl">
          AI Engineer • Data Scientist • Software Engineer
        </p>
      </div>

      {/* Introduction */}
      <div className="mt-10 max-w-3xl space-y-6 text-lg leading-9 text-zinc-400">
        <p>
          I design and build intelligent software systems that combine
          Artificial Intelligence, Data Science and modern Software
          Engineering to solve real-world problems.
        </p>

        <p>
          My focus is building production-grade applications that are
          scalable, explainable and engineered with long-term
          maintainability in mind.
        </p>
      </div>

      {/* Featured Project */}
      <div className="mt-12 rounded-3xl border border-white/10 bg-gradient-to-br from-cyan-500/10 to-transparent p-8 backdrop-blur-xl">
        <div className="text-xs font-semibold uppercase tracking-[0.35em] text-cyan-300">
          Featured Project
        </div>

        <h3 className="mt-4 text-3xl font-bold text-white">
          Project TITAN
        </h3>

        <p className="mt-4 max-w-2xl leading-8 text-zinc-400">
          An Engineering Intelligence Platform demonstrating modern AI,
          software architecture, engineering analytics and production-grade
          application development through immersive experiences.
        </p>
      </div>
    </motion.div>
  );
}