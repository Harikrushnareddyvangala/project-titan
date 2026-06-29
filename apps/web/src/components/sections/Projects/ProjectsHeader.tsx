"use client";

import { motion } from "framer-motion";

import { fadeUp } from "@/lib/animations";

export function ProjectsHeader() {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="mx-auto max-w-3xl text-center"
    >
      <span className="rounded-full border border-cyan-500/20 bg-cyan-500/10 px-4 py-2 text-sm font-medium text-cyan-400">
        Portfolio
      </span>

      <h2 className="mt-6 text-4xl font-bold tracking-tight text-white md:text-5xl">
        Featured Projects
      </h2>

      <p className="mt-6 text-lg leading-8 text-zinc-400">
        A collection of AI, Machine Learning, Data Science,
        Analytics, and Full Stack projects built with modern
        technologies and production-ready architecture.
      </p>
    </motion.div>
  );
}