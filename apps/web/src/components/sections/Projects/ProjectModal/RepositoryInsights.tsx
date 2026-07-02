"use client";

import { motion } from "framer-motion";
import {
  Activity,
  Calendar,
  Rocket,
  Trophy,
} from "lucide-react";

import type { GithubRepository } from "@/types/github";

interface Props {
  repository: GithubRepository;
}

function daysBetween(date: string) {
  return Math.floor(
    (Date.now() - new Date(date).getTime()) /
      (1000 * 60 * 60 * 24),
  );
}

export function RepositoryInsights({
  repository,
}: Props) {
  const age = daysBetween(
    repository.created_at,
  );

  const updated =
    daysBetween(repository.updated_at);

  const popularity =
    repository.stargazers_count +
    repository.forks_count * 2;

  const health = Math.min(
    100,
    Math.round(
      popularity / 5 +
        repository.watchers_count,
    ),
  );

  const cards = [
    {
      icon: Activity,
      label: "Repository Health",
      value: `${health}%`,
    },

    {
      icon: Calendar,
      label: "Repository Age",
      value: `${Math.floor(
        age / 365,
      )} yrs`,
    },

    {
      icon: Rocket,
      label: "Last Update",
      value:
        updated === 0
          ? "Today"
          : `${updated} days`,
    },

    {
      icon: Trophy,
      label: "Popularity",
      value: popularity,
    },
  ];

  return (
    <section className="mt-10">

      <h3 className="mb-6 text-2xl font-bold text-white">
        Repository Insights
      </h3>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">

        {cards.map(
          (
            {
              icon: Icon,
              label,
              value,
            },
            index,
          ) => (
            <motion.div
              key={label}
              initial={{
                opacity: 0,
                y: 20,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{
                once: true,
              }}
              transition={{
                delay:
                  index * 0.08,
              }}
              whileHover={{
                y: -6,
              }}
              className="
                rounded-2xl
                border
                border-white/10
                bg-white/[0.04]
                p-6
              "
            >
              <Icon className="mb-5 h-8 w-8 text-cyan-400" />

              <p className="text-3xl font-bold text-white">
                {value}
              </p>

              <p className="mt-2 text-zinc-400">
                {label}
              </p>

            </motion.div>
          ),
        )}

      </div>

    </section>
  );
}