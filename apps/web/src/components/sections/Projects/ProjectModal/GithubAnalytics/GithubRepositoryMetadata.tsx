"use client";

import { motion } from "framer-motion";
import {
  Calendar,
  GitBranch,
  Globe,
  Lock,
  Scale,
  Code2,
  Database,
  AlertCircle,
} from "lucide-react";

import type { GithubRepository } from "@/types/github";

interface Props {
  repository: GithubRepository;
}

const Row = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) => (
  <div className="flex items-center justify-between border-b border-white/5 py-4 last:border-0">
    <div className="flex items-center gap-3 text-zinc-400">
      {icon}
      <span>{label}</span>
    </div>

    <span className="font-medium text-white">
      {value}
    </span>
  </div>
);

export function GithubRepositoryMetadata({
  repository,
}: Props) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="
rounded-[30px]
border
border-white/10
bg-white/[0.05]
backdrop-blur-2xl
p-8
"
    >
      <h3 className="text-2xl font-bold text-white">
        Repository Metadata
      </h3>

      <p className="mt-2 text-zinc-400">
        General repository information
      </p>

      <div className="mt-8">

        <Row
          icon={<Calendar size={18} />}
          label="Created"
          value={new Date(
            repository.created_at,
          ).toLocaleDateString()}
        />

        <Row
          icon={<Calendar size={18} />}
          label="Last Updated"
          value={new Date(
            repository.updated_at,
          ).toLocaleDateString()}
        />

        <Row
          icon={<GitBranch size={18} />}
          label="Default Branch"
          value={repository.default_branch}
        />

        <Row
          icon={<Code2 size={18} />}
          label="Primary Language"
          value={repository.language ?? "Unknown"}
        />

        <Row
          icon={<Database size={18} />}
          label="Repository Size"
          value={`${(
            repository.size / 1024
          ).toFixed(2)} MB`}
        />

        <Row
          icon={<AlertCircle size={18} />}
          label="Open Issues"
          value={repository.open_issues_count.toString()}
        />

        <Row
          icon={<Scale size={18} />}
          label="License"
          value={
            repository.license?.name ??
            "No License"
          }
        />

        <Row
          icon={<Lock size={18} />}
          label="Visibility"
          value={repository.visibility}
        />

        <Row
          icon={<Globe size={18} />}
          label="Homepage"
          value={
            repository.homepage ||
            "Not Specified"
          }
        />

      </div>
    </motion.section>
  );
}