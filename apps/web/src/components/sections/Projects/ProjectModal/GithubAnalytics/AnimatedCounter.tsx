"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useState } from "react";

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
}

export function AnimatedCounter({
  value,
  duration = 1.8,
  prefix = "",
  suffix = "",
}: AnimatedCounterProps) {
  const motionValue = useMotionValue(0);

  const spring = useSpring(motionValue, {
    damping: 28,
    stiffness: 90,
  });

  const [display, setDisplay] = useState(0);

  useEffect(() => {
    motionValue.set(value);
  }, [value, motionValue]);

  useEffect(() => {
    const unsubscribe = spring.on("change", (latest) => {
      setDisplay(Math.round(latest));
    });

    return unsubscribe;
  }, [spring]);

  return (
    <motion.span
      initial={{
        opacity: 0,
        y: 10,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration,
      }}
    >
      {prefix}
      {display.toLocaleString()}
      {suffix}
    </motion.span>
  );
}