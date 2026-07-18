"use client";

import { motion } from "framer-motion";

import {
  Cpu,
  Database,
  Cloud,
  Brain,
  Layers3,
  ShieldCheck,
} from "lucide-react";

import type {
  GithubRepository,
  GithubLanguages,
} from "@/types/github";

interface Props {
  repository: GithubRepository;
  languages: GithubLanguages;
}

export function TechnologyStackAnalytics({
  repository,
  languages,
}: Props) {

  const searchable = `
    ${repository.description ?? ""}
    ${(repository.topics ?? []).join(" ")}
    ${Object.keys(languages).join(" ")}
    ${repository.homepage ?? ""}
  `.toLowerCase();

  const stack = [
    {
      title: "Frontend",
      value:
        searchable.includes("next")
          ? "Next.js"
          : searchable.includes("react")
          ? "React"
          : searchable.includes("vue")
          ? "Vue"
          : "Unknown",
      icon: <Layers3 size={22} />,
    },

    {
      title: "Backend",
      value:
        searchable.includes("fastapi")
          ? "FastAPI"
          : searchable.includes("express")
          ? "Express"
          : searchable.includes("nestjs")
          ? "NestJS"
          : searchable.includes("django")
          ? "Django"
          : "Unknown",
      icon: <Cpu size={22} />,
    },

    {
      title: "Database",
      value:
        searchable.includes("postgres")
          ? "PostgreSQL"
          : searchable.includes("mongodb")
          ? "MongoDB"
          : searchable.includes("mysql")
          ? "MySQL"
          : "Unknown",
      icon: <Database size={22} />,
    },

    {
      title: "Vector DB",
      value:
        searchable.includes("pinecone")
          ? "Pinecone"
          : searchable.includes("chroma")
          ? "ChromaDB"
          : searchable.includes("faiss")
          ? "FAISS"
          : "None",
      icon: <Database size={22} />,
    },

    {
      title: "AI Framework",
      value:
        searchable.includes("langchain")
          ? "LangChain"
          : searchable.includes("llamaindex")
          ? "LlamaIndex"
          : searchable.includes("autogen")
          ? "AutoGen"
          : searchable.includes("crewai")
          ? "CrewAI"
          : "Unknown",
      icon: <Brain size={22} />,
    },

    {
      title: "Deployment",
      value:
        searchable.includes("docker")
          ? "Docker"
          : searchable.includes("vercel")
          ? "Vercel"
          : searchable.includes("aws")
          ? "AWS"
          : searchable.includes("azure")
          ? "Azure"
          : "Unknown",
      icon: <Cloud size={22} />,
    },

    {
      title: "Security",
      value:
        searchable.includes("oauth")
          ? "OAuth"
          : searchable.includes("jwt")
          ? "JWT"
          : "Standard",
      icon: <ShieldCheck size={22} />,
    },
  ];

  return (
    <motion.section
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

      <h2 className="text-2xl font-bold text-white">
        Technology Stack Intelligence
      </h2>

      <p className="mt-2 text-zinc-400">
        AI detected technology ecosystem used by this repository.
      </p>

      <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">

        {stack.map((item) => (

          <motion.div
            key={item.title}
            whileHover={{
              y: -8,
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
              {item.icon}
            </div>

            <p className="mt-5 text-xs uppercase tracking-wider text-zinc-500">
              {item.title}
            </p>

            <p className="mt-2 text-xl font-bold text-white">
              {item.value}
            </p>

          </motion.div>

        ))}

      </div>

    </motion.section>
  );
}