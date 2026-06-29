"use client";

import { motion } from "framer-motion";

import { careerTimeline } from "./data";

export function AboutTimeline() {
  return (
    <div className="relative border-l border-cyan-500/20 pl-6">
        <h3 className="mb-8 text-2xl font-bold text-white">
        Professional Journey
      </h3>

      {careerTimeline.map((item, index) => (
        <motion.div
          key={item.year}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            duration:0.6,
  delay:    index*0.2
          }}
          className="relative mb-10"
        >
          {/* Timeline Node */}
          <div className="absolute -left-[34px] top-1 h-4 w-4 rounded-full bg-cyan-400 shadow-lg shadow-cyan-500/50" />
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl transition duration-300 hover:border-cyan-500/40 hover:bg-white/10">
          <div className="text-sm font-medium text-cyan-400">
            {item.year}
          </div>

          <h3 className="mt-1 text-xl font-semibold text-white">
            { 
                <div>
                    <h3 className="text-xl font-bold text-white">
                        {item.role}
                     </h3>

                    <p className="text-cyan-400">
                        {item.company}
                    </p>
                </div>
            }
          </h3>

          <p className="mt-2 leading-7 text-zinc-400">
            {item.description}
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            {item.technologies.map((tech) => (
              <span
                key={tech}
                className="rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 text-xs font-medium text-cyan-300"
              >
                {tech}
              </span>
            ))}
          </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}