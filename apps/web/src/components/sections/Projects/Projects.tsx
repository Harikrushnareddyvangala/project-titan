"use client";

import { useMemo, useState } from "react";

import { ProjectFilter } from "./ProjectFilter";
import { ProjectSearch } from "./ProjectSearch";
import { ProjectsGrid } from "./ProjectsGrid";
import { ProjectsHeader } from "./ProjectsHeader";
import { projects } from "./data";
import type { ProjectCategory } from "./types";
import { ProjectsEmpty } from "./ProjectsEmpty";

export function Projects() {
  const [selectedCategory, setSelectedCategory] =
    useState<ProjectCategory>("All");

  const [search, setSearch] = useState("");

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesCategory =
        selectedCategory === "All" ||
        project.categories.includes(selectedCategory);

      const query = search.toLowerCase();

      const matchesSearch =
  project.title.toLowerCase().includes(query) ||
  project.description.toLowerCase().includes(query) ||
  project.categories.some((category) =>
    category.toLowerCase().includes(query),
  ) ||
  project.technologies.some((tech) =>
    tech.toLowerCase().includes(query),
  );

      return (
        project.featured &&
        matchesCategory &&
        matchesSearch
      );
    });
  }, [selectedCategory, search]);

  return (
    <section
      id="projects"
      className="relative py-24"
    >
      <div className="mx-auto max-w-7xl px-6">
        <ProjectsHeader />

        <ProjectFilter
          selected={selectedCategory}
          onSelect={setSelectedCategory}
        />

        <ProjectSearch
          value={search}
          onChange={setSearch}
        />

        {filteredProjects.length > 0 ? (
  <ProjectsGrid
    projects={filteredProjects}
  />
) : (
  <ProjectsEmpty
    search={search}
  />
)}
      </div>
    </section>
  );
}