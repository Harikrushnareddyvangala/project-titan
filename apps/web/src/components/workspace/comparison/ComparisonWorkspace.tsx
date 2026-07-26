"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowLeft,
  GitCompareArrows,
  Plus,
} from "lucide-react";

import { WorkspaceHeader } from "@/components/workspace/shared/WorkspaceHeader";

export function ComparisonWorkspace() {
  const [repository, setRepository] = useState("");
  const [repositories, setRepositories] = useState<string[]>([]);

  function addRepository() {
    const value = repository.trim();

    if (!value) return;

    if (repositories.includes(value)) return;

    setRepositories((previous) => [...previous, value]);

    setRepository("");
  }

  function removeRepository(repo: string) {
    setRepositories((previous) =>
      previous.filter((item) => item !== repo),
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-zinc-950 via-black to-zinc-900 text-white">
      <div className="mx-auto max-w-7xl px-6 py-10 md:px-10">

        <div className="mb-8 flex items-center justify-between">

          <Link
            href="/workspace"
            className="inline-flex items-center text-sm font-semibold text-cyan-300 transition hover:text-cyan-200"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Workspace
          </Link>

        </div>

        <WorkspaceHeader
          title="Repository Comparison"
          description="Compare multiple GitHub repositories using TITAN Engineering Intelligence."
          icon={
        <GitCompareArrows
            size={34}
            className="text-cyan-400"
        />
    }
        />

        <section className="mt-10 rounded-[34px] border border-white/10 bg-white/[0.04] p-8 backdrop-blur-3xl">

          <label className="mb-2 block text-sm font-semibold uppercase tracking-[0.25em] text-zinc-400">
            GitHub Repository
          </label>

          <div className="flex flex-col gap-4 md:flex-row">

            <input
              value={repository}
              onChange={(event) =>
                setRepository(event.target.value)
              }
              placeholder="owner/repository"
              className="
                flex-1
                rounded-2xl
                border
                border-white/10
                bg-black/40
                px-5
                py-3
                text-white
                outline-none
                placeholder:text-zinc-500
                focus:border-cyan-400/60
              "
            />

            <button
              onClick={addRepository}
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
              <Plus className="mr-2 h-5 w-5" />
              Add Repository
            </button>

          </div>

        </section>

        <section className="mt-10 rounded-[34px] border border-white/10 bg-white/[0.04] p-8 backdrop-blur-3xl">

          <h2 className="text-2xl font-bold">
            Selected Repositories
          </h2>

          {repositories.length === 0 ? (
            <p className="mt-5 text-zinc-400">
              No repositories added yet.
            </p>
          ) : (
            <div className="mt-6 space-y-3">

              {repositories.map((repo) => (
                <div
                  key={repo}
                  className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/30 p-4"
                >
                  <span>{repo}</span>

                  <button
                    onClick={() => removeRepository(repo)}
                    className="text-red-400 transition hover:text-red-300"
                  >
                    Remove
                  </button>
                </div>
              ))}

            </div>
          )}

        </section>

      </div>
    </main>
  );
}