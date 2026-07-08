"use client";

import Image from "next/image";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";

import {
  useRef,
  type ReactNode,
} from "react";

import {
  Star,
  GitFork,
  Eye,
  CalendarDays,
  HardDrive,
  GitBranch,
  ShieldCheck,
} from "lucide-react";

import { AuroraBackground } from "./AuroraBackground";
import { ProjectHeroActions } from "./ProjectHeroActions";

import type {
  GithubRepository,
} from "@/types/github";

const technologyIcons: Record<string, string> = {
  Python: "🐍",
  TypeScript: "📘",
  JavaScript: "🟨",
  React: "⚛️",
  "Next.js": "▲",
  Tailwind: "💨",
  Docker: "🐳",
  PostgreSQL: "🐘",
  MongoDB: "🍃",
  Redis: "🟥",
  Streamlit: "📊",
  Pandas: "🐼",
  NumPy: "📐",
  XGBoost: "🌲",
  SHAP: "🔍",
  "Power BI": "📈",
  OpenAI: "🤖",
  "Scikit-learn": "🧠",
};

interface ProjectHeroProps {
  title: string;
  summary: string;
  image: string;
  repository?: GithubRepository | null;
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
}

function RepositoryRow({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: ReactNode;
}) {
  return (
    <motion.div
      whileHover={{
        x: 5,
        backgroundColor: "rgba(255,255,255,.05)",
      }}
      transition={{
        duration: 0.25,
      }}
      className="
      flex
      items-center
      justify-between
      rounded-xl
      border
      border-white/10
      bg-white/[0.03]
      px-4
      py-3
      "
    >
      <div className="flex items-center gap-3">
        <div className="text-cyan-400">
          {icon}
        </div>

        <span className="text-zinc-300">
          {label}
        </span>
      </div>

      <span className="font-semibold text-white">
        {value}
      </span>
    </motion.div>
  );
}

function HeroBadge({
  label,
  value,
}: {
  label: string;
  value: ReactNode;
}) {
  return (
    <motion.div
      whileHover={{
        scale: 1.05,
      }}
      className="
      rounded-full
      border
      border-cyan-400/30
      bg-cyan-500/10
      px-5
      py-2.5
      backdrop-blur-xl
      "
    >
      <span className="font-semibold text-cyan-300">
        {label}
      </span>

      <span className="ml-2 text-white">
        {value}
      </span>
    </motion.div>
  );
}

function TechnologyBadge({
  technology,
}: {
  technology: string;
}) {
  return (
    <motion.div
      variants={{
        hidden: {
          opacity: 0,
          y: 18,
        },
        visible: {
          opacity: 1,
          y: 0,
        },
      }}
      whileHover={{
        y: -5,
        scale: 1.08,
      }}
      transition={{
        type: "spring",
        stiffness: 350,
      }}
      className="
      flex
      items-center
      gap-2
      rounded-full
      border
      border-white/10
      bg-white/5
      px-5
      py-2.5
      backdrop-blur-xl
      hover:border-cyan-400
      hover:bg-cyan-500/10
      "
    >
      <span className="text-lg">
        {technologyIcons[technology] ?? "⚡"}
      </span>

      <span className="text-sm font-medium text-white">
        {technology}
      </span>
    </motion.div>
  );
}

