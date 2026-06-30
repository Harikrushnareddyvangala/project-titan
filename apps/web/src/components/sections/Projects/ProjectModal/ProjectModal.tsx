"use client";

import { useEffect } from "react";
import Image from "next/image";

import {
  AnimatePresence,
  motion,
} from "framer-motion";

import {
  X,
  GitBranch,
  ArrowUpRight,
} from "lucide-react";

import { ProjectArchitecture } from "../ProjectArchitecture";
import { ProjectFeatures } from "../ProjectFeatures";
import { ProjectGallery } from "../ProjectGallery";
import { ProjectMetrics } from "../ProjectMetrics";
import { ProjectTechStack } from "../ProjectTechStack";
import { projectDetails } from "../project-details-data";

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

  useEffect(() => {
    if (!open) return;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (
      event: KeyboardEvent,
    ) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener(
      "keydown",
      handleKeyDown,
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown,
      );
    };
  }, [open, onClose]);

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
            className="fixed left-1/2 top-1/2 z-50 h-[90vh] w-[95vw] max-w-5xl -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-3xl border border-white/10 bg-zinc-950 shadow-2xl"
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
    sticky
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

            <div className="relative h-[420px] w-full overflow-hidden">
  <Image
    src={project.screenshots[0]}
    alt={project.title}
    fill
    priority
    className="object-cover"
  />

  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />

  <div className="absolute bottom-12 left-10">
    <motion.h1
      id="project-title"
      initial={{
        opacity: 0,
        y: 30,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.5,
      }}
      className="text-5xl font-bold text-white"
    >
      {project.title}
    </motion.h1>

    <motion.p
      initial={{
        opacity: 0,
        y: 20,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        delay: 0.15,
      }}
      className="mt-4 max-w-2xl text-lg text-zinc-300"
    >
      {project.summary}
    </motion.p>
  </div>
</div>

            <div className="space-y-12 p-10">
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
  transition={{
    delay: 0.05,
    duration: 0.45,
  }}
>
  <h3 className="mb-3 text-xl font-semibold text-cyan-400">
    Challenge
  </h3>

  <p className="leading-8 text-zinc-300">
    {project.challenge}
  </p>
</motion.section>

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
  transition={{
    delay: 0.15,
    duration: 0.45,
  }}
>
                <h3 className="mb-3 text-xl font-semibold text-cyan-400">
                  Solution
                </h3>

                <p className="leading-8 text-zinc-300">
                  {project.solution}
                </p>
              </motion.section>

              <motion.div
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
  transition={{
    delay: 0.25,
  }}
>
  <ProjectFeatures
    features={project.features}
  />
</motion.div>

              <motion.div
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
  transition={{
    delay: 0.35,
  }}
>
  <ProjectTechStack
    technologies={project.technologies}
  />
</motion.div>

             <motion.div
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
  transition={{
    delay: 0.45,
  }}
>
  <ProjectMetrics
    metrics={project.metrics}
  />
</motion.div>

              <motion.div
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
  transition={{
    delay: 0.55,
  }}
>
  <ProjectArchitecture
    architecture={project.architecture}
  />
</motion.div>

              <motion.div
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
  transition={{
    delay: 0.65,
  }}
>
  <ProjectGallery
    screenshots={project.screenshots}
  />
</motion.div>

              <div className="flex flex-wrap gap-4 pt-4">
                <a
                  href={project.github}
                  aria-label={`View GitHub repository for ${project.title}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-5 py-3 text-white transition hover:border-cyan-500"
                >
                  <GitBranch className="h-5 w-5" />
                  GitHub
                </a>

                <a
                  href={project.live}
                  aria-label={`Open live demo for ${project.title}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-5 py-3 text-white transition hover:bg-cyan-400"
                >
                  Live Demo

                  <ArrowUpRight className="h-5 w-5" />
                </a>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
