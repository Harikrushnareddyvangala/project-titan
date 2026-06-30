"use client";

import { motion } from "framer-motion";
import { SearchX } from "lucide-react";

interface ProjectsEmptyProps {
  search: string;
}

export function ProjectsEmpty({
  search,
}: ProjectsEmptyProps) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 30,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      className="
        flex
        flex-col
        items-center
        justify-center
        rounded-3xl
        border
        border-white/10
        bg-white/5
        py-24
        text-center
      "
    >
      <SearchX
        className="mb-6 h-16 w-16 text-cyan-400"
      />

      <h3 className="text-2xl font-semibold text-white">
        No projects found
      </h3>

      <p className="mt-3 max-w-lg text-zinc-400">
        No projects matched
        <span className="mx-1 font-semibold text-cyan-400">
          &quot;{search}&quot;
        </span>

        Try another keyword or category.
      </p>
    </motion.div>
  );
}