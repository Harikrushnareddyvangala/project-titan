"use client";

import Link from "next/link";
import { workspaceNavigation } from "@/lib/constants/workspaceNavigation";

export function WorkspaceNavigation() {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {workspaceNavigation.map((module) => (
        <Link
  key={module.title}
  href={module.href}
  className="
  group
  rounded-3xl
  border
  border-white/10
  bg-white/[0.04]
  p-8
  transition-all
  duration-300
  hover:-translate-y-1
  hover:border-cyan-400/40
  hover:bg-white/[0.06]
  "
>

  <div className="flex items-center justify-between">

    <h2 className="text-2xl font-bold text-white">
      {module.title}
    </h2>

    <span
      className="
      rounded-full
      border
      border-cyan-400/30
      bg-cyan-500/10
      px-3
      py-1
      text-xs
      font-semibold
      uppercase
      text-cyan-300
      "
    >
      {module.status}
    </span>

  </div>

  <p
    className="
    mt-5
    leading-7
    text-zinc-400
    "
  >
    {module.description}
  </p>

</Link>
      ))}
    </div>
  );
}