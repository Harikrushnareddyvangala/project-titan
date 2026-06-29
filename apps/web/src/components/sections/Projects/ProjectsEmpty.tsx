"use client";

import { SearchX } from "lucide-react";

interface ProjectsEmptyProps {
  search: string;
}

export function ProjectsEmpty({
  search,
}: ProjectsEmptyProps) {
  return (
    <div className="mt-20 flex flex-col items-center justify-center text-center">
      <div className="rounded-full bg-cyan-500/10 p-5">
        <SearchX className="h-10 w-10 text-cyan-400" />
      </div>

      <h3 className="mt-6 text-2xl font-semibold text-white">
        No projects found
      </h3>

      <p className="mt-4 max-w-md text-zinc-400">
        No project matches{" "}
        <span className="font-semibold text-cyan-400">
          &ldquo;{search}&rdquo;
        </span>
        . Try another keyword or choose a different
        category.
      </p>
    </div>
  );
}