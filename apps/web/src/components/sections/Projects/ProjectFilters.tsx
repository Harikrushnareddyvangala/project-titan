"use client";

import { motion } from "framer-motion";

import type {
  ProjectCategory,
} from "./types";

interface ProjectFiltersProps {
  categories: ProjectCategory[];
  selected: ProjectCategory;
  onSelect: (
    category: ProjectCategory,
  ) => void;
}

export function ProjectFilters({
  categories,
  selected,
  onSelect,
}: ProjectFiltersProps) {
  return (
    <div className="mt-10 flex flex-wrap justify-center gap-3">
      {categories.map((category) => {
        const active =
          selected === category;

        return (
          <motion.button
            key={category}
            whileHover={{
              scale: 1.05,
            }}
            whileTap={{
              scale: 0.97,
            }}
            onClick={() =>
              onSelect(category)
            }
            className={`
              rounded-full
              border
              px-5
              py-2
              text-sm
              font-medium
              transition-all
              duration-300
              ${
                active
                  ? "border-cyan-400 bg-cyan-500 text-white shadow-lg shadow-cyan-500/30"
                  : "border-white/10 bg-white/5 text-zinc-300 hover:border-cyan-500 hover:text-white"
              }
            `}
          >
            {category}
          </motion.button>
        );
      })}
    </div>
  );
}