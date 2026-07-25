"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { workspaceNavigation } from "@/lib/constants/workspaceNavigation";

function isLiveModule(status: string) {
  return status === "Available" || status === "Preview";
}

export function WorkspaceNavigation() {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {workspaceNavigation.map((module) => {
        const live = isLiveModule(module.status);

        const card = (
          <div
            className={`
              group
              rounded-3xl
              border
              p-8
              transition-all
              duration-300
              ${
                live
                  ? "border-white/10 bg-white/[0.04] hover:-translate-y-1 hover:border-cyan-400/40 hover:bg-white/[0.06]"
                  : "border-white/10 bg-white/[0.03] opacity-70"
              }
            `}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-white">
                  {module.title}
                </h2>

                <p className="mt-4 leading-7 text-zinc-400">
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
                  ${
                    live
                      ? "border border-cyan-400/30 bg-cyan-500/10 text-cyan-300"
                      : "border border-white/10 bg-white/[0.04] text-zinc-500"
                  }
                `}
              >
                {module.status}
              </span>
            </div>

            {live ? (
              <div className="mt-6 inline-flex items-center text-sm font-semibold text-cyan-300">
                Open module
                <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </div>
            ) : null}
          </div>
        );

        if (!live) {
          return <div key={module.title}>{card}</div>;
        }

        return (
          <Link key={module.title} href={module.href}>
            {card}
          </Link>
        );
      })}
    </div>
  );
}