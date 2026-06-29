"use client";

import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

interface ProjectArchitectureProps {
  architecture: string[];
}

export function ProjectArchitecture({
  architecture,
}: ProjectArchitectureProps) {
  return (
    <section className="space-y-8">
      <h3 className="text-2xl font-semibold text-white">
        System Architecture
      </h3>

      <div className="mx-auto max-w-2xl">
        {architecture.map((step, index) => (
          <div key={step}>
            <motion.div
              initial={{
                opacity: 0,
                x: -40,
              }}
              whileInView={{
                opacity: 1,
                x: 0,
              }}
              viewport={{
                once: true,
              }}
              transition={{
                duration: 0.4,
                delay: index * 0.15,
              }}
              whileHover={{
                scale: 1.02,
              }}
              className="flex items-center gap-5 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl transition"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-cyan-500 font-bold text-white">
                {index + 1}
              </div>

              <div>
                <p className="text-lg font-medium text-white">
                  {step}
                </p>
              </div>
            </motion.div>

            {index < architecture.length - 1 && (
              <div className="flex justify-center py-3">
                <ChevronDown className="h-6 w-6 text-cyan-400" />
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}