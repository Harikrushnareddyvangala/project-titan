"use client";

import CountUp from "react-countup";
import { motion } from "framer-motion";

import type { ProjectMetric } from "./project-details";

interface ProjectMetricsProps {
  metrics: ProjectMetric[];
}

export function ProjectMetrics({
  metrics,
}: ProjectMetricsProps) {
  return (
    <section className="space-y-8">
      <h3 className="text-2xl font-semibold text-white">
        Project Metrics
      </h3>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric, index) => {
          const value = parseFloat(
            metric.value.replace("%", ""),
          );

          return (
            <motion.div
              key={metric.label}
              initial={{
                opacity: 0,
                y: 40,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{
                once: true,
              }}
              transition={{
                delay: index * 0.1,
              }}
              whileHover={{
                y: -8,
                scale: 1.03,
              }}
              className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center backdrop-blur-xl"
            >
              <h4 className="text-4xl font-bold text-cyan-400">
                <CountUp
                  end={value}
                  duration={2}
                  decimals={1}
                />
                %
              </h4>

              <p className="mt-3 text-zinc-400">
                {metric.label}
              </p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}