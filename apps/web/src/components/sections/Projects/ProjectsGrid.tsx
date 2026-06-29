"use client";

import { projects } from "./data";
import { ProjectCard } from "./ProjectCard";

export function ProjectsGrid() {
  const featuredProjects = projects.filter(
    (project) => project.featured,
  );

  return (
    <div className="mt-16 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
      {featuredProjects.map((project) => (
        <ProjectCard
          key={project.title}
          project={project}
        />
      ))}
    </div>
  );
}