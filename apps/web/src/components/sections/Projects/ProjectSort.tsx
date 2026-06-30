"use client";

import { ArrowUpDown } from "lucide-react";

export type SortOption =
  | "featured"
  | "name"
  | "newest"
  | "impact";

interface ProjectSortProps {
  value: SortOption;
  onChange: (value: SortOption) => void;
}

const options: {
  value: SortOption;
  label: string;
}[] = [
  {
    value: "featured",
    label: "Featured",
  },
  {
    value: "newest",
    label: "Newest",
  },
  {
    value: "name",
    label: "Name (A-Z)",
  },
  {
    value: "impact",
    label: "Impact",
  },
];

export function ProjectSort({
  value,
  onChange,
}: ProjectSortProps) {
  return (
    <div className="mt-8 flex justify-end">
      <div className="relative">
        <ArrowUpDown
          className="
            pointer-events-none
            absolute
            left-3
            top-1/2
            h-4
            w-4
            -translate-y-1/2
            text-zinc-400
          "
        />

        <select
          value={value}
          onChange={(e) =>
            onChange(
              e.target.value as SortOption,
            )
          }
          className="
            appearance-none
            rounded-xl
            border
            border-white/10
            bg-zinc-900
            py-3
            pl-10
            pr-10
            text-sm
            text-white
            transition
            hover:border-cyan-500
            focus:border-cyan-500
            focus:outline-none
          "
        >
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
            >
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}