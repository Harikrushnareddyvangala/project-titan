"use client";

import Image from "next/image";
import Link from "next/link";

import { motion } from "framer-motion";
import {
  ArrowUpRight,
  GitBranch,
} from "lucide-react";

import type { Project } from "./types";

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({
  project,
}: ProjectCardProps) {
  return (
    <motion.article
      whileHover={{
        y: -8,
      }}
      transition={{
        duration: 0.25,
      }}
      className="group overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image
          src={project.image}
          alt={project.title}
          fill
          className="object-cover transition duration-500 group-hover:scale-105"
        />
      </div>

      <div className="space-y-5 p-6">
        <div className="flex flex-wrap gap-2">
          {project.categories.map((category) => (
            <span
              key={category}
              className="rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-medium text-cyan-400"
            >
              {category}
            </span>
          ))}
        </div>

        <h3 className="text-2xl font-semibold text-white">
          {project.title}
        </h3>

        <p className="text-sm leading-7 text-zinc-400">
          {project.description}
        </p>

        <div className="flex flex-wrap gap-2">
          {project.technologies.map((tech) => (
            <span
              key={tech}
              className="rounded-lg border border-white/10 px-3 py-1 text-xs text-zinc-300"
            >
              {tech}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-3 pt-2">
          <Link
            href={project.github}
            target="_blank"
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2 text-sm text-white transition hover:border-cyan-500"
          >
            <GitBranch className="h-4 w-4" />
            GitHub
          </Link>

          <Link
            href={project.live}
            target="_blank"
            className="inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-cyan-400"
          >
            Live Demo
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </motion.article>
  );
}