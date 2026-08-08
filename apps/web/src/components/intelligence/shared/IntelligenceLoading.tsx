export function IntelligenceLoading() {
  return (
    <section
      aria-label="Loading repository intelligence"
      className="space-y-6"
    >
      <div className="space-y-3">
        <div className="h-4 w-40 animate-pulse rounded bg-white/10" />
        <div className="h-9 w-72 animate-pulse rounded bg-white/10" />
        <div className="h-4 max-w-2xl animate-pulse rounded bg-white/10" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="h-28 animate-pulse rounded-2xl border border-white/10 bg-white/[0.03]"
          />
        ))}
      </div>

      <div className="grid gap-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="h-24 animate-pulse rounded-2xl border border-white/10 bg-white/[0.03]"
          />
        ))}
      </div>
    </section>
  );
}