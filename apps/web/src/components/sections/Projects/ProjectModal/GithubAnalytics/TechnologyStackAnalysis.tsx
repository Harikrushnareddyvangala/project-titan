"use client";

import { motion } from "framer-motion";
import {
  Cpu,
  Database,
  Cloud,
  Layers,
  Brain,
} from "lucide-react";

import type {
  GithubRepository,
  GithubLanguages,
} from "@/types/github";

interface Props {
  repository: GithubRepository;
  languages: GithubLanguages;
}

interface TechCard {
  title: string;
  value: string;
  icon: React.ReactNode;
}

export function TechnologyStackAnalysis({
  repository,
  languages,
}: Props) {
  const languageList = Object.entries(languages)
    .sort((a, b) => b[1] - a[1]);

  const primaryLanguage =
    languageList[0]?.[0] ?? "Unknown";

  const description =
    repository.description?.toLowerCase() ?? "";

  const backend =
    description.includes("fastapi")
      ? "FastAPI"
      : description.includes("django")
      ? "Django"
      : description.includes("express")
      ? "Express.js"
      : description.includes("spring")
      ? "Spring Boot"
      : "Unknown";

  const frontend =
    description.includes("next")
      ? "Next.js"
      : description.includes("react")
      ? "React"
      : description.includes("vue")
      ? "Vue"
      : description.includes("angular")
      ? "Angular"
      : "Unknown";

  const ai =
    description.includes("langchain")
      ? "LangChain"
      : description.includes("llama")
      ? "LlamaIndex"
      : description.includes("transformers")
      ? "Transformers"
      : description.includes("openai")
      ? "OpenAI"
      : "Not detected";

  const database =
    description.includes("postgres")
      ? "PostgreSQL"
      : description.includes("mongodb")
      ? "MongoDB"
      : description.includes("mysql")
      ? "MySQL"
      : description.includes("redis")
      ? "Redis"
      : "Unknown";

  const cloud =
    description.includes("aws")
      ? "AWS"
      : description.includes("azure")
      ? "Azure"
      : description.includes("gcp")
      ? "Google Cloud"
      : "Unknown";

  const cards: TechCard[] = [
    {
      title: "Primary Language",
      value: primaryLanguage,
      icon: <Cpu size={20} />,
    },
    {
      title: "Frontend",
      value: frontend,
      icon: <Layers size={20} />,
    },
    {
      title: "Backend",
      value: backend,
      icon: <Cpu size={20} />,
    },
    {
      title: "Database",
      value: database,
      icon: <Database size={20} />,
    },
    {
      title: "Cloud",
      value: cloud,
      icon: <Cloud size={20} />,
    },
    {
      title: "AI Stack",
      value: ai,
      icon: <Brain size={20} />,
    },
  ];

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
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
      <h3 className="text-2xl font-bold text-white">
        AI Technology Stack Analysis
      </h3>

      <p className="mt-2 text-zinc-400">
        Automatically detected architecture and technology ecosystem.
      </p>

      <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">

        {cards.map((card) => (

          <motion.div
            key={card.title}
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
              {card.icon}
            </div>

            <p className="mt-5 text-sm uppercase tracking-wider text-zinc-500">
              {card.title}
            </p>

            <p className="mt-2 text-2xl font-bold text-white">
              {card.value}
            </p>

          </motion.div>

        ))}

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
          AI Stack Summary
        </h4>

        <p className="mt-5 leading-8 text-zinc-300">
          TITAN detected a modern software architecture utilizing{" "}
          <span className="font-semibold text-cyan-300">
            {frontend}
          </span>{" "}
          with{" "}
          <span className="font-semibold text-cyan-300">
            {backend}
          </span>
          . AI capabilities are powered by{" "}
          <span className="font-semibold text-cyan-300">
            {ai}
          </span>{" "}
          while persistent storage relies on{" "}
          <span className="font-semibold text-cyan-300">
            {database}
          </span>
          .
        </p>
      </motion.div>
    </motion.section>
  );
}