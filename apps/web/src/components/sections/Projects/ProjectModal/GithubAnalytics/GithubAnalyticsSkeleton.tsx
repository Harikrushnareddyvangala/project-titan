"use client";

function SkeletonCard({
  className = "",
}: {
  className?: string;
}) {
  return (
    <div
      className={`
        animate-pulse
        rounded-3xl
        border
        border-white/10
        bg-white/[0.03]
        ${className}
      `}
    />
  );
}

export function GithubAnalyticsSkeleton() {
  return (
    <section className="space-y-8">

      <SkeletonCard className="h-52" />

      <div className="grid gap-8 lg:grid-cols-[320px_1fr]">

        <SkeletonCard className="h-[420px]" />

        <div className="grid gap-5 sm:grid-cols-2">

          {Array.from({ length: 6 }).map((_, index) => (
            <SkeletonCard
              key={index}
              className="h-36"
            />
          ))}

        </div>

      </div>

      <SkeletonCard className="h-80" />

      <SkeletonCard className="h-72" />

      <SkeletonCard className="h-64" />

    </section>
  );
}