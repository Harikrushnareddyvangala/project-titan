"use client";

import { useEffect, useState } from "react";

const roles = [
  "AI Engineer",
  "Data Scientist",
  "Machine Learning Engineer",
  "Power BI Developer",
  "Full Stack Developer",
  "Cloud Engineer",
  "DevOps Engineer",
  "Researcher",
];

export function HeroTyping() {
  const [index, setIndex] = useState(0);
  const [display, setDisplay] = useState("");
  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    const current = roles[index];

    if (charIndex < current.length) {
      const timeout = setTimeout(() => {
        setDisplay(current.slice(0, charIndex + 1));
        setCharIndex((v) => v + 1);
      }, 80);

      return () => clearTimeout(timeout);
    } else {
      const timeout = setTimeout(() => {
        setCharIndex(0);
        setIndex((i) => (i + 1) % roles.length);
        setDisplay("");
      }, 1400);

      return () => clearTimeout(timeout);
    }
  }, [charIndex, index]);

  return (
    <p className="mt-6 text-2xl font-semibold text-cyan-400 md:text-3xl">
      {display}
      <span className="animate-pulse">|</span>
    </p>
  );
}