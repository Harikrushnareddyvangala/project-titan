"use client";

import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Cpu,
  Lock,
  Sparkles,
} from "lucide-react";

import { workspaceNavigation } from "@/lib/constants/workspaceNavigation";

type WorkspaceModule = (typeof workspaceNavigation)[number];

interface Props {
  module: WorkspaceModule;
}

function isLiveModule(status: string) {
  return status === "Available" || status === "Preview";
}

export function WorkspaceModulePage({ module }: Props) {
  const live = isLiveModule(module.status);

  return (
    <main className="min-h-screen bg-gradient-to-br from-zinc-950 via-black to-zinc-900 text-white">
      <div className="mx-auto max-w-6xl px-6 py-10 md:px-10">
        <Link
          href="/workspace"
          className="inline-flex items-center text-sm font-semibold text-cyan-300 transition hover:text-cyan-200"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Workspace
        </Link>

        <section className="mt-8 rounded-[34px] border border-white/10 bg-white/[0.04] p-8 backdrop-blur-3xl md:p-10">
          <div className="inline-flex items-center rounded-full border border-cyan-400/30 bg-cyan-500/10 px-4 py-2">
            <Sparkles className="mr-2 h-4 w-4 text-cyan-300" />
            <span className="text-xs font-semibold uppercase tracking-[0.35em] text-cyan-300">
              {module.status}
            </span>
          </div>

          <h1 className="mt-8 text-4xl font-black leading-tight text-white md:text-6xl">
            {module.title}
          </h1>

          <p className="mt-5 max-w-4xl text-lg leading-8 text-zinc-400 md:text-xl">
            {module.description}
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            {live ? (
              <Link
                href={module.href}
                className="
                  inline-flex
                  items-center
                  rounded-2xl
                  border
                  border-cyan-400/40
                  bg-cyan-500/10
                  px-6
                  py-3
                  font-semibold
                  text-cyan-300
                  transition
                  hover:bg-cyan-500/20
                "
              >
                <Cpu className="mr-2 h-5 w-5" />
                Open module
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            ) : (
              <div
                className="
                  inline-flex
                  items-center
                  rounded-2xl
                  border
                  border-white/10
                  bg-white/[0.04]
                  px-6
                  py-3
                  font-semibold
                  text-zinc-300
                "
              >
                <Lock className="mr-2 h-5 w-5" />
                Coming soon
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}