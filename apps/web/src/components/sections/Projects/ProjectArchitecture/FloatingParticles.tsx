"use client";

import { motion } from "framer-motion";

const particles = Array.from(
  { length: 18 },
  (_, i) => ({
    id: i,
    left: `${(i * 97) % 100}%`,
    top: `${(i * 53) % 100}%`,
    duration: 5 + (i % 6),
  }),
);

export function FloatingParticles() {
  return (
    <>
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="
            absolute
            h-1.5
            w-1.5
            rounded-full
            bg-cyan-300/40
          "
          style={{
            left: particle.left,
            top: particle.top,
          }}
          animate={{
            y: [0, -30],
            opacity: [0.2, 1],
          }}
          transition={{
            type: "tween",
            duration: particle.duration,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
        />
      ))}
    </>
  );
}