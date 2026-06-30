"use client";

import Image from "next/image";
import { motion } from "framer-motion";

interface Props {
  src: string;
  index: number;
  onClick: () => void;
}

export function ProjectGalleryItem({
  src,
  index,
  onClick,
}: Props) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      initial={{
        opacity: 0,
        y: 25,
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
        y: -8,
        scale: 1.02,
      }}
      className="
        group
        relative
        overflow-hidden
        rounded-2xl
      "
    >
      <Image
        src={src}
        alt=""
        width={600}
        height={340}
        className="
          h-64
          w-full
          rounded-2xl
          object-cover
          transition
          duration-500
          group-hover:scale-110
        "
      />

      <div
        className="
          absolute
          inset-0
          bg-black/30
          opacity-0
          transition
          group-hover:opacity-100
        "
      />
    </motion.button>
  );
}