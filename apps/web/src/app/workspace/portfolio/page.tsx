"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  FolderGit2,
  Layers3,
  Sparkles,
  TrendingUp,
} from "lucide-react";

import { ExecutivePortfolioDashboard } from "@/components/github/ExecutivePortfolioDashboard";
import { PortfolioIntelligenceDashboard } from "@/components/github/PortfolioIntelligenceDashboard";
import { useGithubPortfolio } from "@/hooks/useGithubPortfolio";
import { buildPortfolioIntelligence } from "@/lib/github/portfolioIntelligenceEngine";

type PortfolioRepository = {
  owner: string;
  repo: string;
};

const defaultRepositories = [
  "vercel/next.js",
  "openai/openai-cookbook",
  "tailwindlabs/tailwindcss",
];

function parseRepositoryList(input: string): PortfolioRepository[] {
  return input
    .split(/[\n,]/g)
    .map((item) => item.trim())
    .filter(Boolean)
    .map((item) => {
      const [owner, repo] = item.split("/").map((part) => part.trim());
      return owner && repo ? { owner, repo } : null;
    })
    .filter((item): item is PortfolioRepository => item !== null);
}

export default function PortfolioWorkspacePage() {
  const [repositoryInput, setRepositoryInput] = useState(
    defaultRepositories.join("\n"),
  );
  const [submittedInput, setSubmittedInput] = useState(repositoryInput);

  const repositoryList = useMemo(
    () => parseRepositoryList(submittedInput),
    [submittedInput],
  );

  const {
    repositories,
    portfolio,
    executiveSummary,
    loading,
    error,
  } = useGithubPortfolio(repositoryList);

  const intelligence = useMemo(
    () => buildPortfolioIntelligence({ repositories }),
    [repositories],
  );

  const hasInput = repositoryList.length > 0;

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
            <Layers3 className="mr-2 h-4 w-4 text-cyan-300" />
            <span className="text-xs font-semibold uppercase tracking-[0.35em] text-cyan-300">
              Portfolio Intelligence
            </span>
          </div>
        </div>

        <section className="rounded-[34px] border border-white/10 bg-white/[0.04] p-8 backdrop-blur-3xl md:p-10">
          <h1 className="text-4xl font-black leading-tight text-white md:text-6xl">
            Analyze a Portfolio
          </h1>

          <p className="mt-5 max-w-4xl text-lg leading-8 text-zinc-400 md:text-xl">
            Enter one or more GitHub repositories in owner/repo format to
            generate portfolio-level intelligence across your engineering work.
          </p>

          <form
            className="mt-8 flex flex-col gap-4"
            onSubmit={(event) => {
              event.preventDefault();
              setSubmittedInput(repositoryInput.trim());
            }}
          >
            <label className="text-sm font-semibold uppercase tracking-[0.25em] text-zinc-400">
              GitHub repositories
            </label>

            <textarea
              value={repositoryInput}
              onChange={(event) => setRepositoryInput(event.target.value)}
              placeholder={"vercel/next.js\nopenai/openai-cookbook"}
              rows={6}
              className="
                w-full
                rounded-2xl
                border
                border-white/10
                bg-black/40
                px-5
                py-4
                text-white
                outline-none
                placeholder:text-zinc-500
                focus:border-cyan-400/60
              "
            />

            <p className="text-sm text-zinc-500">
              Enter one repository per line in owner/repo format, or separate
              them with commas.
            </p>

            <button
              type="submit"
              className="
                inline-flex
                w-fit
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
              <FolderGit2 className="mr-2 h-5 w-5" />
              Load Portfolio
            </button>
          </form>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <StatCard
              icon={<TrendingUp className="h-5 w-5" />}
              title="Scope"
              value={`${repositoryList.length} repositories`}
            />
            <StatCard
              icon={<Sparkles className="h-5 w-5" />}
              title="Portfolio Mode"
              value={hasInput ? "Ready" : "Waiting for input"}
            />
            <StatCard
              icon={<FolderGit2 className="h-5 w-5" />}
              title="Active Profile"
              value={hasInput ? "Custom portfolio" : "Not loaded"}
            />
          </div>
        </section>

        {loading ? (
          <section className="mt-10 rounded-[34px] border border-white/10 bg-white/[0.04] p-8 backdrop-blur-3xl">
            <p className="text-zinc-400">Loading portfolio intelligence...</p>
          </section>
        ) : error ? (
          <section className="mt-10 rounded-[34px] border border-red-500/20 bg-red-500/10 p-8 backdrop-blur-3xl">
            <p className="text-red-300">{error}</p>
          </section>
        ) : portfolio && executiveSummary ? (
          <div className="mt-10 space-y-10">
            <PortfolioIntelligenceDashboard
              portfolio={portfolio}
              intelligence={intelligence}
            />

            <ExecutivePortfolioDashboard
              portfolio={portfolio}
              intelligence={intelligence}
              repositories={repositories}
              executiveSummary={executiveSummary}
            />
          </div>
        ) : (
          <section className="mt-10 rounded-[34px] border border-white/10 bg-white/[0.04] p-8 backdrop-blur-3xl">
            <p className="text-zinc-400">
              Add at least one repository to begin portfolio analysis.
            </p>
          </section>
        )}
      </div>
    </main>
  );
}

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
}

function StatCard({ icon, title, value }: StatCardProps) {
  return (
    <div className="rounded-3xl border border-white/10 bg-black/30 p-5">
      <div className="text-cyan-400">{icon}</div>
      <p className="mt-4 text-sm uppercase tracking-[0.25em] text-zinc-500">
        {title}
      </p>
      <p className="mt-2 text-lg font-semibold text-white">{value}</p>
    </div>
  );
}