"use client";

import { motion } from "framer-motion";
import {
  Globe,
  Lock,
  GitBranch,
  CalendarDays,
  AlertCircle,
  Scale,
  Circle,
} from "lucide-react";

import type { GithubRepository } from "@/types/github";

interface Props {
  repository: GithubRepository;
}

function InfoItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div
      className="
      rounded-2xl
      border
      border-white/10
      bg-white/[0.03]
      p-4
      "
    >
      <div className="flex items-center gap-2 text-zinc-400 text-sm">
        {icon}
        {label}
      </div>

      <div className="mt-2 text-lg font-semibold text-white">
        {value}
      </div>
    </div>
  );
}

export function RepositoryOverviewCard({
  repository,
}: Props) {
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
      transition={{
        duration: 0.45,
      }}
      className="
      relative
overflow-hidden
rounded-[34px]
border
border-white/10
bg-white/[0.05]
backdrop-blur-3xl
p-8
min-h-[300px]
      "
    >
      <div className="flex items-center justify-between">

        <div>

          <h3 className="text-2xl font-bold text-white">
            Repository Overview
          </h3>

          <p className="mt-2 text-zinc-400">
            Core repository information
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
          LIVE
        </div>

      </div>

      <div className="mt-8">

        <h2 className="text-3xl font-black text-white">
          {repository.name}
        </h2>

        <p className="mt-3 text-zinc-400 leading-7">
          {repository.description ??
            "No description available."}
        </p>

      </div>

      <div
        className="
        mt-8
        grid
        gap-5
        md:grid-cols-2
        "
      >
        <InfoItem
          icon={
            repository.private ? (
              <Lock size={16} />
            ) : (
              <Globe size={16} />
            )
          }
          label="Visibility"
          value={
            repository.private
              ? "Private"
              : "Public"
          }
        />

        <InfoItem
          icon={<GitBranch size={16} />}
          label="Default Branch"
          value={repository.default_branch}
        />

        <InfoItem
          icon={<Scale size={16} />}
          label="License"
          value={
            repository.license?.name ??
            "No License"
          }
        />

        <InfoItem
          icon={<Circle size={16} />}
          label="Primary Language"
          value={
            repository.language ??
            "Unknown"
          }
        />

        <InfoItem
          icon={<AlertCircle size={16} />}
          label="Open Issues"
          value={repository.open_issues_count}
        />

        <InfoItem
          icon={<CalendarDays size={16} />}
          label="Last Updated"
          value={new Date(
            repository.updated_at,
          ).toLocaleDateString()}
        />
      </div>
    </motion.section>
  );
}