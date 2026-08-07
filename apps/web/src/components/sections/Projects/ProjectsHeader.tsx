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
      <span className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-400">
        Engineering Intelligence Platform
      </span>

      <h2 className="mt-6 text-4xl font-bold tracking-tight text-white md:text-5xl">
        Building Intelligent Software, Not Just Projects
      </h2>

      <p className="mt-6 text-lg leading-8 text-zinc-400">
        Every project represents a production-oriented engineering case study,
        combining artificial intelligence, data science, software architecture,
        cloud technologies, and modern development practices. Project TITAN
        serves as the flagship platform that integrates these capabilities into
        a unified Engineering Intelligence ecosystem.
      </p>
    </motion.div>
  );
}