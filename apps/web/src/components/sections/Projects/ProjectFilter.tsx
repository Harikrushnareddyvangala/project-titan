"use client";

import { motion } from "framer-motion";

import { projectCategories } from "./categories";
import type { ProjectCategory } from "./types";

interface ProjectFilterProps {
  selected: ProjectCategory;
  onSelect: (category: ProjectCategory) => void;
}

export function ProjectFilter({
  selected,
  onSelect,
}: ProjectFilterProps) {
  return (
    <div className="mt-12 flex flex-wrap justify-center gap-3">
      {projectCategories.map((category) => {
        const active = selected === category;

        return (
          <button
            key={category}
            onClick={() => onSelect(category)}
            className="relative overflow-hidden rounded-full"
          >
            {active && (
              <motion.div
                layoutId="project-filter"
                transition={{
                  type: "spring",
                  stiffness: 380,
                  damping: 30,
                }}
                className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500"
              />
            )}

            <span
              className={`relative z-10 block rounded-full px-5 py-2 text-sm font-medium transition-colors ${
                active
                  ? "text-white"
                  : "bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white"
              }`}
            >
              {category}
            </span>
          </button>
        );
      })}
    </div>
  );
}