"use client";

import { motion } from "framer-motion";
import {
  Layers,
  Brain,
  Activity,
  BarChart3,
} from "lucide-react";

import type {
  GithubRepository,
  GithubLanguages,
} from "@/types/github";

interface Props {
  repository: GithubRepository;
  languages: GithubLanguages;
}

export function RepositoryComplexityAnalysis({
  repository,
  languages,
}: Props) {

  const languageCount =
    Object.keys(languages).length;

  const stars =
    repository.stargazers_count;

  const forks =
    repository.forks_count;

  const issues =
    repository.open_issues_count;

  const complexity =
    Math.min(
      100,
      languageCount * 12 +
      forks * 4 +
      stars * 2 +
      issues,
    );

  const level =
    complexity > 85
      ? "Very High"
      : complexity > 65
      ? "High"
      : complexity > 45
      ? "Medium"
      : "Low";

  return (
    <motion.section
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

        <Brain
          className="text-cyan-400"
          size={28}
        />

        <div>

          <h3 className="text-2xl font-bold text-white">
            Repository Complexity Analysis
          </h3>

          <p className="text-zinc-400">
            AI-estimated software complexity
          </p>

        </div>

      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-4">

        <Card
          icon={<Layers size={20} />}
          title="Languages"
          value={languageCount.toString()}
        />

        <Card
          icon={<Activity size={20} />}
          title="Issues"
          value={issues.toString()}
        />

        <Card
          icon={<BarChart3 size={20} />}
          title="Complexity"
          value={`${complexity}%`}
        />

        <Card
          icon={<Brain size={20} />}
          title="Level"
          value={level}
        />

      </div>

      <motion.div
        whileHover={{
          scale: 1.01,
        }}
        className="
        mt-10
        rounded-3xl
        border
        border-cyan-400/20
        bg-cyan-500/10
        p-6
        "
      >

        <h4 className="text-lg font-semibold text-white">
          AI Assessment
        </h4>

        <p className="mt-5 leading-8 text-zinc-300">

          The repository contains{" "}
          <span className="font-semibold text-cyan-300">
            {languageCount}
          </span>{" "}
          detected programming languages with{" "}
          <span className="font-semibold text-cyan-300">
            {issues}
          </span>{" "}
          active issues.

          <br /><br />

          TITAN estimates the engineering
          complexity as

          <span className="ml-2 font-semibold text-cyan-300">
            {level}
          </span>

          based on repository size,
          collaboration,
          maintenance,
          and language diversity.

        </p>

      </motion.div>

    </motion.section>
  );
}

function Card({
  icon,
  title,
  value,
}:{
  icon: React.ReactNode;
  title: string;
  value: string;
}){

  return(

    <motion.div
      whileHover={{
        y:-5,
        scale:1.02,
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

      <p className="mt-2 text-3xl font-bold text-white">
        {value}
      </p>

    </motion.div>

  );

}