export function ProjectHero({
  title,
  summary,
  image,
  repository,
  technologies,
  githubUrl,
  liveUrl,
}: ProjectHeroProps) {
  const heroRef =
    useRef<HTMLDivElement>(null);

  const mouseX =
    useMotionValue(0);

  const mouseY =
    useMotionValue(0);

  const rotateY =
    useSpring(
      useTransform(
        mouseX,
        [-300, 300],
        [-10, 10],
      ),
      {
        stiffness: 120,
        damping: 20,
      },
    );

  const rotateX =
    useSpring(
      useTransform(
        mouseY,
        [-300, 300],
        [10, -10],
      ),
      {
        stiffness: 120,
        damping: 20,
      },
    );

  function handleMouseMove(
    e: React.MouseEvent<HTMLDivElement>,
  ) {
    if (!heroRef.current) return;

    const rect =
      heroRef.current.getBoundingClientRect();

    mouseX.set(
      e.clientX -
        rect.left -
        rect.width / 2,
    );

    mouseY.set(
      e.clientY -
        rect.top -
        rect.height / 2,
    );
  }

  const particles = [
  { id: 0, left: 8, top: 12, size: 3, duration: 9 },
  { id: 1, left: 18, top: 25, size: 2, duration: 11 },
  { id: 2, left: 30, top: 18, size: 4, duration: 10 },
  { id: 3, left: 42, top: 34, size: 3, duration: 12 },
  { id: 4, left: 55, top: 20, size: 2, duration: 9 },
  { id: 5, left: 68, top: 38, size: 4, duration: 13 },
  { id: 6, left: 80, top: 16, size: 3, duration: 10 },
  { id: 7, left: 92, top: 28, size: 2, duration: 11 },
  { id: 8, left: 12, top: 55, size: 4, duration: 12 },
  { id: 9, left: 25, top: 68, size: 3, duration: 9 },
  { id: 10, left: 37, top: 52, size: 2, duration: 10 },
  { id: 11, left: 50, top: 72, size: 4, duration: 13 },
  { id: 12, left: 63, top: 60, size: 3, duration: 11 },
  { id: 13, left: 76, top: 80, size: 2, duration: 10 },
  { id: 14, left: 89, top: 58, size: 4, duration: 12 },
  { id: 15, left: 6, top: 85, size: 3, duration: 9 },
  { id: 16, left: 18, top: 90, size: 2, duration: 11 },
  { id: 17, left: 30, top: 76, size: 4, duration: 13 },
  { id: 18, left: 44, top: 88, size: 3, duration: 10 },
  { id: 19, left: 58, top: 94, size: 2, duration: 12 },
  { id: 20, left: 70, top: 74, size: 4, duration: 9 },
  { id: 21, left: 82, top: 90, size: 3, duration: 10 },
  { id: 22, left: 94, top: 82, size: 2, duration: 11 },
  { id: 23, left: 15, top: 40, size: 4, duration: 13 },
  { id: 24, left: 28, top: 8, size: 3, duration: 9 },
  { id: 25, left: 40, top: 96, size: 2, duration: 10 },
  { id: 26, left: 52, top: 44, size: 4, duration: 12 },
  { id: 27, left: 66, top: 6, size: 3, duration: 11 },
  { id: 28, left: 78, top: 48, size: 2, duration: 9 },
  { id: 29, left: 90, top: 66, size: 4, duration: 12 },
];

  

  return (
        <div
      ref={heroRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => {
        mouseX.set(0);
        mouseY.set(0);
      }}
      className="
      relative
      h-[560px]
      overflow-hidden
      rounded-t-3xl
      "
    >
      {/* Aurora */}
      <AuroraBackground />

<motion.div
  className="
absolute
inset-0
bg-[radial-gradient(circle_at_center,rgba(6,182,212,.12),transparent_65%)]
"
  animate={{
    opacity: [0.5, 0.9, 0.5],
    scale: [1, 1.08, 1],
  }}
  transition={{
    duration: 8,
    repeat: Infinity,
  }}
/>
      {/* Cinematic Background Image */}

      <motion.div
        style={{
          rotateX,
          rotateY,
          transformPerspective: 1200,
        }}
        className="absolute inset-0 z-0"
      >
        <motion.div
          initial={{
            scale: 1.12,
          }}
          animate={{
  scale: 1,
}}
          transition={{
            duration: 2,
            ease: "easeOut",
          }}
          className="absolute inset-0"
        >
          <Image
            src={image}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority
            className="
            object-cover
            object-center
            select-none
            "
          />
        </motion.div>
      </motion.div>

      {/* Cinematic Lighting */}

      

      

      {/* Animated Grid */}

      <motion.div
        className="
        absolute
        inset-0
        opacity-[0.06]
        bg-[linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)]
        bg-[size:48px_48px]
        "
        animate={{
          backgroundPosition: [
            "0px 0px",
            "48px 48px",
          ],
        }}
        transition={{
          duration: 40,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      {/* Glass Overlay */}

      <div
        className="
        absolute
        inset-0
        bg-black/40
        "
      />

      <div
        className="
        absolute
        inset-0
        z-20
        bg-gradient-to-t
        from-zinc-950
        via-zinc-950/45
        to-black/10
        "
      />

      {/* Floating Particles */}

      <div className="absolute inset-0 overflow-hidden z-10">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full bg-cyan-300/40"
            style={{
              left: `${particle.left}%`,
              top: `${particle.top}%`,
              width: particle.size,
              height: particle.size,
            }}
            animate={{
              y: [0, -50, 0],
              opacity: [0.15, 1, 0.15],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Spotlight */}

      <motion.div
        className="
        absolute
        inset-0
        z-10
        bg-gradient-to-r
        from-cyan-500/15
        via-transparent
        to-violet-500/15
        mix-blend-screen
        "
        animate={{
          opacity: [.3, .7, .3],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Main Layout */}

      <div
className="
absolute
inset-x-14
bottom-14
z-30
grid
gap-14
lg:grid-cols-[1.6fr_.8fr]
items-end
"
>
                {/* Left Content */}

        <motion.div
          initial={{
            opacity: 0,
            y: 40,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.8,
          }}
          className="space-y-7"
        >
          {/* Featured Badge */}

          <motion.div
            initial={{
              opacity: 0,
              y: 15,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 0.15,
            }}
          >
            <div className="flex flex-wrap items-center gap-3">

<span
className ="inline-flex items-center
rounded-full
border
border-cyan-400/30
bg-cyan-500/10
px-5
py-2
text-sm
font-medium
text-cyan-300
backdrop-blur-xl
"
>
✨ Featured Project
</span>

{repository && (
<>
<span
className="
inline-flex
items-center
rounded-full
bg-emerald-500/10
border
border-emerald-500/20
px-4
py-2
text-xs
font-semibold
text-emerald-300
"
>
🟢 Public Repository
</span>

<span
className="
inline-flex
items-center
rounded-full
bg-orange-500/10
border
border-orange-500/20
px-4
py-2
text-xs
font-semibold
text-orange-300
"
>
Updated {new Date(repository.updated_at).toLocaleDateString()}
</span>
</>
)}

</div>
          </motion.div>

          {/* Project Title */}

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
              delay: 0.25,
            }}
            className="
            max-w-5xl
            text-6xl
md:text-7xl
xl:text-8xl
            font-black
            leading-none
            tracking-tight
            text-white
            drop-shadow-[0_0_30px_rgba(34,211,238,.25)]
            xl:text-7xl
            "
          >
            {title}
          </motion.h1>

          {/* Summary */}

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
              delay: 0.4,
            }}
            className="
            max-w-4xl
text-xl
md:text-2xl
leading-9
text-zinc-300
font-light
            "
          >
            {summary}
          </motion.p>

          {/* Repository Badges */}

          {repository && (
            <motion.div
              className="mt-8 flex flex-wrap gap-4 rounded-2xl px-6 py-4 bg-gradient-to-br from-cyan-500/20 to-blue-500/10"
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 0.55,
              }}
            >
              <HeroBadge
                label="⭐ Stars"
                value={repository.stargazers_count}
              />

              <HeroBadge
                label="⑂ Forks"
                value={repository.forks_count}
              />

              <HeroBadge
                label="👀 Watchers"
                value={repository.watchers_count}
              />
            </motion.div>
          )}

          {/* Technology Stack */}

          <motion.div
            className="
            mt-10
            flex
            flex-wrap
            gap-3
            rounded-2xl
            hover:border-cyan-400/60
