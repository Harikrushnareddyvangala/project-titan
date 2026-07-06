"use client";

import { motion } from "framer-motion";

interface LanguageProgressProps {
  language: string;
  value: number;
  percentage: number;
  color: string;
}

export function LanguageProgress({
  language,
  value,
  percentage,
  color,
}: LanguageProgressProps) {
  return (
    <div className="space-y-2">

      <div className="flex items-center justify-between">

        <div className="flex items-center gap-3">

          <span
            className="h-3 w-3 rounded-full"
            style={{
              backgroundColor: color,
            }}
          />

          <span className="font-medium text-white">
            {language}
          </span>

        </div>

        <span className="text-sm text-zinc-400">
          {percentage.toFixed(1)}%
        </span>

      </div>

      <div className="h-2 overflow-hidden rounded-full bg-white/10">

        <motion.div
          initial={{
            width: 0,
          }}
          whileInView={{
            width: `${percentage}%`,
          }}
          viewport={{
            once: true,
          }}
          transition={{
            duration: 1,
            ease: "easeOut",
          }}
          className="h-full rounded-full"
          style={{
            backgroundColor: color,
          }}
        />

      </div>

      <p className="text-xs text-zinc-500">
        {value.toLocaleString()} bytes
      </p>

    </div>
  );
}