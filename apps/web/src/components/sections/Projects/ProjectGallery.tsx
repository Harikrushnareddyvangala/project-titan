"use client";

import { useState } from "react";
import { motion } from "framer-motion";

import { ProjectGalleryItem } from "./ProjectGalleryItem";
import { ProjectLightbox } from "./ProjectLightbox";

interface ProjectGalleryProps {
  screenshots: string[];
}

export function ProjectGallery({
  screenshots,
}: ProjectGalleryProps) {
  const [selected, setSelected] = useState(0);
  const [open, setOpen] = useState(false);

  const openImage = (index: number) => {
    setSelected(index);
    setOpen(true);
  };

  const nextImage = () => {
    setSelected((prev) =>
      prev === screenshots.length - 1 ? 0 : prev + 1
    );
  };

  const previousImage = () => {
    setSelected((prev) =>
      prev === 0 ? screenshots.length - 1 : prev - 1
    );
  };

  return (
    <>
      <motion.section
        initial={{
          opacity: 0,
          y: 30,
        }}
        whileInView={{
          opacity: 1,
          y: 0,
        }}
        viewport={{
          once: true,
        }}
        transition={{
          duration: 0.45,
        }}
      >
        <h3 className="mb-6 text-xl font-semibold text-cyan-400">
          Gallery
        </h3>

        <div className="grid gap-6 md:grid-cols-2">
          {screenshots.map((image, index) => (
            <ProjectGalleryItem
              key={image}
              src={image}
              index={index}
              onClick={() => openImage(index)}
            />
          ))}
        </div>
      </motion.section>

      <ProjectLightbox
        images={screenshots}
        selected={selected}
        open={open}
        onClose={() => setOpen(false)}
        onNext={nextImage}
        onPrevious={previousImage}
        onSelect={setSelected}
      />
    </>
  );
}