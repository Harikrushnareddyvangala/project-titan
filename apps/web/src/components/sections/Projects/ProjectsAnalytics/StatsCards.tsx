"use client";

import { motion } from "framer-motion";
import { AnimatedCounter } from "./AnimatedCounter";

interface Props {
  stats: {
    totalProjects: number;
    featuredProjects: number;
    totalTechnologies: number;
    categories: {
      name: string;
      value: number;
    }[];
  };
}

export function StatsCards({
  stats,
}: Props) {
  const cards = [
    {
      title: "Projects",
      value: stats.totalProjects,
    },
    {
      title: "Featured",
      value: stats.featuredProjects,
    },
    {
      title: "Technologies",
      value: stats.totalTechnologies,
    },
    {
      title: "Categories",
      value: stats.categories.length,
    },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card, index) => (
        <motion.div
          key={card.title}
          initial={{
            opacity: 0,
            y: 30,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
          }}
          transition={{
            delay: index * 0.1,
          }}
          whileHover={{
            y: -8,
            scale: 1.03,
          }}
          className="
group
relative
overflow-hidden
rounded-3xl
border
border-white/10
bg-gradient-to-br
from-white/10
to-white/5
p-8
backdrop-blur-xl
transition-all
duration-500
hover:-translate-y-2
hover:border-cyan-400/50
hover:shadow-2xl
hover:shadow-cyan-500/20
"
        >
            <div
  className="
    absolute
    inset-0
    opacity-0
    transition-opacity
    duration-500
    group-hover:opacity-100
  "
>
  <div
    className="
      absolute
      -right-20
      -top-20
      h-56
      w-56
      rounded-full
      bg-cyan-500/10
      blur-3xl
    "
  />
</div>
          <p className="uppercase tracking-widest text-xs text-zinc-400">
            {card.title}
          </p>

          <h2 className="mt-3 text-5xl font-bold text-cyan-400">
  <AnimatedCounter value={card.value} />
</h2>
        </motion.div>
      ))}
    </div>
  );
}