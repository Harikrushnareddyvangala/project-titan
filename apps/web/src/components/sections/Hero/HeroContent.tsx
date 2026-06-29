"use client";

import { motion } from "framer-motion";

import { AvailabilityBadge } from "./AvailabilityBadge";
import { HeroButtons } from "./HeroButtons";
import { HeroSocial } from "./HeroSocial";
import { HeroStats } from "./HeroStats";
import { HeroTyping } from "./HeroTyping";

import {
  fadeUp,
  staggerContainer,
} from "@/lib/animations";

export function HeroContent() {
  return (
    <motion.div
      className="max-w-4xl"
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      {/* Badge */}
      <motion.div variants={fadeUp}>
        <AvailabilityBadge />
      </motion.div>

      {/* Name */}
      <motion.h1
        variants={fadeUp}
        className="mt-8 text-5xl font-black leading-tight tracking-tight text-white md:text-7xl"
      >
        Harikrushnareddy
        <br />
        <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-400 bg-clip-text text-transparent">
          Vangala
        </span>
      </motion.h1>

      {/* Typing */}
      <motion.div variants={fadeUp}>
        <HeroTyping />
      </motion.div>

      {/* Description */}
      <motion.p
        variants={fadeUp}
        className="mt-8 max-w-2xl text-lg leading-8 text-zinc-300"
      >
        Building enterprise-grade AI, Machine Learning,
        Data Science, Analytics and Business Intelligence
        solutions with modern cloud technologies and
        exceptional user experiences.
      </motion.p>

      {/* Buttons */}
      <motion.div variants={fadeUp}>
        <HeroButtons />
      </motion.div>

      {/* Social */}
      <motion.div variants={fadeUp}>
        <HeroSocial />
      </motion.div>

      {/* Stats */}
      <motion.div variants={fadeUp}>
        <HeroStats />
      </motion.div>
    </motion.div>
  );
}