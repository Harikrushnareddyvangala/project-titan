"use client";

import {
  Calendar,
  GitBranch,
  Globe,
  Shield,
  Tag,
  AlertCircle,
} from "lucide-react";

import { useGithubRepository } from "@/hooks/useGithubRepository";

interface Props {
  repo: string;
}

export function GithubRepositoryInfo({
  repo,
}: Props) {
  const {
    data,
    loading,
  } = useGithubRepository(repo);

  if (loading || !data)
    return null;

  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">

      <h3 className="mb-8 text-2xl font-bold text-white">
        Repository Details
      </h3>

      <div className="grid gap-6 md:grid-cols-2">

        <Info
          icon={<Globe />}
          title="Visibility"
          value={data.visibility}
        />

        <Info
          icon={<GitBranch />}
          title="Default Branch"
          value={data.default_branch}
        />

        <Info
          icon={<Calendar />}
          title="Last Updated"
          value={new Date(
            data.updated_at,
          ).toLocaleDateString()}
        />

        <Info
          icon={<AlertCircle />}
          title="Open Issues"
          value={data.open_issues_count}
        />

        <Info
          icon={<Shield />}
          title="License"
          value={
            data.license?.name ??
            "No License"
          }
        />

        <Info
          icon={<Tag />}
          title="Primary Language"
          value={data.language}
        />

      </div>

      {data.topics.length > 0 && (
        <>
          <h4 className="mt-10 mb-4 font-semibold text-white">
            Topics
          </h4>

          <div className="flex flex-wrap gap-3">
            {data.topics.map((topic) => (
              <span
                key={topic}
                className="
                  rounded-full
                  border
                  border-cyan-500/30
                  bg-cyan-500/10
                  px-4
                  py-2
                  text-sm
                  text-cyan-300
                "
              >
                {topic}
              </span>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function Info({
  icon,
  title,
  value,
}: {
  icon: React.ReactNode;
  title: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-4">

      <div className="text-cyan-400">
        {icon}
      </div>

      <div>
        <div className="text-sm text-zinc-400">
          {title}
        </div>

        <div className="font-semibold text-white">
          {value}
        </div>
      </div>

    </div>
  );
}