"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, GitBranch } from "lucide-react";
import Image from "next/image";
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
        y: -10,
        scale: 1.02,
      }}
      className="group overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl transition-all duration-300 hover:border-cyan-500/40 hover:bg-white/10"
    >
      {/* Project Image */}
      <div className="relative overflow-hidden">
        <Image
          src={project.image}
          alt={project.title}
          width={600}
          height={340}
          className="h-52 w-full object-cover transition duration-500 group-hover:scale-105"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

        {/* Featured Badge */}
        {project.featured && (
          <span className="absolute left-4 top-4 rounded-full bg-cyan-500 px-3 py-1 text-xs font-semibold text-black">
            Featured
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-8">
        {/* Category */}
        <div className="flex flex-wrap gap-2">
  {project.categories.map((category) => (
    <span
      key={category}
      className="rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-cyan-300"
    >
      {category}
    </span>
  ))}
</div>

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
              className="rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 text-sm text-cyan-300"
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Buttons */}
        <div className="mt-8 flex items-center gap-4">
          <Link
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl border border-cyan-500/20 px-4 py-2 text-sm font-medium text-white transition-colors hover:border-cyan-400 hover:text-cyan-300"
          >
            <GitBranch className="h-4 w-4" />
            GitHub
          </Link>

          <Link
            href={project.live}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 px-4 py-2 text-sm font-medium text-black transition-opacity hover:opacity-90"
          >
            Live Demo
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </motion.article>
  );
}