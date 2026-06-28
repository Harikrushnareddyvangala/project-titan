"use client";

import { HERO_ROLES } from "@/features/home/constants/roles";
import { useTypingEffect } from "@/hooks/useTypingEffect";

export function HeroHeading() {
  const { text } = useTypingEffect({
    words: [...HERO_ROLES],
    typingSpeed: 90,
    deletingSpeed: 45,
    pauseDuration: 1800,
  });

  return (
    <div className="mt-8">
      <h1 className="text-5xl font-black leading-tight md:text-7xl">
        Building{" "}
        <span className="gradient-text">
          Intelligent
        </span>{" "}
        Solutions
      </h1>

      <p className="mt-6 text-2xl font-semibold text-blue-500 md:text-3xl">
        {text}
        <span className="animate-pulse">|</span>
      </p>
    </div>
  );
}