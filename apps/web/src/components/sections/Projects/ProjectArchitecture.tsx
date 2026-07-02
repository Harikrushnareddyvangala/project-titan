"use client";

import { motion } from "framer-motion";
import { ArchitectureCanvas } from "./ProjectArchitecture/ArchitectureCanvas";

interface ProjectArchitectureProps {
  architecture: string[];
}

export function ProjectArchitecture({
  architecture,
}: ProjectArchitectureProps) {
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
      transition={{
        duration: 0.5,
      }}
      className="space-y-8"
    >
      <div>
        <h3 className="text-3xl font-bold text-white">
          System Architecture
        </h3>

        <p className="mt-2 text-zinc-400">
          High-level architecture of the application.
        </p>
      </div>

      <ArchitectureCanvas />
    </motion.section>
  );
}