"use client";

import { useState } from "react";
import Image from "next/image";

import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface ProjectGalleryProps {
  screenshots: string[];
}

export function ProjectGallery({
  screenshots,
}: ProjectGalleryProps) {
  const [current, setCurrent] = useState(0);

  const previous = () => {
    setCurrent((prev) =>
      prev === 0
        ? screenshots.length - 1
        : prev - 1,
    );
  };

  const next = () => {
    setCurrent((prev) =>
      prev === screenshots.length - 1
        ? 0
        : prev + 1,
    );
  };

  return (
    <section className="space-y-6">
      <h3 className="text-2xl font-semibold text-white">
        Gallery
      </h3>

      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5">
        <div className="relative aspect-video">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{
                opacity: 0,
                x: 40,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              exit={{
                opacity: 0,
                x: -40,
              }}
              transition={{
                duration: 0.35,
              }}
              className="absolute inset-0"
            >
              <Image
                src={screenshots[current]}
                alt={`Screenshot ${current + 1}`}
                fill
                priority
                className="object-cover transition duration-700 hover:scale-105"
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {screenshots.length > 1 && (
          <>
            <button
              onClick={previous}
              className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-black/60 p-3 text-white transition hover:bg-cyan-500"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <button
              onClick={next}
              className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-black/60 p-3 text-white transition hover:bg-cyan-500"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}
      </div>

      {screenshots.length > 1 && (
        <div className="flex justify-center gap-3">
          {screenshots.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrent(index)}
              className={`h-3 w-3 rounded-full transition ${
                current === index
                  ? "bg-cyan-400"
                  : "bg-zinc-600 hover:bg-zinc-400"
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}