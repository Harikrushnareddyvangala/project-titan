"use client";

import { motion } from "framer-motion";
import { Check, FolderGit2, } from "lucide-react";

interface RepositoryOption {
  id: number;
  name: string;
  fullName: string;
}

interface ComparisonSelectorProps {
  repositories: RepositoryOption[];
  selected: number[];
  onChange: (selected: number[]) => void;
}

export function ComparisonSelector({
  repositories,
  selected,
  onChange,
}: ComparisonSelectorProps) {

  function toggleRepository(id: number) {

    if (selected.includes(id)) {

      onChange(
        selected.filter(repoId => repoId !== id),
      );

      return;

    }

    if (selected.length >= 4) return;

    onChange([
      ...selected,
      id,
    ]);

  }

  return (

    <motion.section

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

      className="
      rounded-3xl
      border
      border-cyan-500/20
      bg-gradient-to-br
      from-zinc-950
      via-zinc-900
      to-black
      p-8
      backdrop-blur-xl
      "

    >

      <div className="mb-8">

        <h2 className="text-2xl font-bold text-white">

          Repository Comparison

        </h2>

        <p className="mt-2 text-zinc-400">

          Select up to four repositories for enterprise comparison.

        </p>

      </div>

      <div className="grid gap-4 md:grid-cols-2">

        {repositories.map((repo) => {

          const active =
            selected.includes(repo.id);

          return (

            <motion.button

              key={repo.id}

              whileHover={{
                scale: 1.02,
              }}

              whileTap={{
                scale: .98,
              }}

              onClick={() =>
                toggleRepository(repo.id)
              }

              className={`
                rounded-2xl
                border
                p-5
                text-left
                transition-all

                ${
                  active

                    ? "border-cyan-400 bg-cyan-500/10"

                    : "border-white/5 bg-white/[0.03]"

                }

              `}

            >

              <div className="flex items-center justify-between">

                <FolderGit2
                  className="text-cyan-400"
                  size={22}
                />

                {active && (

                  <Check
                    className="text-emerald-400"
                    size={22}
                  />

                )}

              </div>

              <h3
                className="
                mt-4
                text-lg
                font-semibold
                text-white
                "
              >
                {repo.name}
              </h3>

              <p
                className="
                mt-1
                text-sm
                text-zinc-500
                "
              >
                {repo.fullName}
              </p>

            </motion.button>

          );

        })}

      </div>

      <div
        className="
        mt-8
        rounded-xl
        border
        border-white/5
        bg-white/[0.03]
        px-4
        py-3
        text-sm
        text-zinc-400
        "
      >

        Selected repositories:

        <span className="ml-2 font-semibold text-cyan-300">

          {selected.length} / 4

        </span>

      </div>

    </motion.section>

  );

}