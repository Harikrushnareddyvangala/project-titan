"use client";

import { motion } from "framer-motion";

interface MetricRingProps {
  value: number;
  label: string;
  size?: number;
  stroke?: number;
}

export function MetricRing({
  value,
  label,
  size = 140,
  stroke = 10,
}: MetricRingProps) {
  const radius =
    (size - stroke) / 2;

  const circumference =
    2 * Math.PI * radius;

  const offset =
    circumference -
    (value / 100) *
      circumference;

  return (
    <div className="flex flex-col items-center">

      <div
        className="relative"
        style={{
          width: size,
          height: size,
        }}
      >
        <svg
          width={size}
          height={size}
          className="-rotate-90"
        >
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,.08)"
            strokeWidth={stroke}
          />

          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="url(#gradient)"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={
              circumference
            }
            initial={{
              strokeDashoffset:
                circumference,
            }}
            animate={{
              strokeDashoffset:
                offset,
            }}
            transition={{
              duration: 1.5,
              ease: "easeOut",
            }}
          />

          <defs>

            <linearGradient
              id="gradient"
            >
              <stop
                offset="0%"
                stopColor="#22d3ee"
              />

              <stop
                offset="100%"
                stopColor="#3b82f6"
              />

            </linearGradient>

          </defs>

        </svg>

        <div
          className="
            absolute
            inset-0
            flex
            flex-col
            items-center
            justify-center
          "
        >
          <motion.span
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            transition={{
              delay: .5,
            }}
            className="
              text-3xl
              font-bold
              text-white
            "
          >
            {value}%
          </motion.span>

        </div>

      </div>

      <p
        className="
          mt-5
          text-center
          font-medium
          text-zinc-400
        "
      >
        {label}
      </p>

    </div>
  );
}