hover:bg-cyan-500/15
hover:shadow-[0_0_30px_rgba(6,182,212,.35)]
            "
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: 0.05,
                },
              },
            }}
          >
            {technologies.map((technology) => (
              <TechnologyBadge
                key={technology}
                technology={technology}
                
              />
            ))}
          </motion.div>
          {/* Project Buttons */}
          <ProjectHeroActions
  githubUrl={githubUrl}
  liveUrl={liveUrl}
/>
        </motion.div>
        
                {/* Repository Card */}

        
          <motion.div
            initial={{
              opacity: 0,
              x: 60,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            transition={{
              delay: 0.55,
              duration: 0.8,
            }}
            whileHover={{
y:-12,
scale:1.025,
rotateX:2,
rotateY:-2
}}
            className="
            relative
            overflow-hidden
            rounded-[34px]
            border
            border-white/10
            bg-gradient-to-br
from-white/[0.08]
to-white/[0.03]
            backdrop-blur-3xl
            shadow-[0_30px_120px_rgba(0,0,0,.55)]
            "
          >
            {/* Animated Top Border */}

            < motion.div
              className="
              h-1.5
              w-full
              bg-gradient-to-r
              from-cyan-400
              via-blue-500
              to-violet-500
              "
              animate={{
                backgroundPosition: [
                  "0%",
                  "100%",
                  "0%",
                ],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
              }}
            />

            {/* Floating Glow */}

            <motion.div
              className="
              absolute
              -right-16
              -top-16
              h-48
              w-48
              rounded-full
              bg-cyan-500/10
              blur-[90px]
              "
              animate={{
                scale: [1, 1.2, 1],
                opacity: [.25, .55, .25],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
              }}
            />

            <div className="relative p-8">

              <div className="mb-8 flex items-center justify-between">

                <div>

                  <h3 className="text-xl font-semibold text-white">
                    Repository
                  </h3>

                  <p className="mt-2 text-sm text-zinc-400">
                    Live GitHub statistics
                  </p>

                </div>

                <div
                  className="
                  rounded-full
                  border
                  border-emerald-400/20
                  bg-emerald-500/10
                  px-4
                  py-2
                  text-xs
                  font-semibold
                  uppercase
                  tracking-wider
                  text-emerald-300
                  "
                >
                 LIVE API
                </div>

              </div>

              <div className="space-y-4">

                {repository && (
                  <>
                    <RepositoryRow
                      icon={<Star size={18} />}
                      label="Stars"
                      value={repository.stargazers_count}
                    />

                    <RepositoryRow
                      icon={<GitFork size={18} />}
                      label="Forks"
                      value={repository.forks_count}
                    />

                    <RepositoryRow
                      icon={<Eye size={18} />}
                      label="Watchers"
                      value={repository.watchers_count}
                    />

                    <RepositoryRow
                      icon={<HardDrive size={18} />}
                      label="Repository Size"
                      value={`${(
                        repository.size / 1024
                      ).toFixed(1)} MB`}
                    />

                    <RepositoryRow
                      icon={<GitBranch size={18} />}
                      label="Default Branch"
                      value={repository.default_branch}
                    />

                    <RepositoryRow
                      icon={<ShieldCheck size={18} />}
                      label="Visibility"
                      value={
                        repository.private
                          ? "Private"
                          : "Public"
                      }
                    />

                    <RepositoryRow
                      icon={<CalendarDays size={18} />}
                      label="Last Updated"
                      value={new Date(
                        repository.updated_at,
                      ).toLocaleDateString()}
                    />
                  </>
                )}

              </div>

            </div>
          </motion.div>
        </div>

      </div>
    
  );
} 