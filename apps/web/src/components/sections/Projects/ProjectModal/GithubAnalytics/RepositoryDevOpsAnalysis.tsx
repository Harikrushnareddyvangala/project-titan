"use client";

import { motion } from "framer-motion";

import {
  Cloud,
  GitBranch,
  Workflow,
  Container,
  ServerCog,
} from "lucide-react";

import type {
  GithubRepository,
  GithubLanguages,
} from "@/types/github";

interface Props {
  repository: GithubRepository;
  languages: GithubLanguages;
}

export function RepositoryDevOpsAnalysis({
  repository,
  languages,
}: Props) {

  const searchable = `
    ${repository.description ?? ""}
    ${(repository.topics ?? []).join(" ")}
    ${repository.homepage ?? ""}
    ${Object.keys(languages).join(" ")}
  `.toLowerCase();

  const docker =
    searchable.includes("docker");

  const kubernetes =
    searchable.includes("kubernetes") ||
    searchable.includes("k8s");

  const githubActions =
    searchable.includes("github-actions") ||
    searchable.includes("github actions");

  const terraform =
    searchable.includes("terraform");

  const cloud =
    searchable.includes("aws")
      ? "AWS"
      : searchable.includes("azure")
      ? "Azure"
      : searchable.includes("gcp")
      ? "Google Cloud"
      : searchable.includes("vercel")
      ? "Vercel"
      : "Unknown";

  let score = 45;

  if (docker) score += 15;
  if (kubernetes) score += 15;
  if (githubActions) score += 15;
  if (terraform) score += 10;
  if (cloud !== "Unknown") score += 10;

  score = Math.min(score, 100);

  return (
    <motion.section
    id = "devops"
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="
      rounded-[34px]
      border
      border-white/10
      bg-white/[0.04]
      backdrop-blur-3xl
      p-8
      "
    >

      <div className="flex items-center gap-3">

        <Workflow
          className="text-cyan-400"
          size={28}
        />

        <div>

          <h2 className="text-2xl font-bold text-white">
            AI DevOps Intelligence
          </h2>

          <p className="text-zinc-400">
            Deployment & CI/CD maturity assessment
          </p>

        </div>

      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-5">

        <Metric
          icon={<Container size={20} />}
          title="Docker"
          value={docker ? "Detected" : "Not Found"}
        />

        <Metric
          icon={<ServerCog size={20} />}
          title="Kubernetes"
          value={kubernetes ? "Detected" : "Not Found"}
        />

        <Metric
          icon={<GitBranch size={20} />}
          title="CI/CD"
          value={githubActions ? "GitHub Actions" : "Unknown"}
        />

        <Metric
          icon={<Cloud size={20} />}
          title="Cloud"
          value={cloud}
        />

        <Metric
          icon={<Workflow size={20} />}
          title="DevOps"
          value={`${score}%`}
        />

      </div>

      <motion.div
        whileHover={{ scale: 1.01 }}
        className="
        mt-10
        rounded-3xl
        border
        border-cyan-500/20
        bg-cyan-500/10
        p-6
        "
      >

        <h3 className="text-lg font-semibold text-white">
          AI DevOps Assessment
        </h3>

        <p className="mt-5 leading-8 text-zinc-300">

          TITAN estimates this repository has a

          <span className="ml-2 font-semibold text-cyan-300">
            {score}% DevOps maturity.
          </span>

          <br /><br />

          Docker:
          <span className="ml-2 text-cyan-300">
            {docker ? "Detected" : "Not Detected"}
          </span>

          <br />

          Kubernetes:
          <span className="ml-2 text-cyan-300">
            {kubernetes ? "Detected" : "Not Detected"}
          </span>

          <br />

          CI/CD:
          <span className="ml-2 text-cyan-300">
            {githubActions ? "Configured" : "Unknown"}
          </span>

          <br />

          Cloud Platform:
          <span className="ml-2 text-cyan-300">
            {cloud}
          </span>

        </p>

      </motion.div>

    </motion.section>
  );
}

function Metric({
  icon,
  title,
  value,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
}) {

  return (
    <motion.div
      whileHover={{
        y: -6,
        scale: 1.02,
      }}
      className="
      rounded-3xl
      border
      border-white/10
      bg-white/[0.04]
      p-6
      "
    >

      <div className="text-cyan-400">
        {icon}
      </div>

      <p className="mt-5 text-xs uppercase tracking-wider text-zinc-500">
        {title}
      </p>

      <p className="mt-2 text-xl font-bold text-white">
        {value}
      </p>

    </motion.div>
  );
}