"use client";

function SkeletonCard() {
  return (
    <div
      className="
        animate-pulse
        rounded-2xl
        border
        border-white/10
        bg-white/5
        p-6
      "
    >
      <div className="mb-5 h-5 w-36 rounded bg-zinc-700" />

      <div className="mb-3 h-8 w-20 rounded bg-zinc-700" />

      <div className="h-4 w-28 rounded bg-zinc-800" />
    </div>
  );
}

export function GithubSkeleton() {
  return (
    <section className="space-y-8">
      <div>
        <div className="mb-3 h-8 w-72 animate-pulse rounded bg-zinc-700" />

        <div className="h-5 w-96 animate-pulse rounded bg-zinc-800" />
      </div>

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>

      <div
        className="
          animate-pulse
          rounded-3xl
          border
          border-white/10
          bg-white/5
          p-8
        "
      >
        <div className="mb-6 h-6 w-48 rounded bg-zinc-700" />

        <div className="space-y-4">
          <div className="h-4 rounded bg-zinc-800" />

          <div className="h-4 w-5/6 rounded bg-zinc-800" />

          <div className="h-4 w-4/6 rounded bg-zinc-800" />
        </div>
      </div>
    </section>
  );
}