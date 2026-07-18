"use client";

import { motion } from "framer-motion";
import {
  Code2,
  Brain,
} from "lucide-react";

import type {
  GithubLanguages,
} from "@/types/github";

interface Props {
  languages: GithubLanguages;
}

interface LanguageItem {
  name: string;
  bytes: number;
  percentage: number;
}

export function LanguageAnalytics({
  languages,
}: Props) {
  const totalBytes = Object.values(languages).reduce(
    (sum, value) => sum + value,
    0,
  );

  const languageList: LanguageItem[] = Object.entries(
    languages,
  )
    .map(([name, bytes]) => ({
      name,
      bytes,
      percentage:
        totalBytes === 0
          ? 0
          : Number(
              ((bytes / totalBytes) * 100).toFixed(1),
            ),
    }))
    .sort((a, b) => b.bytes - a.bytes);

  const dominant =
    languageList[0]?.name ?? "Unknown";

  return (
    <motion.section
    id = "languages"
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
      <motion.div
        className="
          absolute
          -right-20
          -top-20
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
        <div className="flex items-center gap-3">
          <Brain className="text-cyan-400" />

          <div>
            <h3 className="text-2xl font-bold text-white">
              AI Language Analytics
            </h3>

            <p className="text-zinc-400">
              Technology stack composition
            </p>
          </div>
        </div>

        <div className="mt-10 space-y-6">
          {languageList.map((language, index) => (
            <motion.div
              key={language.name}
              initial={{
                opacity: 0,
                y: 20,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{
                once: true,
              }}
              transition={{
                delay: index * 0.08,
              }}
            >
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Code2
                    size={18}
                    className="text-cyan-400"
                  />

                  <span className="text-white">
                    {language.name}
                  </span>
                </div>

                <span className="font-semibold text-cyan-300">
                  {language.percentage}%
                </span>
              </div>

              <div className="h-3 overflow-hidden rounded-full bg-white/10">
                <motion.div
                  initial={{
                    width: 0,
                  }}
                  whileInView={{
                    width: `${language.percentage}%`,
                  }}
                  viewport={{
                    once: true,
                  }}
                  transition={{
                    duration: 1.2,
                  }}
                  className="
                    h-full
                    rounded-full
                    bg-gradient-to-r
                    from-cyan-400
                    via-blue-500
                    to-violet-500
                  "
                />
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          whileHover={{
            scale: 1.02,
          }}
          className="
            mt-10
            rounded-3xl
            border
            border-cyan-400/20
            bg-cyan-500/10
            p-6
          "
        >
          <h4 className="text-lg font-semibold text-white">
            AI Technology Summary
          </h4>

          <p className="mt-5 leading-8 text-zinc-300">
            Dominant Language:
            <span className="ml-2 font-semibold text-cyan-300">
              {dominant}
            </span>

            <br />

            Languages Detected:
            <span className="ml-2 font-semibold text-cyan-300">
              {languageList.length}
            </span>

            <br />

            AI Assessment:
            <span className="ml-2 font-semibold text-cyan-300">
              Modern multi-language repository with a balanced technology stack.
            </span>
          </p>
        </motion.div>
      </div>
    </motion.section>
  );
}