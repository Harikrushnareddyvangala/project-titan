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
    <section className="mt-12">

<div className="mb-8">

<h3 className="text-2xl font-bold text-white">
Repository Insights
</h3>

<p className="mt-2 text-zinc-400">
Automatically generated repository quality metrics.
</p>

</div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

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
    y: 25,
  }}
  whileInView={{
    opacity: 1,
    y: 0,
  }}
  viewport={{
    once: true,
  }}
  transition={{
    delay: index * 0.08,
    duration: 0.35,
  }}
  whileHover={{
    y: -8,
    scale: 1.02,
  }}
  className="
group
relative
overflow-hidden
rounded-3xl
border
border-white/10
bg-gradient-to-br
from-white/[0.05]
to-white/[0.02]
p-7
transition-all
duration-300
hover:border-cyan-400/30
"
>
  <div
    className="
absolute
inset-0
bg-gradient-to-br
from-cyan-500/5
via-transparent
to-blue-500/5
opacity-0
transition-opacity
duration-500
group-hover:opacity-100
"
  />

  <div className="relative z-10">

    <div
      className="
mb-6
flex
h-14
w-14
items-center
justify-center
rounded-2xl
bg-cyan-500/10
text-cyan-400
"
    >
      <Icon className="h-7 w-7" />
    </div>

    <p
      className="
text-4xl
font-bold
text-white
"
    >
      {value}
    </p>

    <p
      className="
mt-3
text-sm
text-zinc-400
"
    >
      {label}
    </p>

  </div>

</motion.div>
          ),
        )}

      </div>

    </section>
  );
}