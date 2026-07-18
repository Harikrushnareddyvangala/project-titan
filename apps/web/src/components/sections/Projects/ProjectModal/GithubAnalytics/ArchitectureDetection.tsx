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

const homepage =
  repository.homepage?.toLowerCase() ?? "";

const topics =
  (repository.topics ?? [])
    .join(" ")
    .toLowerCase();

const langNames =
  Object.keys(languages)
    .join(" ")
    .toLowerCase();

const searchable =
  `${description} ${homepage} ${topics} ${langNames}`;

const frontend =
  searchable.includes("next")
    ? "Next.js"
    : searchable.includes("react")
    ? "React"
    : searchable.includes("vue")
    ? "Vue"
    : searchable.includes("angular")
    ? "Angular"
    : "Unknown";

const backend =
  searchable.includes("fastapi")
    ? "FastAPI"
    : searchable.includes("express")
    ? "Express.js"
    : searchable.includes("nestjs")
    ? "NestJS"
    : searchable.includes("django")
    ? "Django"
    : searchable.includes("flask")
    ? "Flask"
    : "Unknown";

const ai =
  searchable.includes("langchain")
    ? "LangChain"
    : searchable.includes("llamaindex")
    ? "LlamaIndex"
    : searchable.includes("openai")
    ? "OpenAI"
    : "None";

const database =
  searchable.includes("pinecone")
    ? "Pinecone"
    : searchable.includes("chroma")
    ? "ChromaDB"
    : searchable.includes("faiss")
    ? "FAISS"
    : searchable.includes("postgres")
    ? "PostgreSQL"
    : "Unknown";

const deployment =
  searchable.includes("docker")
    ? "Docker"
    : searchable.includes("vercel")
    ? "Vercel"
    : searchable.includes("aws")
    ? "AWS"
    : searchable.includes("azure")
    ? "Azure"
    : "Unknown";

  let architecture = "General Application";
  let confidence = 72;
  let explanation = "";

  if (
  searchable.includes("rag") ||
  searchable.includes("retrieval")
) {
  architecture = "Retrieval-Augmented Generation Platform";
  confidence = 98;
  explanation =
    "Detected enterprise RAG pipeline with LLM retrieval workflow.";
}

else if (
  searchable.includes("microservice")
) {
  architecture = "Microservices Architecture";
  confidence = 95;
  explanation =
    "Repository indicates distributed service-based architecture.";
}

else if (
  frontend === "Next.js" &&
  backend === "FastAPI"
) {
  architecture = "Full Stack AI Platform";
  confidence = 96;
  explanation =
    "Detected React frontend with FastAPI backend and AI services.";
}

else if (
  langNames.includes("typescript") &&
  langNames.includes("python")
) {
  architecture = "Layered Multi-tier Application";
  confidence = 91;
  explanation =
    "Repository combines frontend and backend technologies.";
}

else {
  architecture = "Monolithic Application";
  confidence = 82;
  explanation =
    "Repository appears to follow centralized application architecture.";
}

  return (
    <motion.section
    id = "architecture"
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

      <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
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
    icon={<Cpu size={22} />}
    title="Frontend"
    value={frontend}
/>
<ArchitectureCard
    icon={<Server size={22} />}
    title="Backend"
    value={backend}
/>
<ArchitectureCard
    icon={<Brain size={22} />}
    title="AI"
    value={ai}
/>
<ArchitectureCard
    icon={<Layers3 size={22} />}
    title="Database"
    value={database}
/>
<ArchitectureCard
    icon={<Network size={22} />}
    title="Deployment"
    value={deployment}
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

          <br /><br />

Frontend:
<span className="ml-2 text-cyan-300">{frontend}</span>

<br />

Backend:
<span className="ml-2 text-cyan-300">{backend}</span>

<br />

AI Framework:
<span className="ml-2 text-cyan-300">{ai}</span>

<br />

Database:
<span className="ml-2 text-cyan-300">{database}</span>

<br />

Deployment:
<span className="ml-2 text-cyan-300">{deployment}</span>

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