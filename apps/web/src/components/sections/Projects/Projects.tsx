"use client";

import { ProjectsGrid } from "./ProjectsGrid";
import { ProjectsHeader } from "./ProjectsHeader";

export function Projects() {
  return (
    <section
      id="projects"
      className="relative py-24"
    >
      <div className="mx-auto max-w-7xl px-6">
        <ProjectsHeader />

        <ProjectsGrid />
      </div>
    </section>
  );
}