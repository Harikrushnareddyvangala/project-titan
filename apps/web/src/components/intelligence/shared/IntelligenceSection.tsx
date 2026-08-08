"use client";

import { ReactNode } from "react";

interface IntelligenceSectionProps {
  id: string;
  children: ReactNode;
}

export function IntelligenceSection({
  id,
  children,
}: IntelligenceSectionProps) {
  return (
    <section
      id={`intelligence-${id}`}
      data-intelligence-section={id}
      className="scroll-mt-28"
    >
      <div className="rounded-3xl border border-white/10 bg-white/[0.015] p-5 md:p-7">
        {children}
      </div>
    </section>
  );
}