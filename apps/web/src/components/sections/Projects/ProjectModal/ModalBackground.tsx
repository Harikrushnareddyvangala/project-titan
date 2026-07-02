"use client";

import { motion } from "framer-motion";

export function ModalBackground() {
  return (
    <>
      {/* Grid */}

      <div
        className="
absolute
inset-0
opacity-[0.05]
[background-image:linear-gradient(rgba(255,255,255,.15)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.15)_1px,transparent_1px)]
[background-size:60px_60px]
"
      />

      {/* Glow 1 */}

      <motion.div
        className="
absolute
-left-32
-top-32
h-96
w-96
rounded-full
bg-cyan-500/15
blur-[120px]
"
        animate={{
  x: [0, 40],
  y: [0, 30],
}}
        transition={{
  duration: 9,
  repeat: Infinity,
  repeatType: "reverse",
  ease: "easeInOut",
}}
      />

      {/* Glow 2 */}

      <motion.div
        className="
absolute
right-0
bottom-0
h-[500px]
w-[500px]
rounded-full
bg-blue-500/10
blur-[160px]
"
        animate={{
  x: [0, 40],
  y: [0, 30],
}}
        transition={{
  duration: 9,
  repeat: Infinity,
  repeatType: "reverse",
  ease: "easeInOut",
}}
      />
    </>
  );
}