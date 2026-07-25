"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  GitFork,
  Layers3,
  Sparkles,
  TrendingUp,
} from "lucide-react";

import { useGithubPortfolio } from "@/hooks/useGithubPortfolio";
import { buildPortfolioIntelligence } from "@/lib/github/portfolioIntelligenceEngine";

import { ExecutivePortfolioDashboard } from "@/components/github/ExecutivePortfolioDashboard";
import { PortfolioIntelligenceDashboard } from "@/components/github/PortfolioIntelligenceDashboard";

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

export function PortfolioWorkspace() {
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
        <section className="rounded-[34px] border border-white/10 bg-white/[0.04] p-8 backdrop-blur-3xl md:p-10">
          <div className="inline-flex items-center rounded-full border border-cyan-400/30 bg-cyan-500/10 px-4 py-2">
            <Layers3 className="mr-2 h-4 w-4 text-cyan-300" />
            <span className="text-xs font-semibold uppercase tracking-[0.35em] text-cyan-300">
              Project TITAN
            </span>
          </div>

          <h1 className="mt-8 text-4xl font-black leading-tight text-white md:text-6xl">
            Portfolio Intelligence
          </h1>

          <p className="mt-6 max-w-4xl text-lg leading-8 text-zinc-400 md:text-xl">
            Analyze an entire GitHub portfolio with executive, engineering,
            security, technology, and intelligence layers designed for recruiters,
            CTOs, and engineering leaders.
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
              Load Portfolio
            </button>
          </form>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <StatCard
              icon={<GitFork className="h-5 w-5" />}
              title="Portfolio Mode"
              value={hasInput ? "Ready" : "Waiting for input"}
            />
            <StatCard
              icon={<TrendingUp className="h-5 w-5" />}
              title="Scope"
              value={`${repositoryList.length} repositories`}
            />
            <StatCard
              icon={<Sparkles className="h-5 w-5" />}
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

        <section className="mt-10 rounded-[34px] border border-white/10 bg-white/[0.04] p-8 backdrop-blur-3xl">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-cyan-400">
                Next step
              </p>
              <h2 className="mt-3 text-2xl font-bold text-white">
                Portfolio Intelligence is now connected
              </h2>
              <p className="mt-3 max-w-3xl text-zinc-400">
                This workspace now loads repository lists, computes portfolio
                analytics, and renders the executive portfolio dashboard using
                the engines already in your codebase.
              </p>
            </div>

            <Link
              href="/workspace/repository"
              className="
                inline-flex
                items-center
                rounded-2xl
                border
                border-cyan-400/40
                bg-cyan-500/10
                px-5
                py-3
                font-semibold
                text-cyan-300
                transition
                hover:bg-cyan-500/20
              "
            >
              Open Repository Intelligence
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </section>
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