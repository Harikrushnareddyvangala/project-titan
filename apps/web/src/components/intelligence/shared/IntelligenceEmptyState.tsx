interface IntelligenceEmptyStateProps {
  title?: string;
  description?: string;
}

export function IntelligenceEmptyState({
  title = "Intelligence unavailable",
  description = "Repository intelligence is not available yet. Run the repository analysis and try again.",
}: IntelligenceEmptyStateProps) {
  return (
    <section
      aria-live="polite"
      className="rounded-3xl border border-white/10 bg-white/[0.02] p-8 text-center"
    >
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-400">
        Repository Intelligence
      </p>

      <h2 className="mt-3 text-2xl font-black text-white">
        {title}
      </h2>

      <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-zinc-400">
        {description}
      </p>
    </section>
  );
}