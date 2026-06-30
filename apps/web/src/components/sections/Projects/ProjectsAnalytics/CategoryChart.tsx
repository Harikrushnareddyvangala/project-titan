"use client";

import { motion } from "framer-motion";

interface Category {
  name: string;
  value: number;
}

interface Props {
  categories: Category[];
}

export function CategoryChart({
  categories,
}: Props) {
  return (
    <div
      className="
      rounded-3xl
      border
      border-white/10
      bg-white/5
      backdrop-blur-xl
      p-8
    "
    >
      <h3 className="mb-8 text-2xl font-semibold text-white">
        Categories
      </h3>

      <div className="flex flex-wrap gap-4">
        {categories.map((category, index) => (
          <motion.div
            key={category.name}
            initial={{
              opacity: 0,
              scale: 0.8,
            }}
            whileInView={{
              opacity: 1,
              scale: 1,
            }}
            viewport={{
              once: true,
            }}
            transition={{
              delay: index * 0.08,
            }}
            whileHover={{
              y: -5,
              scale: 1.05,
            }}
            className="
              rounded-full
              border
              border-cyan-500/20
              bg-cyan-500/10
              px-5
              py-3
            "
          >
            <div className="text-white">
              {category.name}
            </div>

            <div className="mt-1 text-center text-cyan-400">
              {category.value}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}