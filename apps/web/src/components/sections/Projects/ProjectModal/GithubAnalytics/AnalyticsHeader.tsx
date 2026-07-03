"use client";

import { motion } from "framer-motion";
import {  Activity } from "lucide-react";
import { FaGithub } from "react-icons/fa";

import type { GithubRepository } from "@/types/github";

interface AnalyticsHeaderProps {
  repository: GithubRepository;
}

export function AnalyticsHeader({
  repository,
}: AnalyticsHeaderProps) {
  return (
    <div
      className="
        relative
        overflow-hidden
        rounded-[34px]
        border
        border-white/10
        bg-white/[0.04]
        backdrop-blur-3xl
        p-8
      "
    >
      {/* Animated Glow */}

      <motion.div
        className="
          absolute
          -right-24
          -top-24
          h-64
          w-64
          rounded-full
          bg-cyan-500/15
          blur-[120px]
        "
        animate={{
          scale: [1, 1.25, 1],
          opacity: [0.25, 0.55, 0.25],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
        }}
      />

      <div className="relative z-10">

        <div className="flex flex-wrap items-center justify-between gap-6">

          {/* Left */}

          <div>

            <div className="flex items-center gap-3">

              <div
                className="
                  flex
                  h-14
                  w-14
                  items-center
                  justify-center
                  rounded-2xl
                  border
                  border-cyan-400/20
                  bg-cyan-500/10
                "
              >
                <FaGithub
                  className="text-cyan-300"
                  size={26}
                />
              </div>

              <div>

                <h2
                  className="
                    text-3xl
                    font-bold
                    text-white
                  "
                >
                  GitHub Analytics
                </h2>

                <p
                  className="
                    mt-1
                    text-sm
                    text-zinc-400
                  "
                >
                  Live repository insights powered by GitHub API
                </p>

              </div>

            </div>

          </div>

          {/* Right */}

          <motion.div
            animate={{
              scale: [1, 1.08, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
            className="
              flex
              items-center
              gap-3
              rounded-full
              border
              border-emerald-400/20
              bg-emerald-500/10
              px-5
              py-2
            "
          >
            <Activity
              className="text-emerald-300"
              size={18}
            />

            <span
              className="
                text-sm
                font-semibold
                text-emerald-300
              "
            >
              Live Data
            </span>

          </motion.div>

        </div>

        {/* Repository Information */}

        <div
          className="
            mt-8
            grid
            gap-6
            md:grid-cols-3
          "
        >
          <InfoCard
            label="Repository"
            value={repository.name}
          />

          <InfoCard
            label="Owner"
            value={repository.owner.login}
          />

          <InfoCard
            label="Default Branch"
            value={repository.default_branch}
          />

        </div>

      </div>

    </div>
  );
}

function InfoCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <motion.div
      whileHover={{
        y: -4,
      }}
      transition={{
        type: "spring",
        stiffness: 300,
      }}
      className="
        rounded-2xl
        border
        border-white/10
        bg-white/[0.03]
        p-5
      "
    >
      <p
        className="
          text-xs
          uppercase
          tracking-widest
          text-zinc-500
        "
      >
        {label}
      </p>

      <p
        className="
          mt-2
          truncate
          text-lg
          font-semibold
          text-white
        "
      >
        {value}
      </p>

    </motion.div>
  );
}