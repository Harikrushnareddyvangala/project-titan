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

const modules = [
  {
    title: "Executive Portfolio Dashboard",
    description:
      "A top-level executive view of the entire engineering portfolio.",
  },
  {
    title: "Portfolio Intelligence Dashboard",
    description:
      "Aggregate engineering metrics across all repositories.",
  },
  {
    title: "Repository Leaderboard",
    description:
      "Rank repositories by engineering quality and enterprise readiness.",
  },
  {
    title: "Engineering Radar",
    description:
      "Visualize portfolio-wide engineering strengths and gaps.",
  },
  {
    title: "Technology Distribution",
    description:
      "See which languages and frameworks dominate the portfolio.",
  },
];

export function PortfolioWorkspace() {
  const [username, setUsername] = useState("harikrushnareddyvangala");
  const [submittedUsername, setSubmittedUsername] = useState(username);

  const normalizedUsername = useMemo(
    () => submittedUsername.trim().replace(/^@/, ""),
    [submittedUsername],
  );

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
            security, technology, and intelligence layers designed for
            recruiters, CTOs, and engineering leaders.
          </p>

          <form
            className="mt-8 flex flex-col gap-4 md:flex-row"
            onSubmit={(event) => {
              event.preventDefault();
              const value = username.trim();
              if (!value) return;
              setSubmittedUsername(value);
            }}
          >
            <input
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              placeholder="GitHub username"
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

            <button
              type="submit"
              className="
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
              value="Ready"
            />
            <StatCard
              icon={<TrendingUp className="h-5 w-5" />}
              title="Scope"
              value="Multi-repository"
            />
            <StatCard
              icon={<Sparkles className="h-5 w-5" />}
              title="Active Profile"
              value={`@${normalizedUsername}`}
            />
          </div>
        </section>

        <section className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {modules.map((module) => (
            <article
              key={module.title}
              className="
                rounded-3xl
                border
                border-white/10
                bg-white/[0.04]
                p-6
                transition
                hover:border-cyan-400/40
                hover:bg-white/[0.06]
              "
            >
              <h2 className="text-xl font-bold text-white">{module.title}</h2>
              <p className="mt-4 leading-7 text-zinc-400">
                {module.description}
              </p>
            </article>
          ))}
        </section>

        <section className="mt-10 rounded-[34px] border border-white/10 bg-white/[0.04] p-8 backdrop-blur-3xl">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-cyan-400">
                Next step
              </p>
              <h2 className="mt-3 text-2xl font-bold text-white">
                Connect Portfolio Analytics in the next commit
              </h2>
              <p className="mt-3 max-w-3xl text-zinc-400">
                This page is now the portfolio entry point inside TITAN’s
                Workspace. The next step is to wire the existing portfolio
                engines and dashboards into this route.
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