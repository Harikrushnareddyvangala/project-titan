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
  const sortedProjects = [...projects].sort(
    (a, b) => a.displayOrder - b.displayOrder
  );

  return (
    <motion.div
      layout
      className="
        mt-16
        grid
        gap-8

        md:grid-cols-2
        xl:grid-cols-3
        auto-rows-fr
      "
    >
      <AnimatePresence mode="popLayout">
        {sortedProjects.map((project) => (
          <motion.div
            key={project.id}
            layout
            initial={{
              opacity: 0,
              y: 30,
              scale: 0.97,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              y: -20,
              scale: 0.97,
            }}
            transition={{
              duration: 0.35,
            }}
            className={
              project.flagship
                ? `
                  md:col-span-2
                  xl:col-span-2
                `
                : ""
            }
          >
            <ProjectCard project={project} />
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
}