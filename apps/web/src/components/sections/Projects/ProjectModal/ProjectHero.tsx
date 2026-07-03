"use client";
import { useMemo, useRef } from "react";
import Image from "next/image";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import type {
  GithubRepository,
} from "@/types/github";


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

const technologyIcons: Record<
  string,
  string
> = {
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
}
function RepositoryRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <motion.div
      whileHover={{
        x: 4,
      }}
      className="
        flex
        items-center
        justify-between
        rounded-xl
        border
        border-white/5
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
  value: React.ReactNode;
}) {
  return (
    <div
      className="
      rounded-full
      border
      border-cyan-500/30
      bg-cyan-500/10
      px-4
      py-2
      text-sm
      text-cyan-300
      backdrop-blur-xl
    "
    >
      <span className="font-semibold">
        {label}
      </span>

      {" "}

      {value}
    </div>
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
          y: 15,
        },
        visible: {
          opacity: 1,
          y: 0,
        },
      }}
      whileHover={{
        scale: 1.08,
        y: -4,
      }}
      transition={{
        type: "spring",
        stiffness: 350,
      }}
      className="
        rounded-full
        border
        border-white/10
        bg-white/5
        px-4
        py-2
        text-sm
        font-medium
        text-white
        backdrop-blur-xl
        transition-all
        duration-300
        hover:border-cyan-400
        hover:bg-cyan-500/10
        hover:text-cyan-300
      "
    >
      <span>
  {technologyIcons[technology] ?? "⚡"}
</span>

<span className="ml-2">
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
  technologies
}: ProjectHeroProps) {
  
const particles = useMemo(
  () =>
    Array.from({ length: 12 }, (_, i) => ({
      id: i,
      left: (i * 17) % 100,
      top: (i * 29) % 100,
      duration: 4 + (i % 5),
    })),
  [],
);
const mouseX = useMotionValue(0);
const mouseY = useMotionValue(0);

const springX = useSpring(mouseX, {
  stiffness: 120,
  damping: 18,
});

const springY = useSpring(mouseY, {
  stiffness: 120,
  damping: 18,
});

const rotateY = useTransform(
  springX,
  [-0.5, 0.5],
  [-8, 8],
);

const rotateX = useTransform(
  springY,
  [-0.5, 0.5],
  [8, -8],
);

const handleMouseMove = (
  event: React.MouseEvent<HTMLDivElement>,
) => {
  const rect =
    event.currentTarget.getBoundingClientRect();

  const x =
    (event.clientX - rect.left) / rect.width - 0.5;

  const y =
    (event.clientY - rect.top) / rect.height - 0.5;

  mouseX.set(x);

  mouseY.set(y);
};

const resetMouse = () => {
  mouseX.set(0);
  mouseY.set(0);
const heroRef =
  useRef<HTMLDivElement>(null);

const mouseX =
  useMotionValue(0);

const mouseY =
  useMotionValue(0);

const springX =
  useSpring(mouseX, {
    stiffness: 120,
    damping: 18,
  });

const springY =
  useSpring(mouseY, {
    stiffness: 120,
    damping: 18,
  });

const imageX =
  useTransform(
    springX,
    [-300, 300],
    [-18, 18],
  );

const imageY =
  useTransform(
    springY,
    [-300, 300],
    [-18, 18],
  );

const contentX =
  useTransform(
    springX,
    [-300, 300],
    [-8, 8],
  );

const contentY =
  useTransform(
    springY,
    [-300, 300],
    [-8, 8],
  );

const cardX =
  useTransform(
    springX,
    [-300, 300],
    [12, -12],
  );

const cardY =
  useTransform(
    springY,
    [-300, 300],
    [12, -12],
  );

const handleMouseMove = (
  e: React.MouseEvent<HTMLDivElement>,
) => {
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
};

const resetMouse = () => {
  mouseX.set(0);
  mouseY.set(0);
};
};  
  return (
    <motion.div
  className="
    relative
    h-[560px]
    w-full
    overflow-hidden
    rounded-t-3xl
    perspective-[1800px]
  "
  onMouseMove={handleMouseMove}
  onMouseLeave={resetMouse}
  style={{
    rotateX,
    rotateY,
  }}
>
      <motion.div
  className="
    absolute
    -left-32
    -top-32
    h-80
    w-80
    rounded-full
    bg-cyan-500/20
    blur-[120px]
  "
  animate={{
    x: [0, 40, -20, 0],
    y: [0, -30, 20, 0],
    scale: [1, 1.15, 0.95, 1],
  }}
  transition={{
    duration: 14,
    repeat: Infinity,
    ease: "easeInOut",
  }}
/>

<motion.div
  className="
    absolute
    bottom-0
    right-0
    h-72
    w-72
    rounded-full
    bg-violet-500/20
    blur-[120px]
  "
  animate={{
    x: [0, -50, 30, 0],
    y: [0, 30, -20, 0],
    scale: [1, 0.9, 1.2, 1],
  }}
  transition={{
    duration: 18,
    repeat: Infinity,
    ease: "easeInOut",
  }}
/>
      {/* Cinematic Background Image */}

<motion.div
  initial={{
    scale: 1.15,
  }}
  animate={{
    scale: 1,
  }}
  transition={{
    duration: 4,
    ease: "easeOut",
  }}
  className="absolute inset-0 overflow-hidden"
>
  <motion.div
    animate={{
      y: [-8, 8, -8],
      scale: [1, 1.03, 1],
    }}
    transition={{
      duration: 16,
      repeat: Infinity,
      ease: "easeInOut",
    }}
    className="absolute inset-0"
  >
    <Image
      src={image}
      alt={title}
      fill
      priority
      className="
        object-cover
        brightness-[0.48]
        contrast-125
        saturate-125
      "
    />
  </motion.div>

  {/* Top spotlight */}

  <motion.div
    className="
      absolute
      -top-52
      left-1/2
      h-[700px]
      w-[700px]
      -translate-x-1/2
      rounded-full
      bg-cyan-400/15
      blur-[140px]
      mix-blend-screen
    "
    animate={{
      opacity: [0.25, 0.55, 0.25],
      scale: [1, 1.15, 1],
    }}
    transition={{
      duration: 9,
      repeat: Infinity,
      ease: "easeInOut",
    }}
  />

  {/* Bottom glow */}

  <motion.div
    className="
      absolute
      bottom-[-250px]
      right-[-120px]
      h-[500px]
      w-[500px]
      rounded-full
      bg-violet-500/20
      blur-[150px]
      mix-blend-screen
    "
    animate={{
      opacity: [0.15, 0.4, 0.15],
      scale: [1, 1.2, 1],
    }}
    transition={{
      duration: 12,
      repeat: Infinity,
      ease: "easeInOut",
    }}
  />

  {/* Moving light beam */}

  <motion.div
    className="
      absolute
      inset-y-0
      -left-1/2
      w-1/3
      bg-gradient-to-r
      from-transparent
      via-white/8
      to-transparent
      rotate-12
      blur-3xl
    "
    animate={{
      x: ["-20%", "220%"],
    }}
    transition={{
      duration: 10,
      repeat: Infinity,
      ease: "linear",
    }}
  />
</motion.div>
{/* Aurora Background */}

<AuroraBackground />
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/50 to-black/20" />
      <div
  className="
    absolute
    inset-0
    bg-white/[0.02]
    backdrop-blur-[2px]
  "
/>
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
    duration: 35,
    repeat: Infinity,
    ease: "linear",
  }}
