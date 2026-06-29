"use client";

import { AnimatePresence, motion } from "framer-motion";

import { ProjectCard } from "./ProjectCard";
import type { Project } from "./types";

interface ProjectsGridProps {
  projects: Project[];
}

export function ProjectsGrid({
  projects,
}: ProjectsGridProps) {
  return (
    <motion.div
      layout
      className="mt-16 grid gap-8 md:grid-cols-2 xl:grid-cols-3"
    >
      <AnimatePresence mode="popLayout">
        {projects.map((project) => (
          <motion.div
            key={project.title}
            layout
            initial={{
              opacity: 0,
              y: 30,
              scale: 0.95,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              y: -30,
              scale: 0.95,
            }}
            transition={{
              duration: 0.35,
            }}
          >
            <ProjectCard project={project} />
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
}