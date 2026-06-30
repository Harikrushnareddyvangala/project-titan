"use client";

import { motion } from "framer-motion";

interface Technology {
  name: string;
  value: number;
}

interface Props {
  technologies: Technology[];
}

export function TechnologyChart({
  technologies,
}: Props) {
  const max = Math.max(
    ...technologies.map((t) => t.value),
    1,
  );

  return (
    <div
      className="
        rounded-3xl
        border
        border-white/10
        bg-white/5
        p-8
        backdrop-blur-xl
      "
    >
      <h3 className="mb-8 text-2xl font-semibold text-white">
        Technology Distribution
      </h3>

      <div className="space-y-5">
        {technologies.map((tech, index) => (
          <div key={tech.name}>
            <div className="mb-2 flex justify-between">
              <span className="text-zinc-300">
                {tech.name}
              </span>

              <span className="text-cyan-400">
                {tech.value}
              </span>
            </div>

            <div className="h-3 overflow-hidden rounded-full bg-zinc-800">
              <motion.div
                initial={{
                  width: 0,
                }}
                whileInView={{
                  width: `${
                    (tech.value / max) * 100
                  }%`,
                }}
                viewport={{
                  once: true,
                }}
                transition={{
                  duration: 0.8,
                  delay: index * 0.05,
                }}
                className="h-full rounded-full bg-cyan-400"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}