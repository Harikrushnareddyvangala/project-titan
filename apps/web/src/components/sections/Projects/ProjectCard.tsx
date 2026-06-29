"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, GitBranch } from "lucide-react";
import Link from "next/link";

import type { Project } from "./types";

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({
  project,
}: ProjectCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{
        duration: 0.6,
      }}
      whileHover={{
        y: -8,
      }}
      className="group rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl transition-all duration-300 hover:border-cyan-500/40 hover:bg-white/10"
    >
      {/* Category */}
      <span className="inline-flex rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-cyan-300">
        {project.category}
      </span>

      {/* Title */}
      <h3 className="mt-6 text-2xl font-bold text-white transition-colors group-hover:text-cyan-300">
        {project.title}
      </h3>

      {/* Description */}
      <p className="mt-4 leading-7 text-zinc-400">
        {project.description}
      </p>

      {/* Technology Stack */}
      <div className="mt-6 flex flex-wrap gap-2">
        {project.technologies.map((tech) => (
          <span
            key={tech}
            className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-zinc-300"
          >
            {tech}
          </span>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="mt-8 flex items-center gap-4">
        <Link
          href={project.github}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2 text-sm font-medium text-white transition-colors hover:border-cyan-500 hover:text-cyan-300"
        >
          <GitBranch className="h-4 w-4" />
          GitHub
        </Link>

        <Link
          href={project.live}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-cyan-400"
        >
          Live Demo
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>
    </motion.article>
  );
}