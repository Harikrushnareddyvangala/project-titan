"use client";

import {
  AnimatePresence,
  motion,
} from "framer-motion";

import { X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { ProjectNavigation } from "./ProjectNavigation";

import { ProjectOverview } from "./ProjectOverview";

import { MetricsDashboard } from "./MetricsDashboard";
import { ProjectArchitecture } from "../ProjectArchitecture";
import { ProjectGallery } from "../ProjectGallery";
import { projectDetails } from "../project-details-data";
import { ProjectActions } from "./ProjectActions";
import { ProjectHero } from "./ProjectHero";
import { useGithubRepository } from "@/hooks/useGithubRepository";

import { GithubAnalyticsSection } from "./GithubAnalyticsSection";
import { ModalBackground } from "./ModalBackground";

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
const [
  scrollProgress,
  setScrollProgress,
] = useState(0);
const overviewRef =
  useRef<HTMLDivElement>(null);

const githubRef =
  useRef<HTMLDivElement>(null);

const galleryRef =
  useRef<HTMLDivElement>(null);

const metricsRef =
  useRef<HTMLDivElement>(null);

const architectureRef =
  useRef<HTMLDivElement>(null);

  const modalRef =
  useRef<HTMLDivElement>(null);
const scrollToSection =     (
  section: string,
) => {
  const map = {
  Overview: overviewRef,
  Architecture: architectureRef,
  Metrics: metricsRef,
  Gallery: galleryRef,
  GitHub: githubRef,
};

  map[
    section as keyof typeof map
  ]?.current?.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });

  setActiveSection(section);
};
useEffect(() => {
  if (!open) return;

  const sections = [
  {
    name: "Overview",
    ref: overviewRef,
  },
  {
    name: "Architecture",
    ref: architectureRef,
  },
  {
    name: "Metrics",
    ref: metricsRef,
  },
  {
    name: "Gallery",
    ref: galleryRef,
  },
  {
    name: "GitHub",
    ref: githubRef,
  },
];

  const observer =
    new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const section =
              sections.find(
                (s) =>
                  s.ref.current ===
                  entry.target,
              );

            if (section) {
              setActiveSection((current) =>
                current === section.name
                  ? current
                  : section.name,
              );
            }
          }
        });
      },
      {
        rootMargin:
          "-120px 0px -45% 0px",
      },
    );

  sections.forEach((section) => {
    if (section.ref.current) {
      observer.observe(
        section.ref.current,
      );
    }
  });

  return () => {
    observer.disconnect();
  };
}, [open]);
useEffect(() => {
  const modal = modalRef.current;

  if (!modal) return;

  const updateProgress = () => {
    const max =
      modal.scrollHeight -
      modal.clientHeight;

    const current =
      modal.scrollTop;

    const progress =
      max > 0
        ? (current / max) * 100
        : 0;

    setScrollProgress(progress);
  };

  modal.addEventListener(
    "scroll",
    updateProgress,
  );

  updateProgress();

  return () => {
    modal.removeEventListener(
      "scroll",
      updateProgress,
    );
  };
}, [open]);
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
            ref={modalRef}
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
<ModalBackground />

    <div className="relative z-10">

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
  repository={repository}
  technologies={project.technologies}
/>
<div
  className="
sticky
top-0
z-30
border-b
border-white/10
bg-zinc-950/80
backdrop-blur-2xl
"
>
  <ProjectNavigation
    active={activeSection}
    progress={scrollProgress}
    onSelect={scrollToSection}
  />
</div>

<div className="mx-10 border-t border-white/10" />
<motion.div
  ref={overviewRef}
  id="overview"
  className="scroll-mt-32 px-10 pt-2"
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
    amount: 0.25,
  }}
  transition={{
    duration: 0.5,
    delay: 0.15,
  }}
>
  <ProjectOverview
    challenge={project.challenge}
    solution={project.solution}
    features={project.features}
    technologies={project.technologies}
  />
</motion.div>
<motion.div
  ref={githubRef}
  id="github"
  className="scroll-mt-32 px-10 pt-2"
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
    amount: 0.25,
  }}
  transition={{
    duration: 0.5,
    delay: 0.15,
  }}
>
  <GithubAnalyticsSection
    repository={repository}
    languages={languages}
    loading={loading}
  />
</motion.div>
<motion.div
  ref={metricsRef}
  id="metrics"
  className="scroll-mt-32 px-10 pt-2"
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
    amount: 0.25,
  }}
  transition={{
    duration: 0.5,
    delay: 0.15,
  }}
>

  <MetricsDashboard
  metrics={project.metrics}
/>

</motion.div>
<motion.div
  ref={architectureRef}
  id="architecture"
  className="scroll-mt-32 px-10 pt-10"
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
    amount: 0.25,
  }}
  transition={{
    duration: 0.5,
    delay: 0.15,
  }}
>
  <ProjectArchitecture
    architecture={project.architecture}
  />
</motion.div>

<motion.div
  ref={galleryRef}
  id="gallery"
  className="scroll-mt-32 px-10 pt-2"
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
    amount: 0.25,
  }}
  transition={{
    duration: 0.5,
    delay: 0.15,
  }}
>
  <ProjectGallery
    screenshots={project.screenshots}
  />
</motion.div> 

<div className="px-10 pb-10 pt-8">
  <ProjectActions
    title={project.title}
    github={project.github}
    live={project.live}
  />
</div>
</div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
