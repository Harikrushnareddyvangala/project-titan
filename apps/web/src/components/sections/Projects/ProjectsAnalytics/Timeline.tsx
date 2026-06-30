"use client";

import { motion } from "framer-motion";

const timeline = [
  {
    year: "2022",
    title: "Data Analytics",
  },
  {
    year: "2023",
    title: "Machine Learning",
  },
  {
    year: "2024",
    title: "Deep Learning",
  },
  {
    year: "2025",
    title: "Generative AI",
  },
  {
    year: "2026",
    title: "AI Engineering",
  },
];

export function Timeline() {
  return (
    <div
      className="
      rounded-3xl
      border
      border-white/10
      bg-white/5
      p-8
      backdrop-blur-xl
    "
    >
      <h3 className="mb-10 text-2xl font-semibold text-white">
        Learning Journey
      </h3>

      <div className="space-y-6">
        {timeline.map((item, index) => (
          <motion.div
            key={item.year}
            initial={{
              opacity: 0,
              x: -30,
            }}
            whileInView={{
              opacity: 1,
              x: 0,
            }}
            viewport={{
              once: true,
            }}
            transition={{
              delay: index * 0.1,
            }}
            className="flex items-center gap-5"
          >
            <div
              className="
              flex
              h-14
              w-14
              items-center
              justify-center
              rounded-full
              bg-cyan-500
              font-bold
              text-white
            "
            >
              {item.year}
            </div>

            <div>
              <h4 className="font-semibold text-white">
                {item.title}
              </h4>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}