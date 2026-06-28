"use client";

import { motion } from "framer-motion";

export function ScrollIndicator() {
  return (
    <motion.div
      animate={{ y: [0, 10, 0] }}
      transition={{
        repeat: Infinity,
        duration: 2,
      }}
      className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 lg:block"
    >
      <div className="flex h-14 w-8 justify-center rounded-full border border-white/20">
        <motion.div
          animate={{
            y: [2, 22, 2],
          }}
          transition={{
            repeat: Infinity,
            duration: 2,
          }}
          className="mt-2 h-3 w-3 rounded-full bg-blue-500"
        />
      </div>
    </motion.div>
  );
}