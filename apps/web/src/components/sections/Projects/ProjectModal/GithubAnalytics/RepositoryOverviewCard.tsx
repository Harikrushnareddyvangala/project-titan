"use client";

import {
  Calendar,
  GitBranch,
  HardDrive,
  Globe,
  Shield,
  Code2,
} from "lucide-react";

import type { GithubRepository } from "@/types/github";

interface Props {
  repository: GithubRepository;
}

export function RepositoryOverviewCard({
  repository,
}: Props) {
  const items = [
    {
      icon: Globe,
      label: "Visibility",
      value: repository.private
        ? "Private"
        : "Public",
    },
    {
      icon: Code2,
      label: "Primary Language",
      value:
        repository.language ??
        "Unknown",
    },
    {
      icon: GitBranch,
      label: "Default Branch",
      value:
        repository.default_branch,
    },
    {
      icon: Calendar,
      label: "Created",
      value: new Date(
        repository.created_at,
      ).toLocaleDateString(),
    },
    {
      icon: Calendar,
      label: "Updated",
      value: new Date(
        repository.updated_at,
      ).toLocaleDateString(),
    },
    {
      icon: HardDrive,
      label: "Repository Size",
      value: `${(
        repository.size / 1024
      ).toFixed(2)} MB`,
    },
    {
      icon: Shield,
      label: "License",
      value:
        repository.license?.name ??
        "No License",
    },
  ];

  return (
    <section
      className="
rounded-[30px]
border
border-white/10
bg-white/[0.04]
backdrop-blur-3xl
p-8
"
    >
      <h3 className="text-2xl font-bold text-white">
        Repository Overview
      </h3>

      <div className="mt-8 grid gap-5 md:grid-cols-2">
        {items.map((item) => (
          <div
            key={item.label}
            className="
rounded-2xl
border
border-white/10
bg-black/20
p-5
"
          >
            <item.icon
              size={20}
              className="text-cyan-400"
            />

            <p className="mt-3 text-xs uppercase tracking-widest text-zinc-500">
              {item.label}
            </p>

            <p className="mt-2 text-lg font-semibold text-white">
              {item.value}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}