"use client";

import Link from "next/link";
import { ArrowRight, Layers3 } from "lucide-react";

import { workspaceNavigation } from "@/lib/constants/workspaceNavigation";

export function WorkspaceSidebar() {
  return (
    <aside className="rounded-[34px] border border-white/10 bg-white/[0.04] p-6 backdrop-blur-3xl">
      <div className="flex items-center gap-3">
        <Layers3 className="h-5 w-5 text-cyan-400" />
        <div>
          <h2 className="text-lg font-bold text-white">Workspace Modules</h2>
          <p className="text-sm text-zinc-500">Available and upcoming tools</p>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        {workspaceNavigation.map((module) => {
          const isLive =
            module.status === "Available" || module.status === "Preview";

          const card = (
            <div
              className={`
                rounded-3xl
                border
                p-5
                transition
                ${isLive
                  ? "border-cyan-400/30 bg-cyan-500/10 hover:bg-cyan-500/15"
                  : "border-white/10 bg-white/[0.03] opacity-70"}
              `}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-base font-semibold text-white">
                    {module.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-zinc-400">
                    {module.description}
                  </p>
                </div>

                <span
                  className={`
                    rounded-full
                    px-3
                    py-1
                    text-[11px]
                    font-semibold
                    uppercase
                    tracking-[0.25em]
                    ${isLive
                      ? "border border-cyan-400/30 bg-cyan-500/10 text-cyan-300"
                      : "border border-white/10 bg-white/[0.04] text-zinc-500"}
                  `}
                >
                  {module.status}
                </span>
              </div>

              {isLive ? (
                <div className="mt-4 inline-flex items-center text-sm font-semibold text-cyan-300">
                  Open module
                  <ArrowRight className="ml-2 h-4 w-4" />
                </div>
              ) : null}
            </div>
          );

          return isLive ? (
            <Link key={module.title} href={module.href}>
              {card}
            </Link>
          ) : (
            <div key={module.title}>{card}</div>
          );
        })}
      </div>
    </aside>
  );
}