"use client";

import { motion } from "framer-motion";
import {
  Globe,
  Lock,
  GitBranch,
  CalendarDays,
  AlertCircle,
  Scale,
  Circle,
} from "lucide-react";

import type { GithubRepository } from "@/types/github";
import { AnimatedCounter } from "./AnimatedCounter";

interface Props {
  repository: GithubRepository;
}

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 15,
  },
  visible: {
    opacity: 1,
    y: 0,
  },
};

function InfoItem({
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
      variants={itemVariants}
      whileHover={{
        y: -4,
        scale: 1.02,
      }}
      transition={{
        type: "spring",
        stiffness: 260,
      }}
      className="
        rounded-2xl
        border
        border-white/[0.08]
        bg-white/[0.03]
        p-4
      "
    >
      <div className="flex items-center gap-2 text-sm text-zinc-400">
        {icon}
        {label}
      </div>

      <div className="mt-2 text-lg font-semibold text-white">
        {value}
      </div>
    </motion.div>
  );
}

export function RepositoryOverviewCard({
  repository,
}: Props) {
  return (
    <motion.section
      initial={{
        opacity: 0,
        y: 25,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      viewport={{
        once: true,
        amount: 0.2,
      }}
      transition={{
        duration: 0.5,
      }}
      className="
        relative
        overflow-hidden
        rounded-[34px]
        border
        border-white/[0.08]
        bg-white/[0.05]
        backdrop-blur-3xl
        p-6
        lg:p-8
        min-h-[300px]
      "
    >
      <motion.div
        className="
          pointer-events-none
          absolute
          -right-32
          -top-32
          h-72
          w-72
          rounded-full
          bg-cyan-500/10
          blur-[120px]
        "
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.15, 0.4, 0.15],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
        }}
      />

      <div className="relative z-10">

        <div className="flex items-center justify-between">

          <div>

            <h3 className="text-2xl font-bold text-white">
              Repository Overview
            </h3>

            <p className="mt-2 text-zinc-400">
              Core repository information
            </p>

          </div>

          <motion.div
            animate={{
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
            className="
              rounded-full
              border
              border-cyan-500/20
              bg-cyan-500/10
              px-4
              py-2
              text-sm
              font-semibold
              text-cyan-300
            "
          >
            LIVE
          </motion.div>

        </div>

        <div className="mt-8">

          <motion.h2
            initial={{
              opacity: 0,
              y: 15,
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
            className="text-3xl font-black text-white"
          >
            {repository.name}
          </motion.h2>

          <motion.p
            initial={{
              opacity: 0,
            }}
            whileInView={{
              opacity: 1,
            }}
            viewport={{
              once: true,
            }}
            transition={{
              delay: 0.15,
            }}
            className="mt-3 leading-7 text-zinc-400"
          >
            {repository.description ??
              "No description available."}
          </motion.p>

        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{
            once: true,
          }}
          className="
            mt-8
            grid
            gap-5
            md:grid-cols-2
          "
        >
          <InfoItem
            icon={
              repository.private ? (
                <Lock size={16} />
              ) : (
                <Globe size={16} />
              )
            }
            label="Visibility"
            value={
              repository.private
                ? "Private"
                : "Public"
            }
          />

          <InfoItem
            icon={<GitBranch size={16} />}
            label="Default Branch"
            value={repository.default_branch}
          />

          <InfoItem
            icon={<Scale size={16} />}
            label="License"
            value={
              repository.license?.name ??
              "No License"
            }
          />

          <InfoItem
            icon={<Circle size={16} />}
            label="Primary Language"
            value={
              repository.language ??
              "Unknown"
            }
          />

          <InfoItem
            icon={<AlertCircle size={16} />}
            label="Open Issues"
            value={
              <AnimatedCounter
                value={repository.open_issues_count}
              />
            }
          />

          <InfoItem
            icon={<CalendarDays size={16} />}
            label="Last Updated"
            value={new Date(
              repository.updated_at,
            ).toLocaleDateString()}
          />
        </motion.div>

      </div>

    </motion.section>
  );
}