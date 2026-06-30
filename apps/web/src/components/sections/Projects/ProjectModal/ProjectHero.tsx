"use client";

import Image from "next/image";
import { motion } from "framer-motion";

interface ProjectHeroProps {
  title: string;
  summary: string;
  image: string;
}

export function ProjectHero({
  title,
  summary,
  image,
}: ProjectHeroProps) {
  return (
    <div className="relative h-[420px] w-full overflow-hidden rounded-t-3xl">
      {/* Background Image */}
      <Image
        src={image}
        alt={title}
        fill
        priority
        className="object-cover"
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/50 to-black/20" />

      {/* Decorative Blur */}
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-transparent to-purple-500/10" />

      {/* Content */}
      <div className="absolute bottom-12 left-10 right-10">

        <motion.div
          initial={{
            opacity: 0,
            y: 25,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.5,
          }}
        >
          <span className="inline-flex rounded-full border border-cyan-400/30 bg-cyan-500/10 px-4 py-1 text-sm font-medium text-cyan-300 backdrop-blur-md">
            Featured Project
          </span>
        </motion.div>

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
            delay: 0.15,
            duration: 0.55,
          }}
          className="mt-5 text-5xl font-bold tracking-tight text-white"
        >
          {title}
        </motion.h1>

        <motion.p
          initial={{
            opacity: 0,
            y: 30,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.3,
            duration: 0.55,
          }}
          className="mt-5 max-w-3xl text-lg leading-8 text-zinc-300"
        >
          {summary}
        </motion.p>

      </div>
    </div>
  );
}