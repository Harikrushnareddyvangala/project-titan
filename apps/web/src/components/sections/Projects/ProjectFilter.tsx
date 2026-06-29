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
    <div className="mt-14 flex flex-wrap justify-center gap-3">
      {projectCategories.map((category) => {
        const active = selected === category;

        return (
          <motion.button
            key={category}
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.05 }}
            onClick={() => onSelect(category)}
            className={`rounded-full border px-5 py-2 text-sm font-medium transition-all duration-300 ${
              active
                ? "border-cyan-500 bg-cyan-500 text-white shadow-lg shadow-cyan-500/20"
                : "border-white/10 bg-white/5 text-zinc-400 hover:border-cyan-500 hover:text-white"
            }`}
          >
            {category}
          </motion.button>
        );
      })}
    </div>
  );
}