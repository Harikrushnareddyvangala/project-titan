    "use client";

import { motion } from "framer-motion";

interface ArchitectureConnectionProps {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  color?: string;
  delay?: number;
}

export function ArchitectureConnection({
  x1,
  y1,
  x2,
  y2,
  color = "#22d3ee",
  delay = 0,
}: ArchitectureConnectionProps) {
  const dx = x2 - x1;
  const dy = y2 - y1;

  return (
    <svg
      className="absolute inset-0 pointer-events-none overflow-visible"
      width="100%"
      height="100%"
    >
      {/* Background line */}
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke="rgba(255,255,255,.08)"
        strokeWidth="3"
      />

      {/* Animated gradient line */}
      <motion.line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
        initial={{
          pathLength: 0,
        }}
        animate={{
          pathLength: 1,
        }}
        transition={{
          duration: 1.2,
          delay,
        }}
      />

      {/* Moving packet */}
      <motion.circle
        r="6"
        fill={color}
        filter="url(#glow)"
        initial={{
          cx: x1,
          cy: y1,
        }}
        animate={{
          cx: [x1, x2],
          cy: [y1, y2],
        }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          repeatType: "loop",
          ease: "linear",
          delay,
        }}
      />

      <defs>
        <filter
          id="glow"
          x="-50%"
          y="-50%"
          width="200%"
          height="200%"
        >
          <feGaussianBlur
            stdDeviation="4"
            result="coloredBlur"
          />

          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
    </svg>
  );
}