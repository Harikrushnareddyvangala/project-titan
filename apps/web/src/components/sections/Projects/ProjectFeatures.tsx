"use client";

import { motion } from "framer-motion";
import {
  Brain,
  BarChart3,
  ShieldCheck,
  Cpu,
  Database,
  Sparkles,
} from "lucide-react";

interface ProjectFeaturesProps {
  features: string[];
}

const icons = [
  ShieldCheck,
  Brain,
  Cpu,
  Database,
  BarChart3,
  Sparkles,
];

export function ProjectFeatures({
  features,
}: ProjectFeaturesProps) {
  return (
    <section className="space-y-8">
      <h3 className="text-2xl font-semibold text-white">
        Key Features
      </h3>

      <div className="grid gap-6 md:grid-cols-2">
        {features.map((feature, index) => {
          const Icon =
            icons[index % icons.length];

          return (
            <motion.div
              key={feature}
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
              }}
              transition={{
                delay: index * 0.08,
              }}
              whileHover={{
                y: -6,
                scale: 1.02,
              }}
              className="group rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl transition"
            >
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/20 text-cyan-400 transition group-hover:bg-cyan-500 group-hover:text-white">
                <Icon className="h-6 w-6" />
              </div>

              <h4 className="text-lg font-semibold text-white">
                {feature}
              </h4>

              <p className="mt-2 text-sm leading-6 text-zinc-400">
                Designed for production-grade AI
                systems with scalability,
                performance, and usability in
                mind.
              </p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}