/>
      {/* Decorative Blur */}
      <motion.div
  className="
    absolute
    inset-0
    bg-gradient-to-r
    from-cyan-500/15
    via-transparent
    to-violet-500/15
    mix-blend-screen
  "
  animate={{
    opacity: [0.3, 0.7, 0.4],
  }}
  transition={{
    duration: 8,
    repeat: Infinity,
    ease: "easeInOut",
  }}
/>
<div className="absolute inset-0 overflow-hidden">
  {particles.map((particle) => (
    <motion.div
      key={particle.id}
      className="
        absolute
        h-1
        w-1
        rounded-full
        bg-cyan-300/40
      "
      style={{
        left: `${particle.left}%`,
        top: `${particle.top}%`,
      }}
      animate={{
        y: [0, -40, 0],
        opacity: [0.2, 1, 0.2],
      }}
      transition={{
        duration: particle.duration,
        repeat: Infinity,
      }}
    />
  ))}
</div>
      {/* Content */}
      <div
  className="
    absolute
    bottom-16
    left-14
    right-14
    grid
    gap-14
    lg:grid-cols-[1.6fr_0.8fr]
    items-end
  "
>
<div className="space-y-6">
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
          className="mt-5 text-6xl xl:text-7xl font-bold tracking-tight text-white"
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
          className="mt-5 max-w-4xl text-xl leading-8 text-zinc-300"
        >
          {summary}
        </motion.p>
        {repository && (
  <div className="mt-6 flex flex-wrap gap-3">
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
  </div>
)}

<motion.div
  className="mt-8 flex flex-wrap gap-3"
  initial="hidden"
  animate="visible"
  variants={{
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.08,
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
</div>
<div className="hidden lg:block">
  <motion.div
  initial={{
    opacity: 0,
    x: 40,
  }}
  animate={{
    opacity: 1,
    x: 0,
  }}
  transition={{
    delay: 0.5,
  }}
  className="
    rounded-3xl
    border
    border-white/10
    bg-white/5
    backdrop-blur-2xl
    p-8
    shadow-2xl
  "
>

  <h3 className="text-lg font-semibold text-white">
    Repository
  </h3>
  <div className="mt-8 space-y-4">

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
  label="Size"
  value={`${(
    repository.size / 1024
  ).toFixed(1)} MB`}
/>

<RepositoryRow
  icon={<GitBranch size={18} />}
  label="Branch"
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
  label="Updated"
  value={new Date(
    repository.updated_at,
  ).toLocaleDateString()}
 />
</>

)}

</div>

</motion.div>

</div>
      </div>
    </div>
  );
}