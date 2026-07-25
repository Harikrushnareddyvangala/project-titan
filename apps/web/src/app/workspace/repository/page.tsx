"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, FolderGit2, Search } from "lucide-react";

import { GithubAnalyticsSection } from "@/components/sections/Projects/ProjectModal/GithubAnalyticsSection";
import { useGithubRepository } from "@/hooks/useGithubRepository";

export default function RepositoryWorkspacePage() {
  const [repoName, setRepoName] = useState("vercel/next.js");
  const [activeRepoName, setActiveRepoName] = useState("vercel/next.js");

  const github = useGithubRepository(activeRepoName);

  return (
    <main className="min-h-screen bg-gradient-to-br from-zinc-950 via-black to-zinc-900 text-white">
      <div className="mx-auto max-w-7xl px-6 py-10 md:px-10">
        <div className="mb-8 flex items-center justify-between gap-4">
          <Link
            href="/workspace"
            className="inline-flex items-center text-sm font-semibold text-cyan-300 transition hover:text-cyan-200"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Workspace
          </Link>

          <div className="inline-flex items-center rounded-full border border-cyan-400/30 bg-cyan-500/10 px-4 py-2">
            <FolderGit2 className="mr-2 h-4 w-4 text-cyan-300" />
            <span className="text-xs font-semibold uppercase tracking-[0.35em] text-cyan-300">
              Repository Intelligence
            </span>
          </div>
        </div>

        <section className="rounded-[34px] border border-white/10 bg-white/[0.04] p-8 backdrop-blur-3xl md:p-10">
          <h1 className="text-4xl font-black leading-tight text-white md:text-6xl">
            Analyze a Repository
          </h1>

          <p className="mt-5 max-w-4xl text-lg leading-8 text-zinc-400 md:text-xl">
            Enter a GitHub repository in owner/repo format to open TITAN’s
            repository intelligence stack inside the Workspace.
          </p>

          <form
            className="mt-8 flex flex-col gap-4 md:flex-row"
            onSubmit={(event) => {
              event.preventDefault();
              const value = repoName.trim();
              if (!value) return;
              setActiveRepoName(value);
            }}
          >
            <div className="flex-1">
              <label className="mb-2 block text-sm font-semibold uppercase tracking-[0.25em] text-zinc-400">
                GitHub repository
              </label>

              <input
                value={repoName}
                onChange={(event) => setRepoName(event.target.value)}
                placeholder="owner/repository"
                className="
                  w-full
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
            </div>

            <button
              type="submit"
              className="
                inline-flex
                items-center
                self-end
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
              <Search className="mr-2 h-5 w-5" />
              Analyze Repository
            </button>
          </form>
        </section>

        <div className="mt-10">
          <GithubAnalyticsSection {...github} />
        </div>
      </div>
    </main>
  );
}