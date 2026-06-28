"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";

import { fadeUp } from "@/lib/animations";

interface MotionRevealProps {
  children: ReactNode;
}

export function MotionReveal({
  children,
}: MotionRevealProps) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      animate="visible"
    >
      {children}
    </motion.div>
  );
}