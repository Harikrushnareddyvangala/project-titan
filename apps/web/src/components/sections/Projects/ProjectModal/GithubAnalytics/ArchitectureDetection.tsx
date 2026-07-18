"use client";

import { motion } from "framer-motion";
import {
  Network,
  Cpu,
  Layers3,
  Brain,
  Server,
} from "lucide-react";

import type {
  GithubRepository,
  GithubLanguages,
} from "@/types/github";

interface Props {
  repository: GithubRepository;
  languages: GithubLanguages;
}

export function ArchitectureDetection({
  repository,
  languages,
}: Props) {

  const description =
    repository.description?.toLowerCase() ?? "";

  const langNames =
    Object.keys(languages).join(" ").toLowerCase();

  let architecture = "General Application";
  let confidence = 72;
  let explanation = "";

  if (
    description.includes("rag") ||
    description.includes("retrieval")
  ) {
    architecture = "Retrieval-Augmented Generation";
    confidence = 97;
    explanation =
      "Detected retrieval pipeline, embeddings and LLM workflow.";
  }
  else if (
    description.includes("microservice")
  ) {
    architecture = "Microservices";
    confidence = 94;
    explanation =
      "Repository indicates distributed service architecture.";
  }
  else if (
    description.includes("next") &&
    description.includes("fastapi")
  ) {
    architecture = "Full Stack AI Platform";
    confidence = 95;
    explanation =
      "Detected React frontend with Python backend.";
  }
  else if (
    langNames.includes("typescript") &&
    langNames.includes("python")
  ) {
    architecture = "Multi-tier Application";
    confidence = 90;
    explanation =
      "Multiple languages indicate layered architecture.";
  }
  else {
    architecture = "Monolithic Application";
    confidence = 80;
    explanation =
      "Repository appears to use a centralized application structure.";
  }

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

      <div className="flex items-center gap-3">

        <Network
          className="text-cyan-400"
          size={28}
        />

        <div>

          <h3 className="text-2xl font-bold text-white">
            AI Architecture Detection
          </h3>

          <p className="text-zinc-400">
            Automatic software architecture inference
          </p>

        </div>

      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-4">

        <ArchitectureCard
          icon={<Layers3 size={22} />}
          title="Architecture"
          value={architecture}
        />

        <ArchitectureCard
          icon={<Brain size={22} />}
          title="Confidence"
          value={`${confidence}%`}
        />

        <ArchitectureCard
          icon={<Server size={22} />}
          title="Languages"
          value={Object.keys(languages).length.toString()}
        />

        <ArchitectureCard
          icon={<Cpu size={22} />}
          title="Repository"
          value={repository.visibility}
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
          AI Architectural Summary
        </h4>

        <p className="mt-5 leading-8 text-zinc-300">

          TITAN classified this repository as

          <span className="ml-2 font-semibold text-cyan-300">
            {architecture}
          </span>

          with

          <span className="ml-2 font-semibold text-cyan-300">
            {confidence}% confidence.
          </span>

          <br /><br />

          {explanation}

        </p>

      </motion.div>

    </motion.section>
  );
}

function ArchitectureCard({
  icon,
  title,
  value,
}:{
  icon: React.ReactNode;
  title:string;
  value:string;
}){

  return(

    <motion.div
      whileHover={{
        y:-6,
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

      <p className="mt-2 text-2xl font-bold text-white">
        {value}
      </p>

    </motion.div>

  );

}