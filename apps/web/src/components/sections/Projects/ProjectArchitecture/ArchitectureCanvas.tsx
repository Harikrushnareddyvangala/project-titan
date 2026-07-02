"use client";

import {
  Globe,
  Server,
  Database,
  Brain,
} from "lucide-react";

import { ArchitectureNode } from "./ArchitectureNode";
import { ArchitectureConnection } from "./ArchitectureConnection";
import { ArchitectureBackground } from "./ArchitectureBackground";
import { FloatingParticles } from "./FloatingParticles";
import { MouseGlow } from "./MouseGlow";
export function ArchitectureCanvas() {
  return (
    <div
      className="
        relative
        overflow-hidden
        rounded-[36px]
        border
        border-white/10
        bg-gradient-to-br
        from-zinc-950
        via-zinc-900
        to-black
        p-12
      "
    >
        <ArchitectureBackground />
        <MouseGlow />
        <FloatingParticles />
      {/* Connection Layer */}

      <div className="absolute inset-0 hidden xl:block">

        <ArchitectureConnection
          x1={180}
          y1={150}
          x2={520}
          y2={150}
        />

        <ArchitectureConnection
          x1={560}
          y1={150}
          x2={900}
          y2={150}
          color="#8b5cf6"
          delay={0.4}
        />

        <ArchitectureConnection
          x1={520}
          y1={180}
          x2={520}
          y2={390}
          color="#22c55e"
          delay={0.8}
        />

      </div>

      {/* Node Layout */}

      <div className="relative z-10">

        <div className="grid gap-12 xl:grid-cols-3">

          <ArchitectureNode
            title="Frontend"
            subtitle="Next.js"
            icon={Globe}
            color="#22d3ee"
          />

          <ArchitectureNode
            title="API"
            subtitle="FastAPI"
            icon={Server}
            color="#38bdf8"
            delay={0.2}
          />

          <ArchitectureNode
            title="Database"
            subtitle="PostgreSQL"
            icon={Database}
            color="#8b5cf6"
            delay={0.4}
          />

        </div>

        <div className="mt-24 flex justify-center">

          <ArchitectureNode
            title="ML Engine"
            subtitle="Scikit-Learn"
            icon={Brain}
            color="#22c55e"
            delay={0.6}
          />

        </div>

      </div>
    </div>
  );
}