"use client";

import { useEffect } from "react";
import Image from "next/image";

import {
  AnimatePresence,
  motion,
} from "framer-motion";

import {
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";

interface ProjectLightboxProps {
  images: string[];
  selected: number;
  open: boolean;
  onClose: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onSelect: (index: number) => void;
}

export function ProjectLightbox({
  images,
  selected,
  open,
  onClose,
  onNext,
  onPrevious,
  onSelect,
}: ProjectLightboxProps) {
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (
      event: KeyboardEvent,
    ) => {
      switch (event.key) {
        case "Escape":
          onClose();
          break;

        case "ArrowRight":
          onNext();
          break;

        case "ArrowLeft":
          onPrevious();
          break;
      }
    };

    window.addEventListener(
      "keydown",
      handleKeyDown,
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown,
      );
    };
  }, [
    open,
    onClose,
    onNext,
    onPrevious,
  ]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-[90] bg-black/90 backdrop-blur-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center p-8"
            initial={{
              opacity: 0,
              scale: 0.95,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              scale: 0.95,
            }}
          >
            <button
              onClick={onClose}
              className="absolute right-8 top-8 rounded-full bg-white/10 p-3 text-white transition hover:bg-cyan-500"
            >
              <X className="h-6 w-6" />
            </button>

            <div
  className="
    absolute
    top-8
    left-8
    rounded-full
    bg-black/50
    px-4
    py-2
    text-sm
    font-medium
    text-white
    backdrop-blur-xl
  "
>
  {selected + 1} / {images.length}
</div>

            <button
              onClick={onPrevious}
              className="absolute left-8 rounded-full border border-white/10 bg-black/50 p-4 backdrop-blur-xl transition-all duration-300 hover:scale-110 hover:border-cyan-400 hover:bg-cyan-500"
              >
            
              <ChevronLeft className="h-7 w-7" />
            </button>

            <motion.div
              key={selected}
              initial={{
                opacity: 0,
                scale: 0.92,
              }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
              exit={{
                opacity: 0,
                scale: 1.05,
              }}
              transition={{
                duration: 0.3,
              }}
              className="relative max-h-[80vh] max-w-6xl"
            >
              <Image
                src={images[selected]}
                alt=""
                width={1600}
                height={900}
                className="max-h-[80vh] w-auto rounded-2xl object-contain"
                priority
              />
            </motion.div>

            <button
              onClick={onNext}
              className="absolute left-8 rounded-full border border-white/10 bg-black/50 p-4 backdrop-blur-xl transition-all duration-300 hover:scale-110 hover:border-cyan-400 hover:bg-cyan-500"
            >
              <ChevronRight className="h-7 w-7" />
            </button>

            <div className="absolute bottom-8 flex gap-3 overflow-auto rounded-full bg-black/40 px-5 py-3 backdrop-blur-xl">
              {images.map((image, index) => (
                <button
                  key={image}
                  onClick={() => onSelect(index)}
                  className={`
overflow-hidden
rounded-xl
border-2
transition-all
duration-300
${
  selected === index
    ? "border-cyan-400 scale-110"
    : "border-transparent opacity-70 hover:opacity-100"
}
`}
                >
                  <motion.div
  whileHover={{
    scale: 1.01,
  }}
>
  <Image
    src={images[selected]}
    alt=""
    width={1600}
    height={900}
    priority
    className="
      max-h-[80vh]
      w-auto
      rounded-2xl
      object-contain
      shadow-2xl
    "
  />
</motion.div>
                </button>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}