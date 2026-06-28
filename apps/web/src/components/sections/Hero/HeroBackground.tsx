"use client";

import { useMousePosition } from "@/hooks/useMousePosition";

export function HeroBackground() {
  const { x, y } = useMousePosition();

  return (
    <>
      {/* Base gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-zinc-950 via-zinc-950 to-black" />

      {/* Aurora layer */}
      <div className="pointer-events-none absolute inset-0 opacity-60">
        <div
          className="absolute -top-40 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-gradient-to-r from-blue-500/20 via-cyan-400/20 to-indigo-500/20 blur-[120px] animate-pulse"
          style={{
            transform: `translate(${x * 20}px, ${y * 20}px)`,
          }}
        />

        <div className="absolute bottom-0 left-0 h-[500px] w-[500px] rounded-full bg-cyan-500/10 blur-[140px]" />

        <div className="absolute right-0 top-1/3 h-[400px] w-[400px] rounded-full bg-blue-600/10 blur-[140px]" />
      </div>

      {/* Grid */}
      <div className="hero-grid absolute inset-0 opacity-40" />
    </>
  );
}