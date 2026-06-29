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

      <p className="mt-3 max-w-md text-zinc-400">
        We couldn&apos;t find any projects matching{" "}
        <span className="font-medium text-cyan-400">
          &quot;{search}&quot;
        </span>.
        Try another keyword or select a different category.
      </p>
    </div>
  );
}