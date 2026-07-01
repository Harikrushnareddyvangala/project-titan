"use client";

import {
  Activity,
  CalendarClock,
  Globe,
  Wrench,
} from "lucide-react";

import type { GithubRepository } from "@/types/github";

interface GithubHealthProps {
  repository: GithubRepository | null;
}

export function GithubHealth({
  repository,
}: GithubHealthProps) {
  if (!repository) return null;

  const lastUpdated = new Date(repository.updated_at);

  const daysSinceUpdate = Math.floor(
    (Date.now() - lastUpdated.getTime()) /
      (1000 * 60 * 60 * 24),
  );

  const active =
    daysSinceUpdate <= 90;

  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-8">
      <h3 className="mb-8 text-2xl font-bold text-white">
        Repository Health
      </h3>

      <div className="grid gap-5 md:grid-cols-2">
        <HealthItem
          icon={<Activity size={20} />}
          label="Development"
          value={
            active
              ? "Active"
              : "Inactive"
          }
          color={
            active
              ? "text-green-400"
              : "text-yellow-400"
          }
        />

        <HealthItem
          icon={<Globe size={20} />}
          label="Visibility"
          value={repository.visibility}
          color="text-cyan-400"
        />

        <HealthItem
          icon={<CalendarClock size={20} />}
          label="Last Updated"
          value={`${daysSinceUpdate} days ago`}
          color="text-purple-400"
        />

        <HealthItem
          icon={<Wrench size={20} />}
          label="Maintenance"
          value={
            active
              ? "Maintained"
              : "Needs attention"
          }
          color={
            active
              ? "text-green-400"
              : "text-yellow-400"
          }
        />
      </div>
    </section>
  );
}

interface HealthItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
}

function HealthItem({
  icon,
  label,
  value,
  color,
}: HealthItemProps) {
  return (
    <div className="flex items-start gap-4 rounded-2xl border border-white/10 bg-black/20 p-5">
      <div className={color}>
        {icon}
      </div>

      <div>
        <p className="text-sm text-zinc-400">
          {label}
        </p>

        <p className={`mt-1 font-semibold ${color}`}>
          {value}
        </p>
      </div>
    </div>
  );
}