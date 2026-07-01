"use client";

import {
  AnimatePresence,
  motion,
} from "framer-motion";

import { X } from "lucide-react";
import { useState } from "react";

import { ProjectNavigation } from "./ProjectNavigation";

import { ProjectContent } from "./ProjectContent";
import { projectDetails } from "../project-details-data";
import { ProjectActions } from "./ProjectActions";
import { ProjectHero } from "./ProjectHero";
import { useGithubRepository } from "@/hooks/useGithubRepository";

import { GithubAnalyticsSection } from "./GithubAnalyticsSection";

interface ProjectModalProps {
  open: boolean;
  title: string | null;
  onClose: () => void;
}

export function ProjectModal({
  open,
  title,
  onClose,
}: ProjectModalProps) {
  const project =
  title ? projectDetails[title] : null;
  const [
  activeSection,
  setActiveSection,
] = useState("Overview");

const {
  repository,
  languages,
  loading,
} = useGithubRepository(
  project?.githubRepo ?? "",
);

if (!project) {
  return null;
}

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
    className="fixed inset-0 z-40 bg-black/70 backdrop-blur-md"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    onClick={onClose}
  />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="project-title"
            className="fixed left-1/2 top-1/2 z-50 h-[90vh] w-[95vw] max-w-5xl -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-3xl border border-white/10 bg-gradient-to-b from-zinc-950 to-zinc-900 shadow-[0_30px_80px_rgba(0,0,0,.65)]"
            initial={{
              opacity: 0,
              scale: 0.9,
              y: 30,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              scale: 0.95,
              y: 20,
            }}
            transition={{
              type: "spring",
              stiffness: 220,
              damping: 22,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
  onClick={onClose}
  aria-label="Close project details"
  className="
    absolute
    right-6
    top-6
    z-50
    ml-auto
    mr-6
    flex
    h-12
    w-12
    items-center
    justify-center
    rounded-full
    border
    border-white/10
    bg-black/60
    backdrop-blur-xl
    transition-all
    duration-300
    hover:scale-110
    hover:bg-cyan-500
    hover:border-cyan-400
  "
>
  <X className="h-5 w-5 text-white" />
</button>

             <ProjectHero
  title={project.title}
  summary={project.summary}
  image={project.screenshots[0]}
/>
<ProjectNavigation
  active={activeSection}
  onSelect={setActiveSection}
/>

<div className="mx-10 border-t border-white/10" />
<ProjectContent
  challenge={project.challenge}
  solution={project.solution}
  features={project.features}
  technologies={project.technologies}
  metrics={project.metrics}
  architecture={project.architecture}
  screenshots={project.screenshots}
/>

<div className="px-10 pt-2">
  <GithubAnalyticsSection
    repository={repository}
    languages={languages}
    loading={loading}
  />
</div>

<div className="px-10 pb-10 pt-8">
  <ProjectActions
    title={project.title}
    github={project.github}
    live={project.live}
  />
</div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
