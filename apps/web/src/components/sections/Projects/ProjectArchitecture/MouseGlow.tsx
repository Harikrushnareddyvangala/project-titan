"use client";

import { motion } from "framer-motion";
import { useState } from "react";

export function MouseGlow() {
  const [position, setPosition] = useState({
    x: 0,
    y: 0,
  });

  return (
    <div
      className="absolute inset-0 overflow-hidden"
      onMouseMove={(e) => {
        const rect =
          e.currentTarget.getBoundingClientRect();

        setPosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
      }}
    >
      <motion.div
        animate={{
          x: position.x - 180,
          y: position.y - 180,
        }}
        transition={{
          type: "tween",
          duration: 0.25,
          ease: "easeOut",
        }}
        className="
          pointer-events-none
          absolute
          h-[360px]
          w-[360px]
          rounded-full
          bg-cyan-400/10
          blur-[100px]
        "
      />
    </div>
  );
}