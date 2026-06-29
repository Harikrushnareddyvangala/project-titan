"use client";

import { motion } from "framer-motion";
import {
  Brain,
  Database,
  Globe,
  Server,
  Code2,
  Cpu,
} from "lucide-react";

interface ProjectTechStackProps {
  technologies: string[];
}

const iconMap: Record<
  string,
  React.ComponentType<{ className?: string }>
> = {
  Python: Brain,
  Pandas: Database,
  NumPy: Database,
  "Scikit-learn": Cpu,
  XGBoost: Cpu,
  SHAP: Brain,
  Streamlit: Globe,
  React: Code2,
  "Next.js": Globe,
  TypeScript: Code2,
  JavaScript: Code2,
  Tailwind: Globe,
  "Tailwind CSS": Globe,
  OpenAI: Brain,
  RAG: Server,
  "Power BI": Database,
};

export function ProjectTechStack({
  technologies,
}: ProjectTechStackProps) {
  return (
    <section className="space-y-8">
      <h3 className="text-2xl font-semibold text-white">
        Technology Stack
      </h3>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {technologies.map((tech, index) => {
          const Icon =
            iconMap[tech] ?? Code2;

          return (
            <motion.div
              key={tech}
              initial={{
                opacity: 0,
                y: 20,
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
                y: -5,
                scale: 1.03,
              }}
              className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl transition"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/20 text-cyan-400">
                <Icon className="h-6 w-6" />
              </div>

              <span className="font-medium text-white">
                {tech}
              </span>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}