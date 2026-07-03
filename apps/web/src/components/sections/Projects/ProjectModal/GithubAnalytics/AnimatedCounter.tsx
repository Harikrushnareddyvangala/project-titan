"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect } from "react";

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
}

export function AnimatedCounter({
  value,
  duration = 1.6,
  prefix = "",
  suffix = "",
  decimals = 0,
}: AnimatedCounterProps) {
  const motionValue = useMotionValue(0);

  const spring = useSpring(motionValue, {
    damping: 24,
    stiffness: 90,
  });

  const display = useTransform(
    spring,
    (latest) =>
      `${prefix}${latest.toFixed(decimals)}${suffix}`,
  );

  useEffect(() => {
    motionValue.set(value);
  }, [motionValue, value]);

  return (
    <motion.span
      className="
        font-bold
        tracking-tight
        text-white
      "
    >
      <motion.span>
        {display}
      </motion.span>
    </motion.span>
  );
}