"use client";

import Link from "next/link";
import { workspaceNavigation } from "@/lib/constants/workspaceNavigation";

export function WorkspaceNavigation() {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {workspaceNavigation.map((item) => (
        <Link
          key={item.title}
          href={item.href}
          className="
          rounded-3xl
          border
          border-white/10
          p-6
          bg-white/[0.04]
          hover:border-cyan-400/50
          transition
          "
        >
          <h2 className="text-xl font-bold">{item.title}</h2>

          <p className="mt-3 text-zinc-400">
            {item.description}
          </p>

          <p className="mt-6 text-sm text-cyan-400">
            {item.status}
          </p>
        </Link>
      ))}
    </div>
  );
}