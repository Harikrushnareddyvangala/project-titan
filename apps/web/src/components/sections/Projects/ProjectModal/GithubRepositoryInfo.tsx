"use client";

import {
  CalendarDays,
  Code2,
  FolderGit2,
  Globe,
  ShieldCheck,
  Sparkles,
  Link2,
  Tag,
  UserCircle2,
} from "lucide-react";
import {motion} from "framer-motion"; 
import type { ReactNode } from "react";

import type { GithubRepository } from "@/types/github";
import { GithubCard } from "./GithubCard";

interface GithubRepositoryInfoProps {
  repository: GithubRepository | null;
}

export function GithubRepositoryInfo({
  repository,
}: GithubRepositoryInfoProps) {
  if (!repository) {
    return null;
  }

  return (
    <GithubCard>
      <div className="mb-10">

  <div className="flex items-center justify-between">

    <div>

      <h3 className="text-2xl font-bold text-white">
        Repository Overview
      </h3>

      <p className="mt-2 text-sm text-zinc-400">
        Core repository metadata and project information.
      </p>

    </div>

    <div
      className="
        rounded-full
        border
        border-cyan-500/20
        bg-cyan-500/10
        px-4
        py-2
        text-sm
        font-semibold
        text-cyan-300
      "
    >
      Metadata
    </div>

  </div>

</div>

      <div className="grid gap-6 md:grid-cols-2">
        <InfoCard
          icon={<Code2 className="h-5 w-5" />}
          label="Primary Language"
          value={
            repository.language ??
            "Not specified"
          }
        />
        <InfoCard
  icon={<UserCircle2 className="h-5 w-5" />}
  label="Owner"
  value={repository.owner.login}
/>

        <InfoCard
          icon={<FolderGit2 className="h-5 w-5" />}
          label="Default Branch"
          value={repository.default_branch}
        />

        <InfoCard
          icon={<Globe className="h-5 w-5" />}
          label="Visibility"
          value={repository.visibility}
        />

        <InfoCard
  icon={<Link2 className="h-5 w-5" />}
  label="Homepage"
  value={
    repository.homepage
      ? repository.homepage
      : "Not provided"
  }
/>

        <InfoCard
          icon={<ShieldCheck className="h-5 w-5" />}
          label="Open Issues"
          value={repository.open_issues_count.toString()}
        />

        <InfoCard
          icon={<CalendarDays className="h-5 w-5" />}
          label="Last Updated"
          value={new Date(
            repository.updated_at,
          ).toLocaleDateString()}
        />

        <InfoCard
          icon={<CalendarDays className="h-5 w-5" />}
          label="Last Push"
          value={new Date(
            repository.pushed_at,
          ).toLocaleDateString()}
        />
      </div>

      {repository.description && (
        <motion.div
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
    mt-10
    rounded-3xl
    border
    border-white/10
    bg-white/[0.03]
    p-8
  "
>
          <h4 className="mb-3 text-lg font-semibold text-white">
            Description
          </h4>

          <p className="leading-8 text-zinc-400">
            {repository.description}
          </p>
        </motion.div>
      )}

      {repository.topics?.length ? (
        <motion.div
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
  className="mt-10"
>
          <h4 className="mb-5 flex items-center gap-3 text-lg font-semibold text-white">

  <Tag
    size={18}
    className="text-cyan-400"
  />

  Topics

</h4>

          <div className="flex flex-wrap gap-3">
            {repository.topics.map((topic) => (
              <motion.span
  key={topic}
  whileHover={{
    scale: 1.08,
    y: -3,
  }}
  className="
    rounded-full
    border
    border-white/10
    bg-white/[0.04]
    px-4
    py-2
    text-sm
    font-medium
    text-cyan-300
    backdrop-blur-xl
    transition-all
    duration-300
    hover:border-cyan-400
    hover:bg-cyan-500/10
  "
>
  #{topic}
</motion.span>
            ))}
          </div>
        </motion.div>
      ) : null}
      <motion.div
  initial={{
    opacity: 0,
  }}
  whileInView={{
    opacity: 1,
  }}
  viewport={{
    once: true,
  }}
  className="
    mt-10
    rounded-2xl
    border
    border-white/10
    bg-white/[0.03]
    p-5
  "
>

  <div className="flex items-center gap-3">

    <Sparkles
      className="text-cyan-400"
      size={20}
    />

    <p className="text-sm leading-7 text-zinc-400">

      Repository contains

      <span className="mx-2 font-semibold text-white">
        {repository.topics?.length ?? 0}
      </span>

      topics,

      <span className="mx-2 font-semibold text-white">
        {repository.open_issues_count}
      </span>

      open issues and is currently

      <span className="mx-2 font-semibold text-cyan-300">
        {repository.visibility}
      </span>

      .

    </p>

  </div>

</motion.div>
    </GithubCard>
  );
}

interface InfoCardProps {
  icon: ReactNode;
  label: string;
  value: string;
}

function InfoCard({
  icon,
  label,
  value,
}: InfoCardProps) {
  return (
    <div
      className="
group
rounded-2xl
border
border-white/10
bg-white/[0.03]
p-5
transition-all
duration-300
hover:border-cyan-400/40
hover:bg-cyan-500/5
"
    >
      <div className="flex items-start gap-4">

        <div
          className="
flex
h-11
w-11
items-center
justify-center
rounded-xl
bg-cyan-500/10
text-cyan-400
transition-transform
duration-300
group-hover:scale-110
"
        >
          {icon}
        </div>

        <div className="min-w-0">

          <p className="text-xs uppercase tracking-widest text-zinc-500">
            {label}
          </p>

          <p className="mt-2 break-words text-base font-semibold text-white">
            {value}
          </p>

        </div>

      </div>
    </div>
  );
}