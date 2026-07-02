"use client";

import { motion } from "framer-motion";

interface ProjectNavigationProps {
  active: string;
  progress: number;
  onSelect: (section: string) => void;
}

const sections = [
  "Overview",
  "Architecture",
  "Metrics",
  "Gallery",
  "GitHub",
];

export function ProjectNavigation({
  active,
  progress,
  onSelect,
}: ProjectNavigationProps) {
  return (
    <div
      className="
relative
border-b
border-white/10
bg-zinc-950/70
backdrop-blur-2xl
"
    >
      {/* Progress Bar */}

      <div className="mx-auto max-w-xl px-8 pt-5">

        <div
          className="
h-2
overflow-hidden
rounded-full
bg-white/10
"
        >
          <motion.div
            className="
h-full
rounded-full
bg-gradient-to-r
from-cyan-400
to-blue-500
"
            animate={{
              width: `${progress}%`,
            }}
            transition={{
              type: "spring",
  stiffness: 120,
  damping: 20,
            }}
          />
        </div>

        <div
          className="
mt-2
text-center
text-xs
tracking-wider
text-zinc-500
"
        >
          {Math.round(progress)}% Complete
        </div>

      </div>

      <div
        className="
flex
justify-center
gap-3
overflow-x-auto
px-8
py-5
"
      >
        {sections.map((section) => {
          const selected =
            active === section;

          return (
            <motion.button
              key={section}
              whileHover={{
                y: -2,
              }}
              whileTap={{
                scale: 0.96,
              }}
              onClick={() =>
                onSelect(section)
              }
              className={`
relative
overflow-hidden
whitespace-nowrap
rounded-full
px-6
py-3
text-sm
font-medium
transition-all
duration-300
focus:outline-none
focus:ring-2
focus:ring-cyan-400/40

${
  selected
    ? "text-cyan-300"
    : "text-zinc-400 hover:text-white hover:bg-white/5"
}
`}
            >
              {selected && (
                <motion.div
                  layoutId="project-navigation-pill"
                  className="
absolute
inset-0
rounded-full
bg-cyan-500/15
border
border-cyan-400/40
"
                  transition={{
                    type: "spring",
                    stiffness: 350,
                    damping: 30,
                  }}
                />
              )}

              <span className="relative z-10">
                {section}
              </span>

            </motion.button>
          );
        })}
      </div>
    </div>
  );
} 