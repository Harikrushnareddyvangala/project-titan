"use client";

import { motion } from "framer-motion";
import {
  Eye,
  GitFork,
  HardDrive,
  Star,
} from "lucide-react";

import { useGithubRepository } from "@/hooks/useGithubRepository";

interface GithubStatsProps {
  repo: string;
}

interface CardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}

export function GithubStats({
  repo,
}: GithubStatsProps) {
  const {
    data,
    loading,
    error,
  } = useGithubRepository(repo);

  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[...Array(4)].map((_, index) => (
          <div
            key={index}
            className="h-32 animate-pulse rounded-2xl border border-white/10 bg-white/5"
          />
        ))}
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6 text-red-300">
        Unable to load GitHub statistics.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      <Card
        icon={<Star className="h-6 w-6" />}
        label="Stars"
        value={formatNumber(data.stargazers_count)}
      />

      <Card
        icon={<GitFork className="h-6 w-6" />}
        label="Forks"
        value={formatNumber(data.forks_count)}
      />

      <Card
        icon={<Eye className="h-6 w-6" />}
        label="Watchers"
        value={formatNumber(data.watchers_count)}
      />

      <Card
        icon={<HardDrive className="h-6 w-6" />}
        label="Repository Size"
        value={`${(data.size / 1024).toFixed(1)} MB`}
      />
    </div>
  );
}

function Card({
  icon,
  label,
  value,
}: CardProps) {
  return (
    <motion.div
      whileHover={{
        y: -6,
        scale: 1.03,
      }}
      transition={{
        duration: 0.2,
      }}
      className="
        group
        rounded-2xl
        border
        border-white/10
        bg-white/5
        p-5
        backdrop-blur-xl
        transition-all
        duration-300
        hover:border-cyan-500/40
        hover:shadow-lg
        hover:shadow-cyan-500/20
      "
    >
      <div className="mb-4 text-cyan-400 transition-transform group-hover:scale-110">
        {icon}
      </div>

      <div className="text-3xl font-bold text-white">
        {value}
      </div>

      <div className="mt-2 text-sm text-zinc-400">
        {label}
      </div>
    </motion.div>
  );
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("en", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}