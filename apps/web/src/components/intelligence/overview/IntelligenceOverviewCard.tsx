"use client";

interface IntelligenceOverviewCardProps {
  title: string;
  description?: string;
  onClick: () => void;
}

export function IntelligenceOverviewCard({
  title,
  description,
  onClick,
}: IntelligenceOverviewCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-left transition-all duration-200 hover:border-cyan-400/30 hover:bg-white/[0.05] focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/50"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-semibold text-white transition-colors group-hover:text-cyan-300">
            {title}
          </h3>

          {description ? (
            <p className="mt-2 text-sm leading-6 text-zinc-400">
              {description}
            </p>
          ) : null}
        </div>

        <span
          aria-hidden="true"
          className="text-zinc-600 transition-transform duration-200 group-hover:translate-x-1 group-hover:text-cyan-400"
        >
          →
        </span>
      </div>
    </button>
  );
}