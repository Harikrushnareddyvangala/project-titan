"use client";

import { motion } from "framer-motion";
import { careerTimeline } from "./data";

export function AboutTimeline() {
  return (
    <div>
      <div className="mb-12">
        <span className="text-sm font-semibold uppercase tracking-[0.35em] text-cyan-300">
          Journey
        </span>

        <h3 className="mt-4 text-3xl font-bold text-white">
          My Engineering Evolution
        </h3>

        <p className="mt-4 max-w-xl leading-8 text-zinc-400">
          Every stage of my career expanded how I think about software,
          from understanding data to designing intelligent systems.
        </p>
      </div>

      <div className="relative border-l border-cyan-500/20">
        {careerTimeline.map((item, index) => (
          <motion.div
            key={item.year}
            initial={{ opacity: 0, x: -25 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.6,
              delay: index * 0.15,
            }}
            className="relative ml-8 pb-16"
          >
            {/* Timeline Node */}
            <div className="absolute -left-[41px] top-2 flex h-6 w-6 items-center justify-center rounded-full border border-cyan-400/30 bg-slate-900">
              <div className="h-2.5 w-2.5 rounded-full bg-cyan-400" />
            </div>

            {/* Year */}
            <span className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">
              {item.year}
            </span>

            {/* Card */}
            <div className="mt-4 rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl transition-all duration-300 hover:border-cyan-400/40 hover:bg-white/10">
              <h4 className="text-2xl font-bold text-white">
                {item.role}
              </h4>

              <p className="mt-2 text-cyan-400">
                {item.company}
              </p>

              <p className="mt-6 leading-8 text-zinc-400">
                {item.description}
              </p>

              <div className="mt-8 flex flex-wrap gap-2">
                {item.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 text-xs font-medium text-cyan-300 transition hover:border-cyan-400 hover:bg-cyan-500/20"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}