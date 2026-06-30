"use client";

import { ProjectSort } from "./ProjectSort";
import { useProjectFilters } from "./useProjectFilters";

import { ProjectFilters } from "./ProjectFilters";
import { ProjectSearch } from "./ProjectSearch";
import { ProjectsGrid } from "./ProjectsGrid";
import { ProjectsHeader } from "./ProjectsHeader";
import { ProjectsEmpty } from "./ProjectsEmpty";
import { motion } from "framer-motion";


export function Projects() {
  
const {
  search,
  setSearch,

  selectedCategory,
  setSelectedCategory,

  sortBy,
  setSortBy,

  filteredProjects,
} = useProjectFilters();

  return (
    <section
      id="projects"
      className="relative py-24"
    >
      <div className="mx-auto max-w-7xl px-6">
        <ProjectsHeader />

        <ProjectFilters
  categories={[
    "All",
    "AI",
    "Machine Learning",
    "Analytics",
    "Generative AI",
    "Predictive Analytics",
  ]}
  selected={selectedCategory}
  onSelect={setSelectedCategory}
/>

        <ProjectSearch
          value={search}
          onChange={setSearch}
        />

        <ProjectSort
  value={sortBy}
  onChange={setSortBy}
/>

        {filteredProjects.length > 0 ? (
          <>
          <motion.div
  initial={{
    opacity: 0,
    y: 15,
  }}
  animate={{
    opacity: 1,
    y: 0,
  }}
  transition={{
    duration: 0.35,
  }}
  className="mb-6 flex items-center justify-between"
>
  <p className="text-sm text-zinc-400">
    Showing{" "}
    <span className="font-semibold text-white">
      {filteredProjects.length}
    </span>{" "}
    project
    {filteredProjects.length !== 1 && "s"}
  </p>
</motion.div> 
          <ProjectsGrid
            projects={filteredProjects}
          />
          </>
        ) : (
          <ProjectsEmpty
            search={search}
          />
          
        )}
      </div>
    </section>
  );
}